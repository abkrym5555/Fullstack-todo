const db = require("../models/db");
const { v4: uuid } = require("uuid");

exports.getAllTodos = async (userId, queryParams) => {
  const {
    search,
    status,
    priority,
    tag,
    sortBy = "createdAt",
    order = "desc",
  } = queryParams;
  let query = { userId };

  if (status) query.status = status;
  if (priority) query.priority = priority;
  if (tag) query.tags = { $elemMatch: tag };

  let todos = await db.todos.find(query);

  if (search) {
    const s = search.toLowerCase();
    todos = todos.filter(
      (t) =>
        t.title.toLowerCase().includes(s) ||
        (t.description || "").toLowerCase().includes(s),
    );
  }

  todos.sort((a, b) => {
    const dir = order === "asc" ? 1 : -1;
    return a[sortBy] > b[sortBy] ? dir : -dir;
  });

  return todos;
};

exports.getTodoById = async (userId, todoId) => {
  const todo = await db.todos.findOne({ _id: todoId, userId });
  if (!todo) {
    const error = new Error("Not found");
    error.status = 404;
    throw error;
  }
  return todo;
};

exports.createTodo = async (userId, todoData) => {
  const {
    title,
    description,
    priority = "medium",
    dueDate,
    tags = [],
    collectionId,
  } = todoData;
  if (!title) {
    const error = new Error("Title required");
    error.status = 400;
    throw error;
  }

  const todo = await db.todos.insert({
    _id: uuid(),
    userId,
    title,
    description,
    priority,
    dueDate: dueDate || null,
    tags,
    collectionId: collectionId || null,
    status: "pending",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
  return todo;
};

exports.updateTodo = async (userId, todoId, updateData) => {
  const todo = await db.todos.findOne({ _id: todoId, userId });
  if (!todo) {
    const error = new Error("Not found");
    error.status = 404;
    throw error;
  }

  const allowed = [
    "title",
    "description",
    "priority",
    "status",
    "dueDate",
    "tags",
    "collectionId",
  ];
  const updates = { updatedAt: new Date().toISOString() };
  allowed.forEach((f) => {
    if (updateData[f] !== undefined) updates[f] = updateData[f];
  });

  await db.todos.update({ _id: todoId }, { $set: updates });
  return { ...todo, ...updates };
};

exports.deleteTodo = async (userId, todoId) => {
  const removed = await db.todos.remove({ _id: todoId, userId });
  if (!removed) {
    const error = new Error("Not found");
    error.status = 404;
    throw error;
  }
  return { message: "Deleted" };
};

exports.toggleTodo = async (userId, todoId) => {
  const todo = await db.todos.findOne({ _id: todoId, userId });
  if (!todo) {
    const error = new Error("Not found");
    error.status = 404;
    throw error;
  }
  const newStatus = todo.status === "completed" ? "pending" : "completed";
  await db.todos.update(
    { _id: todoId },
    { $set: { status: newStatus, updatedAt: new Date().toISOString() } },
  );
  return { status: newStatus };
};

exports.getTodoStats = async (userId) => {
  const todos = await db.todos.find({ userId });
  return {
    total: todos.length,
    completed: todos.filter((t) => t.status === "completed").length,
    pending: todos.filter((t) => t.status === "pending").length,
    overdue: todos.filter(
      (t) =>
        t.dueDate &&
        new Date(t.dueDate) < new Date() &&
        t.status !== "completed",
    ).length,
    byPriority: {
      high: todos.filter((t) => t.priority === "high").length,
      medium: todos.filter((t) => t.priority === "medium").length,
      low: todos.filter((t) => t.priority === "low").length,
    },
  };
};
