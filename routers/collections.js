const router = require("express").Router();
const collectionsController = require("../controllers/collections.controller");
const { auth } = require("../middleware/auth");

router.get("/", auth, collectionsController.getAll);
router.post("/", auth, collectionsController.create);
router.put("/:id", auth, collectionsController.update);
router.delete("/:id", auth, collectionsController.remove);
router.get("/:id/todos", auth, collectionsController.getTodos);

module.exports = router;
