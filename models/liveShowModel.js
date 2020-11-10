const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const Schema = mongoose.Schema;

const liveShowSchema = new Schema({
  host: {
    type: ObjectId,
    ref: "User",
  },
  description: String,
  roomCode: String,
  movieId: Number,
  posterUrl: {
    type: String,
    default:
      "https://cdn.pastemagazine.com/www/articles/2016/01/21/ProphetEW_Main.jpg",
  },
  privacy: String,
  roomTitle: String,
  memberNumber: {
    type: Number,
    default: 0,
  },
  genre: String,
  videoUrl: String,
});

mongoose.set("useFindAndModify", false);
module.exports = LiveShow = mongoose.model("LiveShow", liveShowSchema);
