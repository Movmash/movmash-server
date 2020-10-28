const UserReview = require("../models/userReviewModel");

exports.postUserReview = (req, res) => {
  const userReview = {
    movieId: req.body.movieId,
    reviewBy: req.user._id,
    rate: req.body.rate,
    description: req.body.description,
  };
  UserReview.findOne({ movieId: userReview.movieId, reviewBy: req.user._id })

    .then((review) => {
      if (!review) {
        UserReview.create(userReview)
          // .populate("reviewBy", "userName email fullName profileImageUrl")
          .then((doc) => {
            return res.status(201).json(doc);
          })
          .catch((e) => {
            return res.status(500).json(e);
          });
      } else {
        UserReview.findOneAndUpdate(
          {
            movieId: userReview.movieId,
            reviewBy: req.user._id,
          },
          { rate: userReview.rate, description: userReview.description },
          { new: true }
        )
          .populate("reviewBy", "userName email fullName profileImageUrl")
          .then((doc) => {
            return res.status(201).json(doc);
          })
          .catch((e) => {
            console.log(e);
          });
      }
    })
    .catch((e) => {
      console.log(e);
    });
};

exports.movieRatedStatus = (req, res) => {
  UserReview.findOne({ movieId: req.params.movieId, reviewBy: req.user._id })
    .then((doc) => {
      if (!doc) {
        return res.status(200).json({ isRated: false });
      } else {
        return res.status(200).json({ isRated: true });
      }
    })
    .catch((e) => {
      console.log(e);
      return res.status(500).json(e);
    });
};
