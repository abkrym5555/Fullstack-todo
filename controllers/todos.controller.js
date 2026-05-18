const todoService = require("../services/todos.service");

exports.getAll = async (req, res) => {
  try {
    const todos = await todoService.getAllTodos(req.user.id, req.query);
    res.json(todos);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const todo = await todoService.getTodoById(req.user.id, req.params.id);
    res.json(todo);
  } catch (e) {
    res.status(e.status || 500).json({ error: e.message });
  }
};

exports.create = async (req, res) => {
  try {
    const todo = await todoService.createTodo(req.user.id, req.body);
    res.status(201).json(todo);
  } catch (e) {
    res.status(e.status || 500).json({ error: e.message });
  }
};

exports.update = async (req, res) => {
  try {
    const result = await todoService.updateTodo(
      req.user.id,
      req.params.id,
      req.body,
    );
    res.json(result);
  } catch (e) {
    res.status(e.status || 500).json({ error: e.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const result = await todoService.deleteTodo(req.user.id, req.params.id);
    res.json(result);
  } catch (e) {
    res.status(e.status || 500).json({ error: e.message });
  }
};

exports.toggle = async (req, res) => {
  try {
    const result = await todoService.toggleTodo(req.user.id, req.params.id);
    res.json(result);
  } catch (e) {
    res.status(e.status || 500).json({ error: e.message });
  }
};

exports.getStats = async (req, res) => {
  try {
    const stats = await todoService.getTodoStats(req.user.id);
    res.json(stats);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
