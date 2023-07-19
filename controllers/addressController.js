// Dependencies
const asyncHandler = require("express-async-handler");

const ApiError = require("../utils/apiError");
const User = require("../models/User");

/*
 * @Desc Add address to user addresses list
 * @Route POST /api/v1/addresses
 * @Access protected/User
 */
const addAddress = asyncHandler(async (req, res, next) => {
    const user = await User.findByIdAndUpdate(
        req.user._id,
        {
            $addToSet: { addresses: req.body },
        },
        { new: true }
    );
    if (!user) {
        return next(new ApiError("Couldn't find the user)", 404));
    }
    res.status(200).json({
        status: "success",
        message: "Address added successfully to address list",
        data: user.addresses,
    });
});

/*
 * @Desc Remove address from user's addresses list
 * @Route DELETE /api/v1/addresses
 * @Access protected/User
 */
const removeAddress = asyncHandler(async (req, res, next) => {
    const user = await User.findByIdAndUpdate(
        req.user._id,
        {
            $pull: { addresses: { _id: req.params.addressId } },
        },
        { new: true }
    );
    if (!user) {
        return next(new ApiError("Couldn't find the user)", 404));
    }
    res.status(200).json({
        status: "success",
        message: "Address removed successfully from addresses list",
        data: user.addresses,
    });
});

/*
 * @Desc Get Logged User addresses list
 * @Route GET /api/v1/addresses
 * @Access protected/User
 */
const getLoggedUserAddresses = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user._id).populate("addresses");

    if (!user) {
        return next(new ApiError("Couldn't find the user)", 404));
    }

    res.status(200).json({
        status: "success",
        data: user.addresses,
    });
});

// Export Module
module.exports = {
    addAddress,
    removeAddress,
    getLoggedUserAddresses,
};
