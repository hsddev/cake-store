const { check, body } = require("express-validator");
const bcrypt = require("bcryptjs");
const slugify = require("slugify");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");
const User = require("../../models/User");

exports.getUserValidator = [
    check("id").isMongoId().withMessage("Invalid brand id format"),
    validatorMiddleware,
];

exports.createUserValidator = [
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

    check("profileImage").optional(),
    check("passwordConfirm")
        .notEmpty()
        .withMessage("Password confirmation required"),
    check("phone")
        .optional()
        .isMobilePhone(["en-GB"])
        .withMessage("Invalid phone only accepted UK phone numbers"),
    check("role").optional(),
    validatorMiddleware,
];

exports.updateUserValidator = [
    check("id").isMongoId().withMessage("Invalid user id format"),
    body("name")
        .optional()
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
    check("phone")
        .optional()
        .isMobilePhone(["en-GB"])
        .withMessage("Invalid phone only accepted UK phone numbers"),
    check("role").optional(),
    validatorMiddleware,
];

exports.changeUserPasswordValidator = [
    check("id").isMongoId().withMessage("Invalid user id format"),
    check("currentPassword")
        .notEmpty()
        .withMessage("You must enter your current password"),
    check("password")
        .notEmpty()
        .withMessage("You must enter your new password")
        .custom(async (password, { req }) => {
            // 1- verify current password
            const user = await User.findById(req.params.id);
            if (!user) {
                throw new Error("There is no user with this id");
            }
            const isCorrectPassword = await bcrypt.compare(
                req.body.currentPassword,
                user.password
            );
            if (!isCorrectPassword) {
                throw new Error("Incorrect current password");
            }

            // 2- verify the  password confirm
            if (password !== req.body.passwordConfirm) {
                throw new Error("Password confirm incorrect");
            }
        }),
    check("passwordConfirm")
        .notEmpty()
        .withMessage("You must enter your password confirm"),
    validatorMiddleware,
];

exports.deleteUserValidator = [
    check("id").isMongoId().withMessage("Invalid user id format"),
    validatorMiddleware,
];

exports.updateLoggedUserValidator = [
    body("name")
        .optional()
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
    check("phone")
        .optional()
        .isMobilePhone(["en-GB"])
        .withMessage("Invalid phone only accepted UK phone numbers"),
    validatorMiddleware,
];
