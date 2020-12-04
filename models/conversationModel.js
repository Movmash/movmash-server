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
    type: String,
    movieData: { type: Object },
    postData: { type: Object },
  },
  { timestamps: true }
);

mongoose.set("useFindAndModify", false);
module.exports = Conversation = mongoose.model(
  "Conversation",
  conversationModelSchema
);
