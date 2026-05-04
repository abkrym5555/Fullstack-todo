const db = require('../models/db');
const { v4: uuid } = require('uuid');

exports.getAll = async (req, res) => {
  const cols = await db.collections.find({ userId: req.user.id });
  // Attach todo counts
  const enriched = await Promise.all(cols.map(async col => {
    const count = (await db.todos.find({ collectionId: col._id })).length;
    return { ...col, todoCount: count };
  }));
  res.json(enriched);
};

exports.create = async (req, res) => {
  const { name, description, color = '#6366f1', icon = '📋' } = req.body;
  if (!name) return res.status(400).json({ error: 'Name required' });
  const col = await db.collections.insert({
    _id: uuid(), userId: req.user.id,
    name, description, color, icon,
    createdAt: new Date().toISOString()
  });
  res.status(201).json(col);
};



exports.update = async (req, res) => {
  const col = await db.collections.findOne({ _id: req.params.id, userId: req.user.id });
  if (!col) return res.status(404).json({ error: 'Not found' });
  const { name, description, color, icon } = req.body;
  const updates = {};
  if (name) updates.name = name;
  if (description !== undefined) updates.description = description;
  if (color) updates.color = color;
  if (icon) updates.icon = icon;
  await db.collections.update({ _id: req.params.id }, { $set: updates });
  res.json({ ...col, ...updates });
};

