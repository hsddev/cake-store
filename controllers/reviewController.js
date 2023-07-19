// Dependencies
const asyncHandler = require("express-async-handler");
const { v4: uuidv4 } = require("uuid");

const factory = require("./handlersFactory");
const Review = require("../models/Review");

/*
 * @Desc get specific review
 * @Route GET /api/v1/reviews/:id
 * @Access public
 */
const getReview = factory.getOne(Review);
/*
 * @Desc create review
 * @Route POST /api/v1/reviews
 * @Access private/protect/user
 */
const createReview = factory.createOne(Review);

/*
 * @Desc get all reviews
 * @Route GET /api/v1/reviews
 * @Access public
 */
const getReviews = factory.getAll(Review);

/*
 * @Desc update specific review
 * @Route PUT /api/v1/reviews/:id
 * @Access private/protect/user
 */
const updateReview = factory.updateOne(Review);

/*
 * @Desc delete specific review
 * @Route DELETE /api/v1/reviews/:id
 * @Access private/protect/user/admin
 */
const deleteReview = factory.deleteOne(Review);

const createFilterObj = (req, res, next) => {
    let filterObject = {};

    if (req.params.productId) {
        filterObject = { product: req.params.productId };
    }
    req.filterObj = filterObject;
    next();
};

// Nested route create
const setProductIdAndUserIdToBody = (req, res, next) => {
    // Nested route
    if (!req.body.product) req.body.product = req.params.productId;
    if (!req.body.user) req.body.user = req.user._id;
    next();
};

// Export module
module.exports = {
    createReview,
    getReviews,
    getReview,
    updateReview,
    deleteReview,
    createFilterObj,
    setProductIdAndUserIdToBody,
};
