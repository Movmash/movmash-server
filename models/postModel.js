const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;
const Schema = mongoose.Schema;

const postSchema = new Schema(
  {
    likeCount: {
      type: Number,
      default: 0,
    },
    commentCount: {
      type: Number,
      default: 0,
    },
    rating: Number,
    type: String,
    postedBy: {
      type: ObjectId,
      ref: "User",
    },
    likes: [{ type: ObjectId, ref: "User" }],
    comments: [{ type: ObjectId, ref: "Comment" }],
    movieId: Number,
    review: String,
    description: String,
    showTimeFrom: { type: Date },
    showTimeTo: { type: Date },
    genreName: [{ type: String }],
    language: String,
    duration: String,
    genreId: [{ type: Number }],
    moviePoster: String,
    releaseYear: Number,
    movieTitle: String,
    overview: String,
    postType: String,
  },
  { timestamps: true }
);

mongoose.set("useFindAndModify", false);
module.exports = Post = mongoose.model("Post", postSchema);
// profileImageUrl: String,D
//   createdAt: String,D
//   userName: String,D
//   likeCount: Number,D
//   commentCount: Number,D
//   rating: Number,D
//   type: String,D
//   description: String,D
//   movieId: Number,D
//   review: String,D
//   showTime: String,D
//   genre: String,D
//   language: String,D
//   duration: String,D
