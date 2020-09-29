const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;
const Schema = mongoose.Schema;

const notificationSchema = new Schema(
  {
    type: String,
    read: {
      type: Boolean,
      default: false,
    },
    senderId: {
      type: ObjectId,
      ref: "User",
    },
    postId: {
      type: ObjectId,
      ref: "Post",
    },
    recipientId: {
      type: ObjectId,
      ref: "User",
    },
    commentId: {
      type: ObjectId,
      ref: "Comment",
    },
  },
  {
    timestamps: true,
  }
);

mongoose.set("useFindAndModify", false);
module.exports = Notification = mongoose.model(
  "Notification",
  notificationSchema
);
