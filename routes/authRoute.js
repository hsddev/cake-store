// Dependencies
const router = require("express").Router();
const {
    signup,
    login,
    forgetPassword,
    verifyPassResetCode,
    resetPassword,
} = require("../controllers/authController");
const {
    signupValidator,
    loginValidator,
} = require("../utils/validators/authValidator");

router.post("/signup", signupValidator, signup);
router.post("/login", loginValidator, login);
router.post("/forgetPassword", forgetPassword);
router.post("/verifyResetCode", verifyPassResetCode);
router.put("/resetPassword", resetPassword);

// Export module
module.exports = router;
