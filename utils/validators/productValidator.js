// Dependencies
const { check, body } = require("express-validator");
const slugify = require("slugify");
const Category = require("../../models/Category");
const SubCategory = require("../../models/SubCategory");
const validatorMiddlewares = require("../../middlewares/validatorMiddleware");

const getProductValidator = [
    check("id").isMongoId().withMessage("Invalid product id format"),
    validatorMiddlewares,
];

const updateProductValidator = [
    check("id").isMongoId().withMessage("Invalid product id format"),
    body("title")
        .optional()
        .custom((val, { req }) => {
            req.body.slug = slugify(val);
            return true;
        }),
    validatorMiddlewares,
];

const deleteProductValidator = [
    check("id").isMongoId().withMessage("Invalid product id format"),
    validatorMiddlewares,
];
const createProductValidator = [
    check("title")
        .isLength({ min: 3 })
        .withMessage("Must be atleast 3 characters")
        .custom((val, { req }) => {
            req.body.slug = slugify(val);
            return true;
        }),
    check("description")
        .notEmpty()
        .withMessage("Description is required")
        .isLength({ max: 2000 })
        .withMessage("Too long product description"),
    check("quantity")
        .notEmpty()
        .withMessage("Product quantity is required")
        .isNumeric()
        .withMessage("Product quantity must be a number"),
    check("price")
        .notEmpty()
        .withMessage("Product price is required")
        .isNumeric()
        .withMessage("Product price must be a number")
        .isLength({ max: 30 })
        .withMessage("Too long product price"),
    check("sold")
        .optional()
        .isNumeric()
        .withMessage("Sold on must be a number"),
    check("priceAfterDiscount")
        .optional()
        .isNumeric()
        .withMessage("PriceAfterDiscount must be a number")
        .isFloat()
        .custom((value, { req }) => {
            if (value >= req.body.price) {
                throw new Error(
                    "Price after discount must be greater than price"
                );
            }
            return true;
        }),

    check("colors")
        .optional()
        .isArray()
        .withMessage("Colors must be an array of string"),

    check("images")
        .optional()
        .isArray()
        .withMessage("Images must be an array of string"),

    check("imageCover").notEmpty().withMessage("Image cover is required"),
    check("category")
        .notEmpty()
        .withMessage("Product must belong to a category")
        .isMongoId()
        .withMessage("Invalid category id format")
        .custom((categoryId) =>
            Category.findById({ _id: categoryId }).then((category) => {
                if (!category) {
                    return Promise.reject(
                        new Error(`Invalid category id ${categoryId}`)
                    );
                }
            })
        ),

    check("subcategories")
        .optional()
        .notEmpty()
        .isMongoId()
        .withMessage("Invalid subcategory id format")
        .custom((val, { req }) => {
            SubCategory.find({ category: req.body.category }).then(
                (subcategories) => {
                    const subcategoriesInDB = [];
                    subcategories.forEach((subCategory) => {
                        subcategoriesInDB.push(subCategory._id.toString());
                    });
                    const checker = (target, arr) =>
                        target.every((v) => arr.includes(v));

                    // Check if subcategories ids include subcategories in DB (true/false)
                    if (!checker(val, subcategoriesInDB)) {
                        return Promise.reject(
                            new Error(`Subcategory not belong to category`)
                        );
                    }
                }
            );
        }),

    check("brand")
        .optional()
        .notEmpty()
        .isMongoId()
        .withMessage("Invalid brand id format"),

    check("ratingQuantity")
        .optional()
        .isNumeric()
        .withMessage("RatingQuantity must be a number"),

    check("ratingAverage")
        .optional()
        .isNumeric()
        .withMessage("RatingAverage must be a number")
        .isLength({ min: 1 })
        .withMessage("RatingAverage must be below or equal 1")
        .isLength({ max: 5 })
        .withMessage("RatingAverage must be above or equal 5"),

    validatorMiddlewares,
];

// Export module
module.exports = {
    getProductValidator,
    createProductValidator,
    updateProductValidator,
    deleteProductValidator,
};
