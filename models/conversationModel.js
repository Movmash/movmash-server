const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;
const Schema = mongoose.Schema;

const conversationModelSchema = new Schema(
  {
    sender: { type: ObjectId, ref: "User" },
    recipient: { type: ObjectId, ref: "User" },
    message: String,
    read: { type: Boolean, default: false },
    roomId: { type: ObjectId, ref: "Room" },
  },
  { timestamps: true }
);

mongoose.set("useFindAndModify", false);
module.exports = Conversation = mongoose.model(
  "Conversation",
  conversationModelSchema
);
