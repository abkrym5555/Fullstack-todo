const router = require("express").Router();
const todosController = require("../controllers/todos.controller");
const { auth } = require("../middleware/auth");

router.get("/", auth, todosController.getAll);
router.get("/meta/stats", auth, todosController.getStats);
router.get("/:id", auth, todosController.getById);
router.post("/", auth, todosController.create);
router.put("/:id", auth, todosController.update);
router.delete("/:id", auth, todosController.remove);
router.patch("/:id/toggle", auth, todosController.toggle);

module.exports = router;
