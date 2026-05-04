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


