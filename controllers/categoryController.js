// Dependencies
const asyncHandler = require("express-async-handler");
const sharp = require("sharp");
const { v4: uuidv4 } = require("uuid");

const { uploadSingleImage } = require("../middlewares/uploadImageMiddleware");
const factory = require("./handlersFactory");
const Category = require("../models/Category");

// diskStorage engine
// const multerStorage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, "uploads/categories");
//     },
//     filename: (req, file, cb) => {
//         // category-${id}-Date.now().jpeg
//         console.log(file);
//         const extension = file.mimetype.split("/")[1];
//         const fileName = `category-${uuidv4()}-${Date.now()}.${extension}`;
//         cb(null, fileName);
//     },
// });

// Upload single image
const uploadCategoryImage = uploadSingleImage("image");

// Image processing
const customizeImage = asyncHandler(async (req, res, next) => {
    const fileName = `category-${uuidv4()}-${Date.now()}.jpeg`;

    if (req.file) {
        await sharp(req.file.buffer)
            .resize(600, 600)
            .toFormat("jpeg")
            .jpeg({ quality: 90 })
            .toFile(`uploads/categories/${fileName}`);

        // Save image to database
        req.body.image = fileName;
    }

    next();
});

/*
 * @Desc get specific category
 * @Route GET /api/v1/categories/:id
 * @Access public
 */
const getCategory = factory.getOne(Category);
/*
 * @Desc create category
 * @Route POST /api/v1/categories
 * @Access private
 */
const createCategory = factory.createOne(Category);

/*
 * @Desc get all categories
 * @Route GET /api/v1/categories
 * @Access public
 */
const getCategories = factory.getAll(Category);

/*
 * @Desc update specific category
 * @Route PUT /api/v1/categories/:id
 * @Access private
 */
const updateCategory = factory.updateOne(Category);

/*
 * @Desc delete specific category
 * @Route DELETE /api/v1/categories/:id
 * @Access private
 */
const deleteCategory = factory.deleteOne(Category);

// Export module
module.exports = {
    createCategory,
    getCategories,
    getCategory,
    updateCategory,
    deleteCategory,
    uploadCategoryImage,
    customizeImage,
};
