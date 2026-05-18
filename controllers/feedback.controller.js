const feedbackService = require("../services/feedback.service");

exports.getAll = async (req, res) => {
  try {
    const feedbacks = await feedbackService.getAllFeedback();
    res.json(feedbacks);
  } catch (error) {
    console.error("Error fetching feedback:", error);
    res.status(500).json({ error: "Failed to fetch feedback" });
  }
};

exports.create = async (req, res) => {
  try {
    const newFeedback = await feedbackService.createFeedback(
      req.user.id,
      req.body,
    );
    res.status(201).json(newFeedback);
  } catch (error) {
    console.error("Error creating feedback:", error);
    res
      .status(error.status || 500)
      .json({ error: error.message || "Failed to create feedback" });
  }
};
