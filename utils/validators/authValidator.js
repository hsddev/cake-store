const { check } = require("express-validator");
const slugify = require("slugify");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");
const User = require("../../models/User");

exports.signupValidator = [
    check("name")
        .notEmpty()
        .withMessage("Name required")
        .isLength({ min: 3 })
        .withMessage("Too short name")
        .custom((val, { req }) => {
            req.body.slug = slugify(val);
            return true;
        }),
    check("email")
        .notEmpty()
        .isEmail()
        .withMessage("Invalid email format")
        .custom((val) =>
            User.findOne({ email: val }).then((user) => {
                if (user) {
                    return Promise.reject(new Error("User already exists"));
                }
            })
        ),
    check("password")
        .notEmpty()
        .withMessage("Password required")
        .isLength({ min: 8 })
        .withMessage("Password must be at least 8 characters long")
        .custom((pass, { req }) => {
            if (pass !== req.body.passwordConfirm) {
                throw new Error("Passwords do not match");
            }
            return true;
        }),

    check("passwordConfirm")
        .notEmpty()
        .withMessage("Password confirmation required"),
    validatorMiddleware,
];

exports.loginValidator = [
    check("email").notEmpty().isEmail().withMessage("Invalid email format"),
    check("password")
        .notEmpty()
        .withMessage("Password required")
        .isLength({ min: 8 })
        .withMessage("Password must be at least 8 characters long"),
    validatorMiddleware,
];
