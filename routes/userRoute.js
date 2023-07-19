// Dependencies
const router = require("express").Router();
const {
    createUser,
    getUsers,
    getUser,
    updateUser,
    deleteUser,
    uploadProfileImage,
    customizeProfileImage,
    updateUserPassword,
    getLoggedUserData,
    updateLoggedUserPassword,
    updateLoggedUserData,
    deleteLoggedUserData,
} = require("../controllers/userController");
const {
    getUserValidator,
    createUserValidator,
    updateUserValidator,
    deleteUserValidator,
    changeUserPasswordValidator,
    updateLoggedUserValidator,
} = require("../utils/validators/userValidator");

const { protect, allowedTo } = require("../controllers/authController");

router.use(protect);
router.get("/getMe", getLoggedUserData, getUser);
router.put("/changeMyPassword", updateLoggedUserPassword);
router.put("/updateMe", updateLoggedUserValidator, updateLoggedUserData);
router.delete("/deleteMe", deleteLoggedUserData);
// Admin
router.use(allowedTo("admin"));

router
    .route("/changePassword/:id")
    .put(changeUserPasswordValidator, updateUserPassword);

router
    .route("/")
    .post(
        uploadProfileImage,
        customizeProfileImage,
        createUserValidator,
        createUser
    )
    .get(getUsers);

router
    .route("/:id")
    .get(getUserValidator, getUser)
    .put(
        uploadProfileImage,
        customizeProfileImage,
        updateUserValidator,
        updateUser
    )
    .delete(deleteUserValidator, deleteUser);

// Export module
module.exports = router;
