const userService = require("../services/users.service");

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ error: "All fields required" });

    const result = await userService.registerUser(name, email, password);
    res.status(201).json(result);
  } catch (e) {
    res.status(e.status || 500).json({ error: e.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await userService.loginUser(email, password);
    res.json(result);
  } catch (e) {
    res.status(e.status || 500).json({ error: e.message });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const profile = await userService.getUserProfile(req.user.id);
    res.json(profile);
  } catch (e) {
    res.status(e.status || 500).json({ error: e.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const result = await userService.updateUserProfile(req.user.id, req.body);
    res.json(result);
  } catch (e) {
    res.status(e.status || 500).json({ error: e.message });
  }
};
