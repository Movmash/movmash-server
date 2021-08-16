const Post = require("../models/postModel");
const Comment = require("../models/commentModel");
const User = require("../models/userModel");
const Like = require("../models/likePostModel");
const TicketRequest = require("../models/ticketRequestModel");
exports.postOnePosts = (req, res) => {
  // console.log(req.user);
  switch (req.body.type) {
    case "review":
      // console.log("1");
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
        movieId: req.body.movieId,
        review: req.body.review,
        genreId: req.body.genreId,
        moviePoster: req.body.moviePoster,
        releaseYear: req.body.releaseYear,
        movieTitle: req.body.movieTitle,
        postType: req.body.postType,
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
      // console.log("2");
      const newTicketPost = {
        postedBy: req.user,
        type: req.body.type,
        description: req.body.description,
        movieId: req.body.movieId,
        showTimeFrom: req.body.showTimeFrom,
        showTimeTo: req.body.showTimeTo,
        genreId: req.body.genreId,
        moviePoster: req.body.moviePoster,
        releaseYear: req.body.releaseYear,
        movieTitle: req.body.movieTitle,
        overview: req.body.overview,
        postType: req.body.postType,
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
      // console.log("3");
      // if (req.body.description.trim() === "") {
      //   return res
      //     .status(400)
      //     .json({ description: "Say which type of movie you want" });
      // }
      const newSuggestMePost = {
        postedBy: req.user,
        rating: req.body.rating,
        type: req.body.type,

        genreName: req.body.genreName,
        language: req.body.language,
        duration: req.body.duration,
        postType: req.body.postType,
      };
      Post.create(newSuggestMePost)
        .then((doc) => {
          User.findOneAndUpdate(
            { userName: req.user.userName },
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
          console.log(e);
          return res.status(500).json(e);
        });
      break;

    default:
      // console.log("invalid post");
      break;
  }
};
exports.likePost = (req, res) => {
  // console.log("hell");
  Like.exists(
    { postId: req.body.postId, likedBy: req.user._id },
    function (err, docs) {
      if (err) {
        return res.status(422).json({ error: err });
      } else {
        if (!docs) {
          Like.create({
            postId: req.body.postId,
            likedBy: req.user._id,
          })
            .then((likeDoc) => {
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
            })
            .catch((e) => {
              console.log(e);
              return res.status(422).json({ error: e });
            });
        } else {
          Post.findById(req.body.postId).exec((err, result) => {
            if (err) return res.status(422).json({ error: err });
            else return res.status(201).json(result);
          });
        }
      }
    }
  );
};

exports.unlikePost = (req, res) => {
  Like.findOneAndDelete({ postId: req.body.postId, likedBy: req.user._id })
    .then((docs) => {
      if (docs === null) {
        Post.findById(req.body.postId).exec((err, result) => {
          if (err) return res.status(422).json({ error: err });
          else return res.status(201).json(result);
        });
      } else {
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
      }
    })
    .catch((e) => {
      console.log(e);
    });
};

exports.deletePost = (req, res) => {
  Post.findOne({ _id: req.params.postId })
    .populate("postedBy", "_id")
    .exec((err, post) => {
      if (err || !post) return res.status(422).json({ error: err });

      if (post.postedBy._id.toString() === req.user._id.toString()) {
        if(post.type === "ticket"){

        post
          .remove()
          .then((result) => {
            User.findByIdAndUpdate(
              post.postedBy._id,
              { new: true }
            )
              .select("-password")
              .then((doc) => {
                // console.log(doc);
              })
              .catch((e) => {
                console.log(e);
              });
            return res.status(201).json(result);
          })
          .catch((e) => {
            console.log(e);
          });
        }else {

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
                // console.log(doc);
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
      }
    });
  // Post.findOne({_id:req.params.pos})
};

exports.getSubscribedPost = (req, res) => {
  // pagination require ............................
  const timeFilter = new Date().setHours(new Date().getHours() - 6);
  Post.deleteMany({
    showTimeTo: { $lt: timeFilter },
    postedBy: req.user._id,
  })
    .then(() => {
        Post.find({
          postedBy: { $in: [...req.user.followings, req.user._id] },
          postType: { $ne: "explore" },
        })
          .populate("postedBy", "_id email userName profileImageUrl")
          .populate({
            path: "comments",
            model: "Comment",
            populate: {
              path: "commentedBy",
              select: "_id email userName profileImageUrl",
              model: "User",
            },
          })
          .sort("-createdAt")
          .then((posts) => {
            return res.status(200).json(posts);
          })
          .catch((e) => {
            console.log(e);
          });
    })
    .catch((e) => {
      console.log(e);
    });
};

exports.getMyPost = (req, res) => {
  // pageination require ......................................
  // console.log(req.user._id);
  Post.find({ postedBy: req.user._id })
    .populate("postedBy", "_id email userName profileImageUrl")
    .populate({
      path: "comments",
      model: "Comment",
      populate: {
        path: "commentedBy",
        select: "_id email userName profileImageUrl",
        model: "User",
      },
    })
    .sort("-createdAt")
    // .select("comments")
    .then((myPost) => {
      return res.status(200).json(myPost);
    })
    .catch((e) => {
      return res.status(500).json(e);
    });
};

exports.postComment = (req, res) => {
  // console.log(req.body.comment);
  if (req.body.comment.trim() === "")
    return res.status(422).json({ message: "commet should not be empty" });
  if (req.body.postType === "review") {
    const newComment = {
      commentedBy: req.user._id,
      postId: req.body.postId,
      comment: req.body.comment,
      postType: req.body.postType,
    };

    Comment.create(newComment)
      .then((result) => {
        // console.log(result);
        Post.findByIdAndUpdate(
          req.body.postId,
          { $push: { comments: result._id }, $inc: { commentCount: 1 } },
          { new: true }
        )
          .populate({
            path: "comments",
            model: "Comment",
            populate: {
              path: "commentedBy",
              select: "_id email userName profileImageUrl",
              model: "User",
            },
          })
          .exec((err, doc) => {
            if (err) return res.status(422).json(err);
            return res.status(201).json(doc);
          });
      })
      .catch((e) => {
        console.log(e);
      });
  } else {
    const newComment = {
      commentedBy: req.user._id,
      postId: req.body.postId,
      comment: req.body.comment,
      postType: req.body.postType,
      moviePoster: req.body.moviePoster,
      releaseYear: req.body.releaseYear,
      genreId: req.body.genreId,
      overview: req.body.overview,
      movieTitle: req.body.movieTitle,
      movieId: req.body.movieId,
    };

    Comment.create(newComment)
      .then((result) => {
        // console.log(result);
        Post.findByIdAndUpdate(
          req.body.postId,
          { $push: { comments: result._id }, $inc: { commentCount: 1 } },
          { new: true }
        )
          .populate({
            path: "comments",
            model: "Comment",
            populate: {
              path: "commentedBy",
              select: "_id email userName profileImageUrl",
              model: "User",
            },
          })
          .exec((err, doc) => {
            if (err) return res.status(422).json(err);
            return res.status(201).json(doc);
          });
      })
      .catch((e) => {
        console.log(e);
      });
  }
};

exports.deleteComment = (req, res) => {
  Comment.findOne({ _id: req.params.commentId })
    .populate("commentedBy", "_id")
    .exec((err, comment) => {
      // console.log(comment);
      if (err || !comment) return res.status(422).json(err);
      if (comment.commentedBy._id.toString() === req.user._id.toString()) {
        comment.remove().then((result) => {
          Post.findByIdAndUpdate(
            comment.postId,
            {
              $pull: { comments: req.params.commentId },
              $inc: { commentCount: -1 },
            },
            { new: true }
          )
            .then((doc) => {
              // console.log(doc);
              // console.log(result);
              return res.status(201).json({ doc, result });
            })
            .catch((e) => {
              console.log(e);
            });
        });
      }
    });
};
exports.likeComment = (req, res) => {
  Comment.find(
    { $and: [{ _id: req.body.commentId }, { likes: { $in: req.user._id } }] },
    (err, docs) => {
      if (err) return res.status(422).json({ error: err });
      else {
        if (docs.length === 0) {
          Comment.findByIdAndUpdate(
            req.body.commentId,
            {
              $push: { likes: req.user._id },
              $inc: { likeCount: 1 },
            },
            { new: true }
          ).exec((err, result) => {
            if (err) return res.status(422).json({ error: err });
            return res.status(201).json(result);
          });
        } else {
          Comment.findById(req.body.commentId).exec((err, result) => {
            if (err) return res.status(422).json({ error: err });
            return res.status(201).json(result);
          });
        }
      }
    }
  );
};

exports.unlikeComment = (req, res) => {
  Comment.find(
    { $and: [{ _id: req.body.commentId }, { likes: { $in: req.user._id } }] },
    (err, docs) => {
      if (err) return res.status(422).json({ error: err });
      else {
        if (docs.length === 1) {
          Comment.findByIdAndUpdate(
            req.body.commentId,
            { $pull: { likes: req.user._id }, $inc: { likeCount: -1 } },
            { new: true }
          ).exec((err, result) => {
            if (err) return res.status(422).json({ error: err });
            return res.status(201).json(result);
          });
        } else {
          Comment.findById(req.body.commentId).exec((err, result) => {
            if (err) return res.status(422).json({ error: err });
            return res.status(201).json(result);
          });
        }
      }
    }
  );
};

exports.getPostComments = (req, res) => {
  //pagination needed...............................
  Comment.find({ postId: req.body.postId })
    .sort("-createdAt")
    .then((doc) => {
      return res.status(200).json(doc);
    })
    .catch((e) => {
      console.log(e);
      return res.status(422).json(e);
    });
};

exports.getMashUserPost = (req, res) => {
  userName = req.params.userName;
  // console.log(userId);
  User.findOne({ userName: userName })
    .then((user) => {
      Post.find({ postedBy: user._id })
        .sort("-createdAt")
        .populate("postedBy", "_id profileImageUrl userName email fullName")
        .populate({
          path: "comments",
          model: "Comment",
          populate: {
            path: "commentedBy",
            select: "_id profileImageUrl userName email fullName",
            model: "User",
          },
        })
        .then((post) => {
          return res.status(200).json(post);
        })
        .catch((e) => {
          console.log(e);
          return res.status(500).json(e);
        });
    })
    .catch((e) => {
      // console.log("user Not found");
      console.log(e);
    });
};

exports.getPostDetails = (req,res) => {
  // console.log(req.params.postId)
  Post.findById(req.params.postId)
    .populate("postedBy", "_id profileImageUrl userName email fullName")
    .populate({
      path: "comments",
      model: "Comment",
      populate: {
        path: "commentedBy",
        select: "_id profileImageUrl userName email fullName",
        model: "User",
      },
    })
    .then((postDetail) => {
      if (postDetail === null) {
        return res.status(404).json({ message: "postNotFound" });
      } else {
        return res.status(200).json(postDetail);
      }
    })
    .catch((e) => {
      return res.status(422).json({ message: "postNotFound" });
    });
}
//........... booking ticket management

exports.sendBookingRequest = (req, res) => {
  // console.log(req.body);
  const bookingRequest = {
    postId: req.body.postId,
    postedBy: req.body.postedBy,
    requestedBy: req.user._id,
    showTimeFrom: req.body.showTimeFrom,
    showTimeTo: req.body.showTimeTo,
  };

  TicketRequest.create(bookingRequest)
    .then((doc) => {
      TicketRequest.findById(doc._id)
        .populate("postedBy", "profileImageUrl userName email fullName")
        .populate("requestedBy", "profileImageUrl userName email fullName")
        .populate("postId")

        .then((ticket) => {
          Post.findByIdAndUpdate(
            req.body.postId,
            { $push: { bookingRequest: req.user._id } },
            { new: true }
          )
            .then((post) => {
              // console.log(ticket);
              return res.status(201).json(ticket);
            })
            .catch((e) => {
              console.log(e);
            });
        })
        .catch((e) => {
          console.log(e);
        });
    })
    .catch((e) => {
      console.log(e);
      return res.status(500).json({ error: "internal server error" });
    });
};

exports.getRequestedTicket = (req, res) => {
  const timeFilter = new Date().setHours(new Date().getHours() - 6);
  TicketRequest.deleteMany({ showTimeTo: { $lt: timeFilter } })
    .then(() => {
      TicketRequest.find({
        $or: [{ requestedBy: req.user._id }, { postedBy: req.user._id }],
      })
        .populate("postedBy", "profileImageUrl userName email fullName")
        .populate("requestedBy", "profileImageUrl userName email fullName")
        .populate("postId")
        .sort("-createdAt")
        .then((data) => {
          //................
          return res.status(200).json(data);
        })
        .catch((e) => {
          console.log(e);
          return res.status(500).json({ error: e });
        });
    })
    .catch((e) => {
      console.log(e);
      // return res.status(500).json({ error: e });
    });
};

exports.cancelRequestedTicket = (req, res) => {
  // console.log(req.body);
  TicketRequest.findOneAndDelete({
    postId: req.params.postId,
    $or: [
      { requestedBy: req.body.requestedBy },
      { postedBy: req.body.postedBy },
    ],
  })
    .then((doc) => {
      if (req.body.requestedBy === req.body.postedBy) {
        Post.findByIdAndUpdate(
          req.params.postId,
          {
            $pull: { bookingRequest: req.body.postedBy },
          },
          { new: true }
        )
          .then((post) => {
            return res.status(201).json({ deleted: "successfully" });
          })
          .catch((e) => {
            console.log(e);
          });
      } else {
        Post.findByIdAndUpdate(
          req.params.postId,
          {
            $pull: { bookingRequest: req.body.requestedBy },
          },
          { new: true }
        )
          .then((post) => {
            return res.status(201).json({ deleted: "successfully" });
          })
          .catch((e) => {
            console.log(e);
          });
      }
    })
    .catch((e) => {
      console.log(e);
      return res.status(500).json(e);
    });
};
exports.markRequestedTicketConfirmed = (req, res) => {
  TicketRequest.findByIdAndUpdate(
    req.body.ticketId,
    { bookingStatus: "confirm" },
    { new: true }
  )
    .then((doc) => {
      return res.status(201).json(doc);
    })
    .catch((e) => {
      console.log(e);
      return res.status(500).json(e);
    });
};
