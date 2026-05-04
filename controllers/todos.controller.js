const db = require('../models/db');
const { v4: uuid } = require('uuid');

exports.getAll = async (req, res) => {
  try {
    const { search, status, priority, tag, sortBy = 'createdAt', order = 'desc' } = req.query;
    let query = { userId: req.user.id };

    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (tag) query.tags = { $elemMatch: tag };

    let todos = await db.todos.find(query);

    if (search) {
      const s = search.toLowerCase();
      todos = todos.filter(t =>
        t.title.toLowerCase().includes(s) ||
        (t.description || '').toLowerCase().includes(s)
      );
    }

    todos.sort((a, b) => {
      const dir = order === 'asc' ? 1 : -1;
      return a[sortBy] > b[sortBy] ? dir : -dir;
    });

    res.json(todos);
  } catch (e) { res.status(500).json({ error: e.message }); }
};


exports.getById = async (req, res) => {
  const todo = await db.todos.findOne({ _id: req.params.id, userId: req.user.id });
  if (!todo) return res.status(404).json({ error: 'Not found' });
  res.json(todo);
};

