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

exports.create = async (req, res) => {
  try {
    const { title, description, priority = 'medium', dueDate, tags = [], collectionId } = req.body;
    if (!title) return res.status(400).json({ error: 'Title required' });

    const todo = await db.todos.insert({
      _id: uuid(),
      userId: req.user.id,
      title, description, priority,
      dueDate: dueDate || null,
      tags,
      collectionId: collectionId || null,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    res.status(201).json(todo);
  } catch (e) { res.status(500).json({ error: e.message }); }
};


exports.update = async (req, res) => {
  try {
    const todo = await db.todos.findOne({ _id: req.params.id, userId: req.user.id });
    if (!todo) return res.status(404).json({ error: 'Not found' });

    const allowed = ['title', 'description', 'priority', 'status', 'dueDate', 'tags', 'collectionId'];
    const updates = { updatedAt: new Date().toISOString() };
    allowed.forEach(f => { if (req.body[f] !== undefined) updates[f] = req.body[f]; });

    await db.todos.update({ _id: req.params.id }, { $set: updates });
    res.json({ ...todo, ...updates });
  } catch (e) { res.status(500).json({ error: e.message }); }
};


exports.remove = async (req, res) => {
  const removed = await db.todos.remove({ _id: req.params.id, userId: req.user.id });
  if (!removed) return res.status(404).json({ error: 'Not found' });
  res.json({ message: 'Deleted' });
};


exports.toggle = async (req, res) => {
  const todo = await db.todos.findOne({ _id: req.params.id, userId: req.user.id });
  if (!todo) return res.status(404).json({ error: 'Not found' });
  const newStatus = todo.status === 'completed' ? 'pending' : 'completed';
  await db.todos.update({ _id: req.params.id }, { $set: { status: newStatus, updatedAt: new Date().toISOString() } });
  res.json({ status: newStatus });
};


exports.getStats = async (req, res) => {
  const todos = await db.todos.find({ userId: req.user.id });
  const stats = {
    total: todos.length,
    completed: todos.filter(t => t.status === 'completed').length,
    pending: todos.filter(t => t.status === 'pending').length,
    overdue: todos.filter(t => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'completed').length,
    byPriority: {
      high: todos.filter(t => t.priority === 'high').length,
      medium: todos.filter(t => t.priority === 'medium').length,
      low: todos.filter(t => t.priority === 'low').length,
    }
  };
  res.json(stats);
};
