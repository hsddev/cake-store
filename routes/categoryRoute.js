// Dependencies
const router = require("express").Router();
const {
    getCategory,
    createCategory,
    getCategories,
    updateCategory,
    deleteCategory,
    uploadCategoryImage,
    customizeImage,
} = require("../controllers/categoryController");
const {
    getCategoryValidator,
    createCategoryValidator,
    updateCategoryValidator,
    deleteCategoryValidator,
} = require("../utils/validators/categoryValidator");

const { protect, allowedTo } = require("../controllers/authController");
const subCategoryRoute = require("./subCategoryRoute");

// Nested route
router.use("/:categoryId/subcategories", subCategoryRoute);

router
    .route("/")
    .post(
        protect,
        allowedTo("admin"),
        uploadCategoryImage,
        customizeImage,
        createCategoryValidator,
        createCategory
    )
    .get(getCategories);
router
    .route("/:id")
    .get(getCategoryValidator, getCategory)
    .put(
        protect,
        allowedTo("admin"),
        uploadCategoryImage,
        customizeImage,
        updateCategoryValidator,
        updateCategory
    )
    .delete(
        protect,
        allowedTo("admin"),
        deleteCategoryValidator,
        deleteCategory
    );

// Export module
module.exports = router;
