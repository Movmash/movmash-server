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
  posterUrl: String,
  privacy: String,
  roomTitle: String,
});

mongoose.set("useFindAndModify", false);
module.exports = LiveShow = mongoose.model("LiveShow", liveShowSchema);
