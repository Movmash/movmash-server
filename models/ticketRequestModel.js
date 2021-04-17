const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;
const Schema = mongoose.Schema;

const ticketRequestSchema = new Schema(
  {
    postId: { type: ObjectId, ref: "Post" },
    postedBy: { type: ObjectId, ref: "User" },
    requestedBy: { type: ObjectId, ref: "User" },
    bookingStatus: { type: String, default: "pending" },
    showTimeFrom: { type: Date },
    showTimeTo: { type: Date },
  },
  {
    timestamps: true,
  }
);

mongoose.set("useFindAndModify", false);
module.exports = TicketRequest = mongoose.model(
  "TicketRequest",
  ticketRequestSchema
);
