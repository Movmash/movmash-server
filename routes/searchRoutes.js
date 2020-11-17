const User = require("../models/userModel");
const Post = require("../models/postModel");
const List = require("../models/listModel");
exports.searchUser = (req, res) => {
  const searchUserQuery = req.query.search;
  User.find({
    $or: [
      { userName: { $regex: searchUserQuery, $options: "i" } },
      { fullName: { $regex: searchUserQuery, $options: "i" } },
      { email: { $regex: searchUserQuery, $options: "i" } },
    ],
  })
    .then((result) => {
      return res.status(200).json(result);
    })
    .catch((e) => {
      console.log(e);
      // return res.status(500).json(e)
    });
};

exports.searchTicket = (req, res) => {
  const searchTicketQuery = req.query.search;
  Post.find({
    postType: "explore",
    type: "ticket",
    movieTitle: { $regex: searchTicketQuery, $options: "i" },
  })
    .then((data) => {
      return res.status(200).json(data);
    })
    .catch((e) => {
      console.log(e);
      return res.status(500).json(e);
    });
};

exports.searchList = (req, res) => {
  const searchListQuery = req.query.search;
  List.find({
    $or: [
      { listTitle: { $regex: searchListQuery, $options: "i" } },
      { tags: { $regex: searchListQuery, $options: "i" } },
    ],
    privacy: "Public",
  })
    .populate("createdBy", "userName profileImageUrl fullName")
    .then((result) => {
      return res.status(200).json(result);
    })
    .catch((e) => {
      console.log(e);
      return res.status(500).json(e);
    });
};
