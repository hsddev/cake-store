// Dependencies
const asyncHandler = require("express-async-handler");

const ApiError = require("../utils/apiError");
const User = require("../models/User");

/*
 * @Desc Add product to the wishlist
 * @Route POST /api/v1/wishlist
 * @Access protected/User
 */
const addProductToWishlist = asyncHandler(async (req, res, next) => {
    const user = await User.findByIdAndUpdate(
        req.user._id,
        {
            $addToSet: { wishlist: req.body.productId },
        },
        { new: true }
    );
    if (!user) {
        return next(new ApiError("Couldn't find the user)", 404));
    }
    res.status(200).json({
        status: "success",
        message: "Product added successfully to wishlist",
        data: user.wishlist,
    });
});

/*
 * @Desc Remove product from wishlist
 * @Route DELETE /api/v1/wishlist
 * @Access protected/User
 */
const removeProductFromWishlist = asyncHandler(async (req, res, next) => {
    const user = await User.findByIdAndUpdate(
        req.user._id,
        {
            $pull: { wishlist: req.body.productId },
        },
        { new: true }
    );
    if (!user) {
        return next(new ApiError("Couldn't find the user)", 404));
    }
    res.status(200).json({
        status: "success",
        message: "Product removed successfully from wishlist",
        data: user.wishlist,
    });
});

/*
 * @Desc Get Logged User Wishlist
 * @Route GET /api/v1/wishlist
 * @Access protected/User
 */
const getLoggedUserWishlist = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user._id).populate("wishlist");

    if (!user) {
        return next(new ApiError("Couldn't find the user)", 404));
    }

    res.status(200).json({
        status: "success",
        data: user.wishlist,
    });
});

// Export Module
module.exports = {
    addProductToWishlist,
    removeProductFromWishlist,
    getLoggedUserWishlist,
};
