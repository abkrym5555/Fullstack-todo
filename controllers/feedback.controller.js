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