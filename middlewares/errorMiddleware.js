const ApiError = require("../utils/apiError");

const sendErrorForDev = (err, res) =>
    res.status(err.statusCode).json({
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack,
    });

const sendErrorForPro = (err, res) =>
    res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
    });

const handleJwtExpired = () =>
    new ApiError("Expired token, please login again..", 401);

const handleInvalidJwtSignature = () =>
    new ApiError(`Invalid token, please sign in again...`, 401);

const globalError = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || "error";

    if (process.env.NODE_ENV === "development") {
        sendErrorForDev(err, res);
    } else {
        if (err.name === "JSONWebTokenError") err = handleInvalidJwtSignature();
        if (err.name === "TokenExpiredError") err = handleJwtExpired();
        sendErrorForPro(err, res);
    }
};

module.exports = globalError;
