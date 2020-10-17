const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const Schema = mongoose.Schema;

const dislikedMovieSchema = new Schema(
  {
    movieId: Number,
    dislikedBy: {
      type: ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

mongoose.set("useFindAndModify", false);
module.exports = DislikedMovie = mongoose.model(
  "DislikedMovie",
  dislikedMovieSchema
);
