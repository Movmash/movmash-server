const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const Schema = mongoose.Schema;

const listSchema = new Schema(
  {
    createdBy: {
      type: ObjectId,
      ref: "User",
    },
    movieList: [{ type: Object }],
    listTitle: String,
    description: String,
    privacy: String,
    tags: [{ type: String }],
  },
  {
    timestamps: true,
  }
);

mongoose.set("useFindAndModify", false);
module.exports = List = mongoose.model("List", listSchema);
