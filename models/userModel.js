const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    provider: {
      type: String,
    },
    authId: {
      type: String,
    },
    email: {
      type: String,
    },
    password: {
      type: String,
      // required: true,
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
      default:
        "https://www.setaswall.com/wp-content/uploads/2017/06/Closed-FB-Cover-Photo-851-x-315.jpg",
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
