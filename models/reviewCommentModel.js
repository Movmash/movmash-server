const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;
const Schema = mongoose.Schema;

const reviewCommentSchema = new Schema(
  {
    comment: {
      type: String,
    },
    commentedBy: {
      type: ObjectId,
      ref: "User",
    },
    commentId: {
      type: ObjectId,
      ref: "Comment",
    },
    reviewId: {
      type: ObjectId,
      ref: "UserReview",
    },
  },
  { timestamps: true }
);

mongoose.set("useFindAndModify", false);
module.exports = ReviewComment = mongoose.model(
  "ReviewComment",
  reviewCommentSchema
);
