const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    userName: {
      type: String,
      required: true,
    },
    profileImageUrl: {
      type: String,
      default: "no-photo",
    },
    coverImageUrl: {
      type: String,
      default: "no-cover-photo",
    },
    genre: String,
    bio: String,
    followersCount: {
      type: Number,
      default: 0,
    },
    followingsCount: {
      type: Number,
      default: 0,
    },
    watchHour: {
      type: Number,
      default: 0,
    },
    userRating: Number,
    postNumber: {
      type: Number,
      default: 0,
    },
    fullName: String,
    followers: [{ type: ObjectId, ref: "User" }],
    followings: [{ type: ObjectId, ref: "User" }],
  },
  { timestamps: true }
);
mongoose.set("useFindAndModify", false);
module.exports = User = mongoose.model("User", userSchema);
