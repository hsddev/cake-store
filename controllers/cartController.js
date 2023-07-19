// Dependencies
const asyncHandler = require("express-async-handler");

const ApiError = require("../utils/apiError");
const Product = require("../models/Product");
const Coupon = require("../models/Coupon");
const Cart = require("../models/Cart");

const calcTotalCartPrice = (cart) => {
    let totalPrice = 0;

    cart.cartItems.forEach((item) => {
        totalPrice += item.quantity * item.price;
    });

    cart.totalPriceAfterDiscount = undefined;

    return totalPrice;
};

/*
 * @Desc add product to cart
 * @Route POST /api/v1/cart
 * @Access private/user
 */
const addProductToCart = asyncHandler(async (req, res, next) => {
    const { productId, color } = req.body;

    const product = await Product.findById(productId);

    //1 - Get the cart for logged user
    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
        // Create a new cart for logged user with new product
        cart = await Cart.create({
            user: req.user._id,
            cartItems: [{ product: productId, color, price: product.price }],
        });
    } else {
        // product exist in cart, update product quantity
        const productIndex = cart.cartItems.findIndex(
            (item) =>
                item.product.toString() === productId && item.color === color
        );

        if (productIndex > -1) {
            const cartItem = cart.cartItems[productIndex];
            cartItem.quantity += 1;

            cart.cartItems[productIndex] = cartItem;
        } else {
            // product not exist in cart,  push product to cartItems array
            cart.cartItems.push({
                product: productId,
                color,
                price: product.price,
            });
        }
    }

    // Calculate the total price of the products in the cart
    const totalPrice = calcTotalCartPrice(cart);

    cart.totalPrice = totalPrice;

    await cart.save();

    res.status(200).json({
        status: "success",
        message: "Product added to cart successfully",
        totalPrice: totalPrice,
        numOfCartItems: cart.cartItems
            .map((item) => item.quantity)
            .reduce((prev, curr) => prev + curr, 0),
        data: cart,
    });
});

/*
 * @Desc Get logged user cart
 * @Route GET /api/v1/cart
 * @Access private/user
 */
const getUserLoggedCart = asyncHandler(async (req, res, next) => {
    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
        return next(
            new ApiError(
                `There is no cart for this user id : ${req.user._id}`,
                404
            )
        );
    }

    res.status(200).json({
        status: "success",
        numOfCartItems: cart.cartItems
            .map((item) => item.quantity)
            .reduce((prev, curr) => prev + curr, 0),
        data: cart,
    });
});

/*
 * @Desc delete specific Item from cart
 * @Route DELETE /api/v1/cart/:itemId
 * @Access private/user
 */
const removeItemFromCart = asyncHandler(async (req, res, next) => {
    const cart = await Cart.findOneAndUpdate(
        { user: req.user._id },
        { $pull: { cartItems: { _id: req.params.itemId } } },
        { new: true }
    );
    const totalPrice = calcTotalCartPrice(cart);

    cart.totalPrice = totalPrice;

    await cart.save();

    res.status(200).json({
        status: "success",
        numOfCartItems: cart.cartItems
            .map((item) => item.quantity)
            .reduce((prev, curr) => prev + curr, 0),
        data: cart,
    });
});

/*
 * @Desc Clear logged user cart
 * @Route DELETE /api/v1/cart
 * @Access private/user
 */
const clearCart = asyncHandler(async (req, res, next) => {
    await Cart.findOneAndDelete({ user: req.user._id });

    res.status(204).send();
});

/*
 * @Desc Update specific cart item quantity
 * @Route PUT /api/v1/cart/:itemId
 * @Access private/user
 */
const updateCartItemQuantity = asyncHandler(async (req, res, next) => {
    const { quantity } = req.body;

    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
        return next(
            new ApiError(
                `There is no cart for this user id : ${req.user._id}`,
                404
            )
        );
    }

    const itemIndex = cart.cartItems.findIndex(
        (item) => item._id.toString() === req.params.itemId
    );

    if (itemIndex > -1) {
        const cartItem = cart.cartItems[itemIndex];
        cartItem.quantity = quantity;

        cart.cartItems[itemIndex] = cartItem;
    } else {
        return next(
            new ApiError(
                `There is no item with that id : ${req.params.itemId}`,
                404
            )
        );
    }

    // Calculate the total price of the products in the cart
    const totalPrice = calcTotalCartPrice(cart);

    cart.totalPrice = totalPrice;

    await cart.save();

    res.status(200).json({
        status: "success",
        numOfCartItems: cart.cartItems
            .map((item) => item.quantity)
            .reduce((prev, curr) => prev + curr, 0),
        data: cart,
    });
});

/*
 * @Desc Apply coupon on logged user cart
 * @Route PUT /api/v1/cart/applyCoupon
 * @Access private/user
 */
const applyCoupon = asyncHandler(async (req, res, next) => {
    // Get the coupon based on coupon name
    const coupon = await Coupon.findOne({
        name: req.body.couponName,
        expire: { $gt: Date.now() },
    });

    if (!coupon) {
        return next(new ApiError("Coupon invalid or expire", 404));
    }

    // Get the total price from the looged user cart
    const cart = await Cart.findOne({ user: req.user._id });

    const { totalPrice } = cart;

    // Calculate the price after discounting coupon
    const priceAfterDiscount = (
        totalPrice -
        (totalPrice * coupon.discount) / 100
    ).toFixed(2);

    cart.totalPriceAfterDiscount = priceAfterDiscount;

    await cart.save();

    res.status(200).json({
        status: "success",
        numOfCartItems: cart.cartItems
            .map((item) => item.quantity)
            .reduce((prev, curr) => prev + curr, 0),
        data: cart,
    });
});

// Export Module
module.exports = {
    addProductToCart,
    getUserLoggedCart,
    removeItemFromCart,
    clearCart,
    updateCartItemQuantity,
    applyCoupon,
};
