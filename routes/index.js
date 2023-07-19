// Dependencies
const router = require("express").Router();
const categoryRoute = require("./categoryRoute");
const subCategoryRoute = require("./subCategoryRoute");
const brandRoute = require("./brandRoute");
const productRoute = require("./productRoute");
const userRoute = require("./userRoute");
const authRoute = require("./authRoute");
const reviewRoute = require("./reviewRoute");
const wishlistRoute = require("./wishlistRoute");
const addressesRoute = require("./addressesRoute");
const couponRoute = require("./couponRoute");
const cartRoute = require("./cartRoute");
const orderRoute = require("./orderRoute");

// Routes
router.use("/v1/categories", categoryRoute);
router.use("/v1/subcategories", subCategoryRoute);
router.use("/v1/brands", brandRoute);
router.use("/v1/products", productRoute);
router.use("/v1/users", userRoute);
router.use("/v1/auth", authRoute);
router.use("/v1/reviews", reviewRoute);
router.use("/v1/wishlist", wishlistRoute);
router.use("/v1/addresses", addressesRoute);
router.use("/v1/coupons", couponRoute);
router.use("/v1/cart", cartRoute);
router.use("/v1/orders", orderRoute);

// Export module
module.exports = router;
