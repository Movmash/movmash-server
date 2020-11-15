const User = require("../models/userModel");
const Post = require("../models/postModel");
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
