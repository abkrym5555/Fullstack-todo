const router = require("express").Router();
const usersController = require("../controllers/users.controller");
const { auth } = require("../middleware/auth");

router.post("/register", usersController.register);
router.post("/login", usersController.login);
router.get("/me", auth, usersController.getProfile);
router.put("/me", auth, usersController.updateProfile);

module.exports = router;
