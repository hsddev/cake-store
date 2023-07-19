// Dependencies
const mongoose = require("mongoose");

const orderSchema = mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.ObjectId,
            ref: "User",
            required: [true, "The order should belong to a user"],
        },
        cartItems: [
            {
                product: {
                    type: mongoose.Schema.ObjectId,
                    ref: "Product",
                },
                quantity: Number,
                color: String,
                price: Number,
            },
        ],
        shippingAddress: {
            details: String,
            phone: String,
            city: String,
            postalCode: String,
        },
        taxPrice: {
            type: Number,
            default: 0,
        },
        shippingPrice: {
            type: Number,
            default: 0,
        },
        totalOrderPrice: {
            type: Number,
        },
        paymentMethodType: {
            type: String,
            enum: ["cash", "card"],
            default: "card",
        },
        isPaid: {
            type: Boolean,
            default: false,
        },
        paidAt: Date,
        isDelivered: {
            type: Boolean,
            default: false,
        },
        deliveredAt: Date,
    },
    { timestamps: true }
);

orderSchema.pre(/^find/, function (next) {
    this.populate({
        path: "user",
        select: "name profileImg email phone",
    }).populate({ path: "cartItems.product", select: "title imageCover" });
    next();
});

const Order = mongoose.model("Order", orderSchema);

// Export module
module.exports = Order;
