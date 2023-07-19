// Dependencies
const mongoose = require("mongoose");

const subCategorySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            trim: true,
            unique: [true, "Subcategory required"],
            required: [true, "Subcategory must be unique"],
            minLength: [3, "Too short subcategory name"],
            maxLength: [32, "Too long subcategory name"],
        },
        slug: {
            type: String,
            lowercase: true,
        },
        category: {
            type: mongoose.Schema.ObjectId,
            ref: "Category",
            required: [true, "SubCategory must be belong to parent category"],
        },
    },
    { timestamps: true }
);

const SubCategory = mongoose.model("SubCategory", subCategorySchema);
// Export module
module.exports = SubCategory;
