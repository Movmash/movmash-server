const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;
const Schema = mongoose.Schema;

const userReviewSchema = new Schema(
  {
    movieId: Number,
    reviewBy: {
      type: ObjectId,
      ref: "User",
    },
    rate: Number,
    likesCount: { type: Number, default: 0 },
    likes: [{ type: ObjectId, ref: "User" }],
    dislikes: [{ type: ObjectId, ref: "User" }],
    dislikesCount: { type: Number, default: 0 },
    commentCount: {
      type: Number,
      default: 0,
    },
    comments: [{ type: Object, ref: "ReviewComment" }],
    description: String,
  },
  { timestamps: true }
);

mongoose.set("useFindAndModify", false);
module.exports = UserReview = mongoose.model("UserReview", userReviewSchema);
