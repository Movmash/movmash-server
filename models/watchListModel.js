const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const Schema = mongoose.Schema;

const watchlistSchema = new Schema(
  {
    movieId: Number,
    watchlistedBy: {
      type: ObjectId,
      ref: "User",
    },
    movieTitle: String,
    overview: String,
    moviePoster: String,
    releaseDate: String,
    genreId: [{ type: Number }],
  },
  {
    timestamps: true,
  }
);

mongoose.set("useFindAndModify", false);
module.exports = Watchlist = mongoose.model("Watchlist", watchlistSchema);
