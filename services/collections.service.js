const db = require("../models/db");
const { v4: uuid } = require("uuid");

exports.getAllCollections = async (userId) => {
  const cols = await db.collections.find({ userId });
  // Attach todo counts
  const enriched = await Promise.all(
    cols.map(async (col) => {
      const count = (await db.todos.find({ collectionId: col._id })).length;
      return { ...col, todoCount: count };
    }),
  );
  return enriched;
};

exports.createCollection = async (userId, collectionData) => {
  const { name, description, color = "#6366f1", icon = "📋" } = collectionData;
  if (!name) {
    const error = new Error("Name required");
    error.status = 400;
    throw error;
  }
  const col = await db.collections.insert({
    _id: uuid(),
    userId,
    name,
    description,
    color,
    icon,
    createdAt: new Date().toISOString(),
  });
  return col;
};

exports.updateCollection = async (userId, collectionId, updateData) => {
  const col = await db.collections.findOne({ _id: collectionId, userId });
  if (!col) {
    const error = new Error("Not found");
    error.status = 404;
    throw error;
  }
  const { name, description, color, icon } = updateData;
  const updates = {};
  if (name) updates.name = name;
  if (description !== undefined) updates.description = description;
  if (color) updates.color = color;
  if (icon) updates.icon = icon;
  await db.collections.update({ _id: collectionId }, { $set: updates });
  return { ...col, ...updates };
};

exports.removeCollection = async (userId, collectionId) => {
  const removed = await db.collections.remove({ _id: collectionId, userId });
  if (!removed) {
    const error = new Error("Not found");
    error.status = 404;
    throw error;
  }
  // Unlink todos
  await db.todos.update(
    { collectionId },
    { $set: { collectionId: null } },
    { multi: true },
  );
  return { message: "Deleted" };
};

exports.getCollectionTodos = async (userId, collectionId) => {
  const col = await db.collections.findOne({ _id: collectionId, userId });
  if (!col) {
    const error = new Error("Not found");
    error.status = 404;
    throw error;
  }
  const todos = await db.todos.find({ collectionId, userId });
  return { collection: col, todos };
};
