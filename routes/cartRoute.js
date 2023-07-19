// Dependencies
const router = require("express").Router();
const {
    addProductToCart,
    getUserLoggedCart,
    removeItemFromCart,
    clearCart,
    updateCartItemQuantity,
    applyCoupon,
} = require("../controllers/cartController");

const { protect, allowedTo } = require("../controllers/authController");

router.use(protect, allowedTo("user"));

router
    .route("/")
    .post(addProductToCart)
    .get(getUserLoggedCart)
    .delete(clearCart);

router.put("/applyCoupon", applyCoupon);

router.route("/:itemId").put(updateCartItemQuantity).delete(removeItemFromCart);

// Export module
module.exports = router;
