// Dependencies
const asyncHandler = require("express-async-handler");
const sharp = require("sharp");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcryptjs");

const createToken = require("../utils/createToken");
const ApiError = require("../utils/apiError");
const factory = require("./handlersFactory");
const { uploadSingleImage } = require("../middlewares/uploadImageMiddleware");
const User = require("../models/User");

// Upload single image
const uploadProfileImage = uploadSingleImage("profileImage");

// Image processing
const customizeProfileImage = asyncHandler(async (req, res, next) => {
    const fileName = `user-${uuidv4()}-${Date.now()}.jpeg`;

    if (req.file) {
        await sharp(req.file.buffer)
            .resize(600, 600)
            .toFormat("jpeg")
            .jpeg({ quality: 90 })
            .toFile(`uploads/users/${fileName}`);

        // Save image to database
        req.body.profileImage = fileName;
    }

    next();
});

/*
 * @Desc get specific user
 * @Route GET /api/v1/users/:id
 * @Access private/Admin
 */
const getUser = factory.getOne(User);
/*
 * @Desc create user
 * @Route POST /api/v1/users
 * @Access private/Admin
 */
const createUser = factory.createOne(User);

/*
 * @Desc get all users
 * @Route GET /api/v1/users
 * @Access private/Admin
 */
const getUsers = factory.getAll(User);

/*
 * @Desc update specific user
 * @Route PUT /api/v1/users/:id
 * @Access private/Admin
 */
const updateUser = asyncHandler(async (req, res, next) => {
    const document = await User.findByIdAndUpdate(
        req.params.id,
        {
            name: req.body.name,
            email: req.body.email,
            profileImage: req.body.profileImage,
            role: req.body.role,
            phone: req.body.phone,
        },
        {
            new: true,
        }
    );
    if (!document) {
        return next(new ApiError(`No user for this ${req.params.id}`, 404));
    }
    res.status(200).json(document);
});

/*
 * @Desc update specific user password
 * @Route PUT /api/v1/users/:id
 * @Access private/Admin
 */
const updateUserPassword = asyncHandler(async (req, res, next) => {
    const document = await User.findByIdAndUpdate(
        req.params.id,
        {
            password: await bcrypt.hash(req.body.password, 12),
            passwordChangedAt: Date.now(),
        },
        {
            new: true,
        }
    );
    if (!document) {
        return next(new ApiError(`No user for this ${req.params.id}`, 404));
    }
    res.status(200).json(document);
});

/*
 * @Desc delete specific user
 * @Route DELETE /api/v1/users/:id
 * @Access private/Admin
 */
const deleteUser = factory.deleteOne(User);

/*
 * @Desc get logged user data
 * @Route GET /api/v1/users/getMe
 * @Access private/protected
 */

const getLoggedUserData = asyncHandler(async (req, res, next) => {
    req.params.id = req.user._id;
    next();
});

/*
 * @Desc update logged user password
 * @Route PUT /api/v1/users/changeMyPassword
 * @Access private/protected
 */

const updateLoggedUserPassword = asyncHandler(async (req, res, next) => {
    // Update user password based  on user payload
    const user = await User.findByIdAndUpdate(
        req.user._id,
        {
            password: await bcrypt.hash(req.body.password, 12),
            passwordChangedAt: Date.now(),
        },
        { new: true }
    );

    // Generate token
    const token = createToken(user._id);

    res.status(200).json({
        success: true,
        data: user,
        token,
    });
});

/*
 * @Desc update logged user data
 * @Route PUT /api/v1/users/updateMe
 * @Access private/protected
 */

const updateLoggedUserData = asyncHandler(async (req, res, next) => {
    const updatedUser = await User.findByIdAndUpdate(
        req.user._id,
        {
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
        },
        { new: true }
    );
    res.status(200).json({ data: updatedUser });
});

/*
 * @Desc deactivate logged user
 * @Route DELETE /api/v1/users/deleteMe
 * @Access private/protected
 */
const deleteLoggedUserData = asyncHandler(async (req, res, next) => {
    await User.findByIdAndUpdate(req.user._id, { active: false });
    res.status(204).json({ success: true });
});

// Export module
module.exports = {
    createUser,
    getUsers,
    getUser,
    updateUser,
    deleteUser,
    uploadProfileImage,
    customizeProfileImage,
    updateUserPassword,
    getLoggedUserData,
    updateLoggedUserPassword,
    updateLoggedUserData,
    deleteLoggedUserData,
};
