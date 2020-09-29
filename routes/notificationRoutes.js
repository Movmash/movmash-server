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
