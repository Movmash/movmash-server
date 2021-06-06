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
    .select("_id fullName profileImageUrl email userName")
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
    .populate("postedBy", "_id fullName profileImageUrl email userName")
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
    .populate("createdBy", "userName profileImageUrl fullName").sort("-createdAt")
    .then((result) => {
      return res.status(200).json(result);
    })
    .catch((e) => {
      console.log(e);
      return res.status(500).json(e);
    });
};

exports.getMovieList = (req,res) => {
  List.find({createdBy:{$ne: req.user._id}, privacy: "Public"}).populate("createdBy", "_id fullName profileImageUrl email userName").sort("createdAt").then(movieList => {
    return res.status(200).json(movieList);
  }).catch(e => {
    return res.status(422).json(e);
  });
}

exports.getPeopleList = (req,res) => {
  User.find({ _id: { $nin: [...req.user.followings, req.user._id] } })
    .select("_id fullName profileImageUrl email userName")
    .then((data) => {
      return res.status(200).json(data);
    })
    .catch((e) => {
      return res.status(422).json(e);
    });
}

exports.getTicket = (req,res) => {
  Post.find({ type: "ticket", postedBy: { $ne: req.user._id } })
    .populate("postedBy", "_id fullName profileImageUrl email userName")
    .then((data) => {
      console.log(data);
      return res.status(200).json(data);
    })
    .catch((e) => {
      return res.status(422).json(e);
    });;
}