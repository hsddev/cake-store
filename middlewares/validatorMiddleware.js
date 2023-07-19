const { validationResult } = require("express-validator");

const validatorMiddleware = (req, res, next) => {
    // Find the validation errors in this request and wraps them in an object handy functions
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

module.exports = validatorMiddleware;
