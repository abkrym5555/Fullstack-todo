const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../models/db");
const { SECRET } = require("../middleware/auth");
const { v4: uuid } = require("uuid");

const SALT_ROUNDS = 12;

exports.registerUser = async (name, email, password) => {
  const hashed = await bcrypt.hash(password, SALT_ROUNDS);
  try {
    const user = await db.users.insert({
      _id: uuid(),
      name,
      email,
      password: hashed,
      role: "user",
      createdAt: new Date().toISOString(),
    });
    const token = jwt.sign(
      { id: user._id, email, name, role: user.role },
      SECRET,
      { expiresIn: "7d" },
    );
    return { token, user: { id: user._id, name, email } };
  } catch (e) {
    if (e.errorType === "uniqueViolated") {
      const error = new Error("Email already exists");
      error.status = 409;
      throw error;
    }
    throw e;
  }
};

exports.loginUser = async (email, password) => {
  const user = await db.users.findOne({ email });
  if (!user) {
    const error = new Error("Invalid credentials");
    error.status = 401;
    throw error;
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    const error = new Error("Invalid credentials");
    error.status = 401;
    throw error;
  }

  const token = jwt.sign(
    { id: user._id, email, name: user.name, role: user.role },
    SECRET,
    { expiresIn: "7d" },
  );
  return { token, user: { id: user._id, name: user.name, email } };
};

exports.getUserProfile = async (userId) => {
  const user = await db.users.findOne({ _id: userId });
  if (!user) {
    const error = new Error("Not found");
    error.status = 404;
    throw error;
  }
  const { password, ...safe } = user;
  return safe;
};

exports.updateUserProfile = async (userId, updateData) => {
  const { name, email, password, profilePicture } = updateData;
  const updates = { updatedAt: new Date().toISOString() };
  if (name) updates.name = name;
  if (email) {
    const existing = await db.users.findOne({ email });
    if (existing && existing._id !== userId) {
      const error = new Error("Email already in use");
      error.status = 409;
      throw error;
    }
    updates.email = email;
  }
  if (password) updates.password = await bcrypt.hash(password, SALT_ROUNDS);
  if (profilePicture !== undefined) updates.profilePicture = profilePicture;

  await db.users.update({ _id: userId }, { $set: updates });
  return { message: "Profile updated" };
};
