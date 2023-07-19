// Dependencies
const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");
const ApiFeatures = require("../utils/apiFeatures");

exports.deleteOne = (Model) =>
    asyncHandler(async (req, res, next) => {
        const { id } = req.params;
        const document = await Model.findByIdAndDelete(id);

        if (!document) {
            return next(new ApiError(`No document for this id ${id}`, 404));
        }

        // Trigger "remove" event when the document is deleted
        document.remove();

        res.status(204).send();
    });

exports.updateOne = (Model) =>
    asyncHandler(async (req, res, next) => {
        const document = await Model.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
            }
        );
        if (!document) {
            return next(
                new ApiError(`No document for this ${req.params.id}`, 404)
            );
        }

        // Trigger "save" event when update document
        document.save();

        res.status(200).json(document);
    });

exports.createOne = (Model) =>
    asyncHandler(async (req, res) => {
        const document = await Model.create(req.body);
        res.status(201).json(document);
    });

exports.getOne = (Model, populateOps) =>
    asyncHandler(async (req, res, next) => {
        const { id } = req.params;

        // Build query
        let query = await Model.findById(id);

        // Execute query
        if (populateOps) {
            query = query.populate(populateOps);
        }

        const document = await query;

        if (!document) {
            return next(new ApiError(`No document for this ${id}`, 404));
        }
        res.status(200).json(document);
    });

exports.getAll = (Model, modelName = "") =>
    asyncHandler(async (req, res) => {
        let filter = {};
        if (req.filterObj) {
            filter = req.filterObj;
        }
        const countDocuments = await Model.countDocuments();
        // Build query
        const apiFeatures = new ApiFeatures(Model.find(filter), req.query)
            .paginate(countDocuments)
            .filter()
            .sort()
            .limitFields()
            .search(modelName);

        // Execute query
        const { paginationResults, mongooseQuery } = apiFeatures;
        const document = await mongooseQuery;

        res.status(200).json({
            results: document.length,
            paginationResults,
            data: document,
        });
    });
