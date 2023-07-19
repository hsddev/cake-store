// Dependencies
const asyncHandler = require("express-async-handler");
const sharp = require("sharp");
const { v4: uuidv4 } = require("uuid");

const factory = require("./handlersFactory");
const { uploadSingleImage } = require("../middlewares/uploadImageMiddleware");
const Brand = require("../models/Brand");

// Upload single image
const uploadBrandImage = uploadSingleImage("image");

// Image processing
const customizeImage = asyncHandler(async (req, res, next) => {
    const fileName = `brand-${uuidv4()}-${Date.now()}.jpeg`;

    await sharp(req.file.buffer)
        .resize(600, 600)
        .toFormat("jpeg")
        .jpeg({ quality: 90 })
        .toFile(`uploads/brands/${fileName}`);

    // Save image to database
    req.body.image = fileName;
    next();
});

/*
 * @Desc get specific brand name
 * @Route GET /api/v1/brands/:id
 * @Access public
 */
const getBrand = factory.getOne(Brand);
/*
 * @Desc create brand
 * @Route POST /api/v1/brands
 * @Access private
 */
const createBrand = factory.createOne(Brand);

/*
 * @Desc get all brands
 * @Route GET /api/v1/brands
 * @Access public
 */
const getBrands = factory.getAll(Brand);

/*
 * @Desc update specific brand
 * @Route PUT /api/v1/brands/:id
 * @Access private
 */
const updateBrand = factory.updateOne(Brand);

/*
 * @Desc delete specific brand
 * @Route DELETE /api/v1/brands/:id
 * @Access private
 */
const deleteBrand = factory.deleteOne(Brand);

// Export module
module.exports = {
    createBrand,
    getBrands,
    getBrand,
    updateBrand,
    deleteBrand,
    uploadBrandImage,
    customizeImage,
};
