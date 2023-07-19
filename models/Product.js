// Dependencies
const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
            minLength: [3, "Too short product title"],
            maxLength: [100, "Too long product title"],
        },
        slug: {
            type: String,
            required: true,
            lowerCase: true,
        },
        description: {
            type: String,
            required: [true, "Product description is required"],
            minLength: [20, "Too short product description"],
        },
        sold: { type: Number, default: 0 },
        price: {
            type: Number,
            required: [true, "Product price is required"],
            trim: true,
            max: [200000, "Too long product price"],
        },
        images: [String],
        imageCover: {
            type: String,
            required: [true, "Cover image is required"],
        },
        category: {
            type: mongoose.Types.ObjectId,
            ref: "Category",
        },
        subcategories: [
            {
                type: mongoose.Schema.ObjectId,
                ref: "Subcategory",
            },
        ],
        brand: {
            type: mongoose.Schema.ObjectId,
            ref: "Brand",
        },
        quantity: {
            type: Number,
            required: [true, "Product quantity is required"],
        },
        priceAfterDiscount: {
            type: Number,
        },
        colors: [String],
        ratingsAverage: {
            type: Number,
            min: [1, "Rating must be above or equal 1.0"],
            max: [5, "Rating must be below or equal 5.0"],
        },
        ratingsQuality: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
        // to enable virtual populate
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

// Mongoose query middleware
productSchema.pre(/^find/, function (next) {
    this.populate({
        path: "category",
        select: "name",
    });
    next();
});

productSchema.virtual("reviews", {
    ref: "Review",
    foreignField: "product",
    localField: "_id",
});

const setImageUrl = (doc) => {
    if (doc.imageCover) {
        const imageUrl = `${process.env.BASE_URL}/products/${doc.imageCover}`;
        doc.imageCover = imageUrl;
    }
    if (doc.images) {
        const imageList = [];
        doc.images.forEach((image) => {
            const imageUrl = `${process.env.BASE_URL}/products/${image}`;
            imageList.push(imageUrl);
        });
        doc.images = imageList;
    }
};

productSchema.post("init", (doc) => {
    setImageUrl(doc);
});

productSchema.post("save", (doc) => {
    setImageUrl(doc);
});

const Product = mongoose.model("Product", productSchema);

// Export model
module.exports = Product;
