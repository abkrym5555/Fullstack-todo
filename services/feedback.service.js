const db = require("../models/db");

exports.getAllFeedback = async () => {
  const feedbacks = await db.feedbacks.find({}).sort({ createdAt: -1 });

  // Manually join with users
  const userIds = [...new Set(feedbacks.map((f) => f.userId))];
  const users = await db.users.find({ _id: { $in: userIds } });
  const userMap = users.reduce((acc, user) => {
    acc[user._id] = { name: user.name, profilePicture: user.profilePicture };
    return acc;
  }, {});

  const populatedFeedbacks = feedbacks.map((f) => ({
    ...f,
    user: userMap[f.userId] || { name: "Unknown User" },
  }));

  return populatedFeedbacks;
};

exports.createFeedback = async (userId, feedbackData) => {
  const { rating, comment } = feedbackData;

  if (!rating || rating < 1 || rating > 5) {
    const error = new Error("Rating must be between 1 and 5");
    error.status = 400;
    throw error;
  }

  const newFeedback = await db.feedbacks.insert({
    userId,
    rating: Number(rating),
    comment: comment || "",
    createdAt: new Date(),
  });

  return newFeedback;
};
