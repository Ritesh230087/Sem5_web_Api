const express = require('express');
const router = express.Router();
const Notification = require('../../models/NotificationModel');
router.get('/', /* authMiddleware, */ async (req, res) => {
  // const userId = req.user.id; // Get user from auth middleware
  const notifications = await Notification.find({ userId: req.query.userId }).sort({ createdAt: -1 });
  res.json(notifications);
});

// Mark as read
router.post('/:id/read', /* authMiddleware, */ async (req, res) => {
    await Notification.findByIdAndUpdate(req.params.id, { isRead: true });
    res.json({ success: true });
});

module.exports = router;