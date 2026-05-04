const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../models/db');
const { SECRET } = require('../middleware/auth');
const { v4: uuid } = require('uuid');

const SALT_ROUNDS = 12;

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ error: 'All fields required' });

    const hashed = await bcrypt.hash(password, SALT_ROUNDS);
    const user = await db.users.insert({
      _id: uuid(), name, email,
      password: hashed,
      role: 'user',
      createdAt: new Date().toISOString()
    });

    const token = jwt.sign({ id: user._id, email, name, role: user.role }, SECRET, { expiresIn: '7d' });
    res.status(201).json({ token, user: { id: user._id, name, email } });
  } catch (e) {
    if (e.errorType === 'uniqueViolated')
      return res.status(409).json({ error: 'Email already exists' });
    res.status(500).json({ error: e.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await db.users.findOne({ email });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id, email, name: user.name, role: user.role }, SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user._id, name: user.name, email } });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

exports.getProfile = async (req, res) => {
  const user = await db.users.findOne({ _id: req.user.id });
  if (!user) return res.status(404).json({ error: 'Not found' });
  const { password, ...safe } = user;
  res.json(safe);
};

exports.updateProfile = async (req, res) => {
  try {
    const { name, email, password, profilePicture } = req.body;
    const updates = { updatedAt: new Date().toISOString() };
    if (name) updates.name = name;
    if (email) {
      const existing = await db.users.findOne({ email });
      if (existing && existing._id !== req.user.id) {
        return res.status(409).json({ error: 'Email already in use' });
      }
      updates.email = email;
    }
    if (password) updates.password = await bcrypt.hash(password, SALT_ROUNDS);
    if (profilePicture !== undefined) updates.profilePicture = profilePicture;
    
    await db.users.update({ _id: req.user.id }, { $set: updates });
    res.json({ message: 'Profile updated' });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};



