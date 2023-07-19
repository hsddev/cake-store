// Dependencies
const multer = require("multer");

const ApiError = require("../utils/apiError");

const multerOptions = () => {
    // memory storage engine
    const multerStorage = multer.memoryStorage();

    const multerFilter = (req, file, cb) => {
        if (file.mimetype.startsWith("image")) {
            cb(null, true);
        } else {
            cb(new ApiError("Only images allowed", 400), false);
        }
    };

    const upload = multer({ storage: multerStorage, fileFilter: multerFilter });

    return upload;
};

const uploadSingleImage = (fileName) => multerOptions().single(fileName);
const uploadMixOfImages = (arrayOfFields) =>
    multerOptions().fields(arrayOfFields);

module.exports = { uploadSingleImage, uploadMixOfImages };
