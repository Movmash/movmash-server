const Post = require("../models/postModel");
const User = require("../models/userModel");
exports.postOnePosts = (req, res) => {
  // console.log(req.user);
  switch (req.body.type) {
    case "review":
      console.log("1");
      if (req.body.review.trim() === "") {
        return res
          .status(400)
          .json({ review: "Write something about this movie" });
      }
      const newReviewPost = {
        // profileImageUrl: req.body.profileImageUrl,
        postedBy: req.user,
        rating: req.body.rating,
        type: req.body.type,
        description: req.body.description,
        movieId: req.body.movieId,
        review: req.body.review,
      };
      Post.create(newReviewPost)
        .then((doc) => {
          User.findOneAndUpdate(
            { userName: req.user.userName },
            { $inc: { postNumber: 1 } },
            { new: true }
          )
            // .select("-")
            .then(() => {
              return res.status(201).json(doc);
            })
            .catch((e) => {
              console.log(e);
              return res.status(500).json({ e });
            });
        })
        .catch((e) => {
          return res.status(500).json(e);
        });
      break;
    case "ticket":
      console.log("2");
      const newTicketPost = {
        postedBy: req.user,
        type: req.body.type,
        description: req.body.description,
        movieId: req.body.movieId,
        showTime: req.body.showTime,
      };
      Post.create(newTicketPost)
        .then((doc) => {
          User.findOneAndUpdate(
            { userName: req.user.userName },
            { $inc: { postNumber: 1 } },
            { new: true }
          )
            .then(() => {
              // console.log(updated);
              return res.status(201).json(doc);
            })
            .catch((e) => {
              console.log(e);
              return res.status(500).json({ e });
            });
        })
        .catch((e) => {
          return res.status(500).json(e);
        });
      break;
    case "suggestMe":
      console.log("3");
      if (req.body.description.trim() === "") {
        return res
          .status(400)
          .json({ description: "Say which type of movie you want" });
      }
      const newSuggestMePost = {
        postedBy: req.user,
        rating: req.body.rating,
        type: req.body.type,
        description: req.body.description,
        genre: req.body.genre,
        language: req.body.language,
        duration: req.body.duration,
      };
      Post.create(newSuggestMePost)
        .then((doc) => {
          User.findOneAndUpdate(
            { userName: req.user.userName },
            { $inc: { postNumber: 1 } }
          )
            .then(() => {
              return res.status(201).json(doc);
            })
            .catch((e) => {
              console.log(e);
              return res.status(500).json({ e });
            });
        })
        .catch((e) => {
          return res.status(500).json(e);
        });
      break;

    default:
      console.log("invalid post");
      break;
  }
};
exports.likePost = (req, res) => {
  Post.findByIdAndUpdate(
    req.body.postId,
    {
      $push: { likes: req.user._id },
      $inc: { likeCount: 1 },
    },
    { new: true }
  ).exec((err, result) => {
    if (err) return res.status(422).json({ error: err });
    else return res.status(201).json(result);
  });
};

exports.unlikePost = (req, res) => {
  Post.findByIdAndUpdate(
    req.body.postId,
    {
      $pull: { likes: req.user._id },
      $inc: { likeCount: -1 },
    },
    { new: true }
  ).exec((err, result) => {
    if (err) return res.status(422).json({ error: err });
    else return res.status(201).json(result);
  });
};

exports.deletePost = (req, res) => {
  Post.findOne({ _id: req.params.postId })
    .populate("postedBy", "_id")
    .exec((err, post) => {
      if (err || !post) return res.status(422).json({ error: err });

      if (post.postedBy._id.toString() === req.user._id.toString()) {
        post
          .remove()
          .then((result) => {
            User.findByIdAndUpdate(
              post.postedBy._id,
              { $inc: { postNumber: -1 } },
              { new: true }
            )
              .select("-password")
              .then((doc) => {
                console.log(doc);
              })
              .catch((e) => {
                console.log(e);
              });
            return res.status(201).json(result);
          })
          .catch((e) => {
            console.log(e);
          });
      }
    });
  // Post.findOne({_id:req.params.pos})
};

exports.getSubscribedPost = (req, res) => {
  Post.find({ postedBy: { $in: req.user.followings } })
    .populate("postedBy", "_id email userName profileImageUrl")
    .sort("-createdAt")
    .then((posts) => {
      return res.status(200).json({ posts });
    })
    .catch((e) => {
      console.log(e);
    });
};

exports.getMyPost = (req, res) => {
  console.log(req.user._id);
  Post.find({ postedBy: req.user._id })
    .populate("postedBy", "_id email userName profileImageUrl")
    .then((myPost) => {
      return res.status(200).json(myPost);
    })
    .catch((e) => {
      return res.status(500).json(e);
    });
};
