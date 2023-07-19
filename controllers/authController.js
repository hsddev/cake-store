// Dependencies
const crypto = require("crypto");
const jwt = require("jsonwebtoken");

const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");

const createToken = require("../utils/createToken");
const sendEmail = require("../utils/sendEmail");
const ApiError = require("../utils/apiError");
const User = require("../models/User");

/*
 * @Desc register new user
 * @Route POST /api/v1/auth/signup
 * @Access public
 */
const signup = asyncHandler(async (req, res, next) => {
    // 1- create user
    const user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        role: req.body.role,
    });

    // 2- generate token
    const token = createToken(user._id);

    res.status(201).json({
        data: user,
        token: token,
    });
});

/*
 * @Desc login user
 * @Route POST /api/v1/auth/login
 * @Access public
 */
const login = asyncHandler(async (req, res, next) => {
    // 1) check if password and email in the body (validation)
    // 2) check if user exist & check if password is correct
    const user = await User.findOne({ email: req.body.email });

    if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
        return next(new ApiError("Incorrect email or password", 401));
    }
    // 3) generate token
    const token = createToken(user._id);

    // Delete password from response
    delete user._doc.password;
    // 4) send response to client side
    res.status(200).json({ data: user, token });
});

// @desc make sure that the user is logged in
const protect = asyncHandler(async (req, res, next) => {
    // 1) Check if token exist, if exist get
    let token;
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        token = req.headers.authorization.split(" ")[1];
    }
    if (!token) {
        return next(
            new ApiError(
                "You are not login, Please login to get access this route",
                401
            )
        );
    }

    // 2) Verify token (no change happens, expired token)
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    // 3) Check if user exists
    const currentUser = await User.findById(decoded.userId);
    if (!currentUser) {
        return next(
            new ApiError(
                "The user that belong to this token does no longer exist",
                401
            )
        );
    }

    // 4) Check if user change his password after token created
    if (currentUser.passwordChangedAt) {
        const passChangedTimestamp = parseInt(
            currentUser.passwordChangedAt.getTime() / 1000,
            10
        );
        // Password changed after token created (Error)
        if (passChangedTimestamp > decoded.iat) {
            return next(
                new ApiError(
                    "User recently changed his password. please login again..",
                    401
                )
            );
        }
    }

    req.user = currentUser;
    next();
});

// @desc Authorization (permissions)["admin"]
const allowedTo = (...roles) =>
    asyncHandler(async (req, res, next) => {
        // 1) access roles
        // 2) access registered user (req.user.role)
        if (!roles.includes(req.user.role)) {
            return next(
                new ApiError("You are not allowed to access this route", 403)
            );
        }
        next();
    });

/*
 * @Desc Forget password
 * @Route POST /api/v1/auth/forgetPassword
 * @Access public
 */

const forgetPassword = asyncHandler(async (req, res, next) => {
    // 1- Get the user email & check if the user exists
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
        return next(
            new ApiError("There is no user with that email address", 401)
        );
    }

    // 2- If user exists, generate reset random 6 digits and save it in the database
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();

    const hashedResetCode = crypto
        .createHash("sha256")
        .update(resetCode)
        .digest("hex");

    // Save the hashed reset code in the database
    user.passwordResetCode = hashedResetCode;
    // Add expiration time to the reset code (10 minutes)
    user.passwordResetExpires = Date.now() + 10 * 60 * 1000;

    user.passwordResetVerified = false;

    await user.save();

    // 3- Send the reset code via email
    const message = `Hi, ${user.name},\n\nWe received a request to change you password on you E-shop account\n\n Please enter your reset code: ${resetCode}\n\n`;
    try {
        await sendEmail({
            email: user.email,
            subject: "Your password reset code",
            message,
        });
        res.status(200).json({
            status: "success",
            message: "Password reset code sent to your email",
        });
    } catch (err) {
        user.passwordResetCode = undefined;
        user.passwordResetExpires = undefined;
        user.passwordResetVerified = undefined;

        await user.save();

        return next(
            new ApiError(
                "There is an error in sending email, please try again later",
                500
            )
        );
    }
});

/*
 * @Desc Verify reset code
 * @Route POST /api/v1/auth/verifyResetCode
 * @Access public
 */
const verifyPassResetCode = asyncHandler(async (req, res, next) => {
    // 1- Get the user depending on the reset code
    const hashedResetCode = crypto
        .createHash("sha256")
        .update(req.body.resetCode)
        .digest("hex");

    const user = await User.findOne({
        passwordResetCode: hashedResetCode,
        passwordResetExpires: { $gt: Date.now() },
    });

    if (!user) {
        return next(new ApiError("Reset code invalid or expired", 401));
    }

    // Reset code valid
    user.passwordResetVerified = true;

    await user.save();

    res.status(200).json({
        status: "success",
    });
});

/*
 * @Desc Reset password
 * @Route POST /api/v1/auth/resetPassword
 * @Access public
 */
const resetPassword = asyncHandler(async (req, res, next) => {
    // 1- Get user based on email
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
        return next(
            new ApiError("There is no user with that email address", 404)
        );
    }

    // 2- Check if reset code is verified
    if (!user.passwordResetVerified) {
        return next(new ApiError("Reset code not verified", 400));
    }

    user.password = req.body.newPassword;
    user.passwordResetCode = undefined;
    user.passwordResetExpires = undefined;
    user.passwordResetVerified = undefined;

    await user.save();

    // If everything is ok, generate a new token
    const token = createToken(user._id);

    res.status(200).json({
        token,
    });
});

// Export module
module.exports = {
    signup,
    login,
    protect,
    allowedTo,
    forgetPassword,
    verifyPassResetCode,
    resetPassword,
};
