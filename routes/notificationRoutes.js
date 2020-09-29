const Notification = require("../models/notificationModel");
exports.markNotificationRead = (req, res) => {
  Notification.updateMany(
    { _id: { $in: req.body } },
    { read: true },
    { new: true }
  )
    .then((doc) => {
      return res.status(201).json({ message: "notification read successfuly" });
    })
    .catch((e) => {
      console.log(e);
      return res.status(500).json(e);
    });
};
exports.getAllNotifications = (req, res) => {
  //pagination require.........................
  Notification.find({ recipientId: req.user._id })
    .populate("senderId", "_id userName profileImageUrl")
    .populate("postId", "type")
    .populate("recipientId", "_id userName profileImageUrl")
    .sort("-createdAt")
    .then((notification) => {
      return res.status(200).json(notification);
    })
    .catch((e) => {
      console.log(e);
      return res.status(422).json(e);
    });
};
