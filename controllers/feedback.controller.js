const db = require("../models/db");

exports.getAll = async (req, res) => {
  try {
    const feedbacks = await db.feedbacks.find({}).sort({ createdAt: -1 });

    // Manually join with users
    const userIds = [...new Set(feedbacks.map(f => f.userId))];
    const users = await db.users.find({ _id: { $in: userIds } });
    const userMap = users.reduce((acc, user) => {
      acc[user._id] = { name: user.name, profilePicture: user.profilePicture };
      return acc;
    }, {});

    const populatedFeedbacks = feedbacks.map(f => ({
      ...f,
      user: userMap[f.userId] || { name: 'Unknown User' }
    }));

    res.json(populatedFeedbacks);
  } catch (error) {
    console.error("Error fetching feedback:", error);
    res.status(500).json({ error: "Failed to fetch feedback" });
  }
};


exports.create = async (req, res) => {
  try {
    const { rating, comment } = req.body;

    if (!rating  rating < 1 
 rating > 5) {
      return res.status(400).json({ error: "Rating must be between 1 and 5" });
    }

    const newFeedback = await db.feedbacks.insert({
      userId: req.user.id,
      rating: Number(rating),
      comment: comment || "",
      createdAt: new Date()
    });

    res.status(201).json(newFeedback);
  } catch (error) {
    console.error("Error creating feedback:", error);
    res.status(500).json({ error: "Failed to create feedback" });
  }
};