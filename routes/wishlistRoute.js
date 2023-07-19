// Dependencies
const router = require("express").Router();
const {
    addProductToWishlist,
    removeProductFromWishlist,
    getLoggedUserWishlist,
} = require("../controllers/wishlistController");

const { protect, allowedTo } = require("../controllers/authController");

router.use(protect, allowedTo("user"));

router.route("/").post(addProductToWishlist).get(getLoggedUserWishlist);

router.delete("/:productId", removeProductFromWishlist);

// Export module
module.exports = router;
