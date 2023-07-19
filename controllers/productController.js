// Dependencies
const asyncHandler = require("express-async-handler");
const sharp = require("sharp");
const { v4: uuidv4 } = require("uuid");

const { uploadMixOfImages } = require("../middlewares/uploadImageMiddleware");
const factory = require("./handlersFactory");
const Product = require("../models/Product");

const uploadProductImages = uploadMixOfImages([
    { name: "imageCover", maxCount: 1 },
    { name: "images", maxCount: 8 },
]);

// Image processing
const customizeProductImages = asyncHandler(async (req, res, next) => {
    // image processing for image cover
    if (req.files.imageCover) {
        const imageCoverName = `product-${uuidv4()}-${Date.now()}-cover.jpeg`;

        await sharp(req.files.imageCover[0].buffer)
            .resize(2000, 1333)
            .toFormat("jpeg")
            .jpeg({ quality: 90 })
            .toFile(`uploads/products/${imageCoverName}`);

        // Save image to database
        req.body.imageCover = imageCoverName;
    }

    // image processing for images
    if (req.files.images) {
        req.body.images = [];

        await Promise.all(
            req.files.images.map(async (img, index) => {
                const imageName = `product-${uuidv4()}-${Date.now()}-${
                    index + 1
                }.jpeg`;

                await sharp(img.buffer)
                    .resize(2000, 1333)
                    .toFormat("jpeg")
                    .jpeg({ quality: 90 })
                    .toFile(`uploads/products/${imageName}`);

                // Save image to database
                req.body.images.push(imageName);
            })
        );
    }
    next();
});

/*
 * @Desc create a new product
 * @Route POST /api/v1/products
 * @Access Private
 */
const createProduct = factory.createOne(Product);

/*
 * @Desc get all products
 * @Route GET /api/v1/products
 * @Access Public
 */
const getProducts = factory.getAll(Product, "Products");

/*
 * @Desc get a specific product
 * @Route POST /api/v1/products/:id
 * @Access Public
 */
const getProduct = factory.getOne(Product, "reviews");

/*
 * @Desc update an existing product
 * @Route PUT /api/v1/products/:id
 * @Access Private
 */
const updateProduct = factory.updateOne(Product);

/*
 * @Desc delete an  existing product
 * @Route DELETE /api/v1/products/:id
 * @Access Private
 */
const deleteProduct = factory.deleteOne(Product);

// Export module
module.exports = {
    createProduct,
    getProducts,
    getProduct,
    updateProduct,
    deleteProduct,
    uploadProductImages,
    customizeProductImages,
};
