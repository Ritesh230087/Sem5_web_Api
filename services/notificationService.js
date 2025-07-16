const Notification = require('../models/NotificationModel');

const createNotification = async (userId, message, link) => {
  try {
    const notification = new Notification({ userId, message, link });
    await notification.save();
    // Here you could also use WebSockets (like Socket.io) to push the notification in real-time!
  } catch (error) {
    console.error('Failed to create notification:', error);
  }
};

module.exports = { createNotification };