// Dependencies
const router = require("express").Router();
const {
    addAddress,
    removeAddress,
    getLoggedUserAddresses,
} = require("../controllers/addressController");

const { protect, allowedTo } = require("../controllers/authController");

router.use(protect, allowedTo("user"));

router.route("/").post(addAddress).get(getLoggedUserAddresses);

router.delete("/:addressId", removeAddress);

// Export module
module.exports = router;
