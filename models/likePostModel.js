const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const Schema = mongoose.Schema;

const likePostSchema = new Schema(
  {
    postId: {
      type: ObjectId,
      ref: "Post",
    },
    likedBy: {
      type: ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

mongoose.set("useFindAndModify", false);
module.exports = Like = mongoose.model("Like", likePostSchema);
