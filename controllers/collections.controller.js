const collectionsService = require("../services/collections.service");

exports.getAll = async (req, res) => {
  try {
    const enriched = await collectionsService.getAllCollections(req.user.id);
    res.json(enriched);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

exports.create = async (req, res) => {
  try {
    const col = await collectionsService.createCollection(
      req.user.id,
      req.body,
    );
    res.status(201).json(col);
  } catch (e) {
    res.status(e.status || 500).json({ error: e.message });
  }
};

exports.update = async (req, res) => {
  try {
    const result = await collectionsService.updateCollection(
      req.user.id,
      req.params.id,
      req.body,
    );
    res.json(result);
  } catch (e) {
    res.status(e.status || 500).json({ error: e.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const result = await collectionsService.removeCollection(
      req.user.id,
      req.params.id,
    );
    res.json(result);
  } catch (e) {
    res.status(e.status || 500).json({ error: e.message });
  }
};

exports.getTodos = async (req, res) => {
  try {
    const result = await collectionsService.getCollectionTodos(
      req.user.id,
      req.params.id,
    );
    res.json(result);
  } catch (e) {
    res.status(e.status || 500).json({ error: e.message });
  }
};
