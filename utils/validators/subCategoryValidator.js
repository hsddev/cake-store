const { check, body } = require("express-validator");
const slugify = require("slugify");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");

// eslint-disable-next-line no-sparse-arrays
const createSubCategoryValidator = [
    check("name")
        .notEmpty()
        .withMessage("SubCategory required")
        .isLength({ min: 3 })
        .withMessage("SubCategory required")
        .isLength({ max: 32 })
        .withMessage("Too long category name")
        .custom((val, { req }) => {
            req.body.slug = slugify(val);
            return true;
        }),
    check("category").isMongoId().withMessage("Invalid category id format"),
    validatorMiddleware,
];
const getSubCategoryValidator = [
    check("id").isMongoId().withMessage("Invalid Subcategory id format"),
    validatorMiddleware,
];
const updateSubCategoryValidator = [
    check("id").isMongoId().withMessage("Invalid subcategory id format"),
    body("name").custom((val, { req }) => {
        req.body.slug = slugify(val);
        return true;
    }),
    validatorMiddleware,
];
const deleteSubCategoryValidator = [
    check("id").isMongoId().withMessage("Invalid subcategory id format"),
    validatorMiddleware,
];

// Export module
module.exports = {
    getSubCategoryValidator,
    createSubCategoryValidator,
    updateSubCategoryValidator,
    deleteSubCategoryValidator,
};
