// Dependencies
const asyncHandler = require("express-async-handler");

const ApiError = require("../utils/apiError");
const factory = require("./handlersFactory");
const Product = require("../models/Product");
const Cart = require("../models/Cart");
const Order = require("../models/Order");

/*
 * @Desc create cash order
 * @Route POST /api/v1/orders/:cartId
 * @Access private/User
 */
const createCashOrder = asyncHandler(async (req, res, next) => {
    // app settings
    const taxPrice = 0;
    const shippingPrice = 0;

    // - Get cart depend on cartId
    const cart = await Cart.findById(req.params.cartId);

    if (!cart) {
        return next(
            new ApiError(
                `There is no such cart with cartId ${req.params.cartId}`
            ),
            404
        );
    }

    // - Get order price depend on cart price "Check if coupon apply"
    const cartPrice = cart.totalPriceAfterDiscount
        ? cart.totalPriceAfterDiscount
        : cart.totalPrice;

    const totalOrderPrice = cartPrice + taxPrice + shippingPrice;

    // - Create order with default paymentMethod card
    const order = await Order.create({
        user: req.user._id,
        cartItems: cart.cartItems,
        totalOrderPrice,
        shippingAddress: req.body.shippingAddress,
    });
    // - After creating order, decrement product quantity , increment product sold
    if (order) {
        const bulkOption = cart.cartItems.map((item) => ({
            updateOne: {
                filter: { _id: item.product },
                update: {
                    $inc: { quantity: -item.quantity, sold: +item.quantity },
                },
            },
        }));
        await Product.bulkWrite(bulkOption, {});
        // - Clear cart depend on cartId
        await Cart.findByIdAndDelete(req.params.cartId);
    }

    res.status(201).json({ status: "success", data: order });
});

const filterOrderForLoggedUser = asyncHandler(async (req, res, next) => {
    if (req.user.role === "user") req.filterObj = { user: req.user._id };
    next();
});
/*
 * @Desc get all orders
 * @Route GET /api/v1/orders
 * @Access private/User-Admin
 */
const findAllOrders = factory.getAll(Order);

/*
 * @Desc get all orders
 * @Route GET /api/v1/orders/:id
 * @Access private/User-Admin
 */
const findSpecificOrder = factory.getOne(Order);

/*
 * @Desc update order paid status to paid
 * @Route PUT /api/v1/orders/:id/pay
 * @Access private/Admin
 */
const updateOrderToPaid = asyncHandler(async (req, res, next) => {
    const order = await Order.findById(req.params.id);

    if (!order) {
        return next(
            new ApiError(`There is no order with this id ${req.params.id}`, 404)
        );
    }
    // update order paid status
    order.isPaid = true;
    order.paidAt = Date.now();

    const updateOrder = await order.save();

    res.status(200).json({ status: "success", data: updateOrder });
});

/*
 * @Desc update order paid status to delivered
 * @Route PUT /api/v1/orders/:id/deliver
 * @Access private/Admin
 */
const updateOrderToDelivered = asyncHandler(async (req, res, next) => {
    const order = await Order.findById(req.params.id);

    if (!order) {
        return next(
            new ApiError(`There is no order with this id ${req.params.id}`, 404)
        );
    }
    // update order paid status
    order.isDelivered = true;
    order.deliveredAt = Date.now();

    const updateOrder = await order.save();

    res.status(200).json({ status: "success", data: updateOrder });
});

// Export module
module.exports = {
    findAllOrders,
    createCashOrder,
    findSpecificOrder,
    filterOrderForLoggedUser,
    updateOrderToPaid,
    updateOrderToDelivered,
};
