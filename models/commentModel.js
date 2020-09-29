const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;
const Schema = mongoose.Schema;

const commentSchema = new Schema(
  {
    likeCount: {
      type: Number,
      default: 0,
    },
    likes: [{ type: ObjectId, ref: "User" }],
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
    postId: {
      type: ObjectId,
      ref: "Post",
    },
  },
  { timestamps: true }
);

mongoose.set("useFindAndModify", false);
module.exports = Comment = mongoose.model("Comment", commentSchema);
