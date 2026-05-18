const router = require("express").Router();
const feedbackController = require("../controllers/feedback.controller");
const { auth } = require("../middleware/auth");

router.get("/", auth, feedbackController.getAll);
router.post("/", auth, feedbackController.create);

module.exports = router;