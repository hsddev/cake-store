// Dependencies
const SubCategory = require("../models/SubCategory");
const factory = require("./handlersFactory");

const setCategoryIdToBody = (req, res, next) => {
    // Nested route
    if (!req.body.category) req.body.category = req.params.categoryId;
    next();
};

const createFilterObj = (req, res, next) => {
    let filterObject = {};

    if (req.params.categoryId) {
        filterObject = { category: req.params.categoryId };
    }
    req.filterObj = filterObject;
    next();
};

/*
 * @Desc create subcategory
 * @Route POST /api/v1/subcategories
 * @Access private
 */
const createSubCategory = factory.createOne(SubCategory);
/*
 * @Desc get specific sub category
 * @Route GET /api/v1/subcategories/:id
 * @Access public
 */
const getSubCategory = factory.getOne(SubCategory);

/*
 * @Desc get all sub categories
 * @Route GET /api/v1/subcategories
 * @Access public
 */
const getSubCategories = factory.getAll(SubCategory);

/*
 * @Desc update specific sub category
 * @Route PUT /api/v1/subcategories/:id
 * @Access private
 */
const updateSubCategory = factory.updateOne(SubCategory);

/*
 * @Desc delete specific sub category
 * @Route DELETE /api/v1/subcategories/:id
 * @Access private
 */
const deleteSubCategory = factory.deleteOne(SubCategory);

// module exports
module.exports = {
    createFilterObj,
    setCategoryIdToBody,
    getSubCategories,
    createSubCategory,
    getSubCategory,
    updateSubCategory,
    deleteSubCategory,
};
