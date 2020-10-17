const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const Schema = mongoose.Schema;

const likedMovieSchema = new Schema(
  {
    movieId: Number,
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
module.exports = LikedMovie = mongoose.model("LikedMovie", likedMovieSchema);
