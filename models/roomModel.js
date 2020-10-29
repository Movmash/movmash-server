const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;
const Schema = mongoose.Schema;

const roomModelSchema = new Schema(
  {
    participants: [{ type: ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

mongoose.set("useFindAndModify", false);
module.exports = Room = mongoose.model("Room", roomModelSchema);
