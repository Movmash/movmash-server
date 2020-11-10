const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;
const Schema = mongoose.Schema;

const userGenrePreferenceSchema = new Schema(
  {
    user: { type: ObjectId, ref: "User" },
    Action: {
      type: Number,
      default: 0,
    },
    Comedy: {
      type: Number,
      default: 0,
    },
    Horror: {
      type: Number,
      default: 0,
    },
    Romance: {
      type: Number,
      default: 0,
    },
    Documentary: {
      type: Number,
      default: 0,
    },
    Adventure: {
      type: Number,
      default: 0,
    },
    Animation: {
      type: Number,
      default: 0,
    },
    Drama: {
      type: Number,
      default: 0,
    },
    Crime: {
      type: Number,
      default: 0,
    },
    Family: {
      type: Number,
      default: 0,
    },
    Fantasy: {
      type: Number,
      default: 0,
    },
    History: {
      type: Number,
      default: 0,
    },
    Music: {
      type: Number,
      default: 0,
    },
    Mystery: {
      type: Number,
      default: 0,
    },
    SciFi: {
      type: Number,
      default: 0,
    },
    TV: {
      type: Number,
      default: 0,
    },
    Thriller: {
      type: Number,
      default: 0,
    },
    War: {
      type: Number,
      default: 0,
    },
    Western: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);
mongoose.set("useFindAndModify", false);
module.exports = UserGenrePreference = mongoose.model(
  "UserGenrePreference",
  userGenrePreferenceSchema
);
