// Dependencies
const router = require("express").Router({ mergeParams: true });
const {
    setCategoryIdToBody,
    getSubCategories,
    createSubCategory,
    getSubCategory,
    updateSubCategory,
    deleteSubCategory,
    createFilterObj,
} = require("../controllers/subCategoryController");

const {
    getSubCategoryValidator,
    createSubCategoryValidator,
    updateSubCategoryValidator,
    deleteSubCategoryValidator,
} = require("../utils/validators/subCategoryValidator");

const { protect, allowedTo } = require("../controllers/authController");

// Routes
router
    .route("/")
    .post(
        protect,
        allowedTo("admin"),
        setCategoryIdToBody,
        createSubCategoryValidator,
        createSubCategory
    )
    .get(createFilterObj, getSubCategories);

router
    .route("/:id")
    .get(getSubCategoryValidator, getSubCategory)
    .put(
        protect,
        allowedTo("admin"),
        updateSubCategoryValidator,
        updateSubCategory
    )
    .delete(
        protect,
        allowedTo("admin"),
        deleteSubCategoryValidator,
        deleteSubCategory
    );

// Export module
module.exports = router;
