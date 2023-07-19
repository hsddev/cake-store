// Dependencies
const router = require("express").Router();
const {
    createCoupon,
    getCoupons,
    getCoupon,
    updateCoupon,
    deleteCoupon,
} = require("../controllers/couponController");

const { protect, allowedTo } = require("../controllers/authController");

router.use(protect, allowedTo("admin"));

router.route("/").post(createCoupon).get(getCoupons);

router.route("/:id").get(getCoupon).put(updateCoupon).delete(deleteCoupon);

// Export module
module.exports = router;
