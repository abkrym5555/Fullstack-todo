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
