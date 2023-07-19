// Dependencies
const factory = require("./handlersFactory");
const Coupon = require("../models/Coupon");

/*
 * @Desc get specific coupon
 * @Route GET /api/v1/coupons
 * @Access private/Admin
 */
const getCoupon = factory.getOne(Coupon);
/*
 * @Desc create coupon
 * @Route POST /api/v1/coupons
 * @Access private/Admin
 */
const createCoupon = factory.createOne(Coupon);

/*
 * @Desc get all coupons
 * @Route GET /api/v1/coupons
 * @Access private/Admin
 */
const getCoupons = factory.getAll(Coupon);

/*
 * @Desc update specific coupon
 * @Route PUT /api/v1/coupons/:id
 * @Access private/Admin
 */
const updateCoupon = factory.updateOne(Coupon);

/*
 * @Desc delete specific coupon
 * @Route DELETE /api/v1/coupons/:id
 * @Access private/Admin
 */
const deleteCoupon = factory.deleteOne(Coupon);

// Export module
module.exports = {
    createCoupon,
    getCoupons,
    getCoupon,
    updateCoupon,
    deleteCoupon,
};
