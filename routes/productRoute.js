// Dependencies
const router = require("express").Router();
const {
    getProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct,
    uploadProductImages,
    customizeProductImages,
} = require("../controllers/productController");
const {
    getProductValidator,
    updateProductValidator,
    deleteProductValidator,
    createProductValidator,
} = require("../utils/validators/productValidator");

const { protect, allowedTo } = require("../controllers/authController");
const reviewRoute = require("./reviewRoute");

// Nested route
router.use("/:productId/reviews", reviewRoute);

// Routes
router
    .route("/")
    .get(getProducts)
    .post(
        protect,
        allowedTo("admin"),
        uploadProductImages,
        customizeProductImages,
        createProductValidator,
        createProduct
    );

router
    .route("/:id")
    .get(getProductValidator, getProduct)
    .put(protect, allowedTo("admin"), updateProductValidator, updateProduct)
    .delete(protect, allowedTo("admin"), deleteProductValidator, deleteProduct);

// Export module
module.exports = router;
