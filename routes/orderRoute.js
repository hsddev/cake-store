// Dependencies
const router = require("express").Router();
const {
    findAllOrders,
    createCashOrder,
    findSpecificOrder,
    filterOrderForLoggedUser,
    updateOrderToPaid,
    updateOrderToDelivered,
} = require("../controllers/orderController");

const { protect, allowedTo } = require("../controllers/authController");

router.use(protect);

router.route("/:cartId").post(allowedTo("user"), createCashOrder);
router
    .route("/")
    .get(allowedTo("user", "admin"), filterOrderForLoggedUser, findAllOrders);

router.get("/:id", findSpecificOrder);

router.put("/:id/pay", allowedTo("admin"), updateOrderToPaid);
router.put("/:id/deliver", allowedTo("admin"), updateOrderToDelivered);

// Export module
module.exports = router;
