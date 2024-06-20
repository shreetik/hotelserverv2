const router = require("express").Router();
const authController = require("../Controllers/authController");

router.post("/signup", authController.signupController);
router.post("/login", authController.loginController);

module.exports = router;
