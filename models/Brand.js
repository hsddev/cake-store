// Dependencies
const mongoose = require("mongoose");

const brandSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Brand required"],
            unique: [true, "Brand must be unique"],
            minLength: [3, "Too short brand name"],
            maxLength: [32, "Too long brand name"],
        },
        slug: {
            type: String,
            lowercase: true,
        },
        image: {
            type: String,
        },
    },
    { timestamps: true }
);

const setImageUrl = (doc) => {
    if (doc.image) {
        const imageUrl = `${process.env.BASE_URL}/brands/${doc.image}`;
        doc.image = imageUrl;
    }
};

brandSchema.post("init", (doc) => {
    setImageUrl(doc);
});

brandSchema.post("save", (doc) => {
    setImageUrl(doc);
});

const Brand = mongoose.model("Brand", brandSchema);

// Export module
module.exports = Brand;
