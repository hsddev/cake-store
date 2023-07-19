// Dependencies
const router = require("express").Router();
const {
    getBrand,
    createBrand,
    getBrands,
    updateBrand,
    deleteBrand,
    uploadBrandImage,
    customizeImage,
} = require("../controllers/brandController");
const {
    getBrandValidator,
    createBrandValidator,
    updateBrandValidator,
    deleteBrandValidator,
} = require("../utils/validators/brandValidator");

const subCategoryRoute = require("./subCategoryRoute");

const { protect, allowedTo } = require("../controllers/authController");

router.use("/:categoryId/subcategories", subCategoryRoute);

router
    .route("/")
    .post(
        protect,
        allowedTo("admin"),
        uploadBrandImage,
        customizeImage,
        createBrandValidator,
        createBrand
    )
    .get(getBrands);
router
    .route("/:id")
    .get(getBrandValidator, getBrand)
    .put(
        protect,
        allowedTo("admin"),
        uploadBrandImage,
        customizeImage,
        updateBrandValidator,
        updateBrand
    )
    .delete(protect, allowedTo("admin"), deleteBrandValidator, deleteBrand);

// Export module
module.exports = router;
