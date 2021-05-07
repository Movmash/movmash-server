const UserGenrePreference = require("../models/userGenrePreferenceModel");
const User = require("../models/userModel");
const { getPercent } = require("../util/getPercent");
const Post = require("../models/postModel");
exports.getUserRecommendation = (req, res) => {
  const results = [];
  User.find({})
    .select("_id")
    .then((otherUserId) => {
      UserGenrePreference.find({ user: { $in: otherUserId } })
        .populate("user", "profileImageUrl userName fullName")
        .then((genrePreference) => {
          const userPrefernce = genrePreference.filter(
            (pref) => pref.user._id.toString() === req.user._id.toString()
          )[0];
          const otherUserGenrePreference = genrePreference.filter(
            (pref) => pref.user._id.toString() !== req.user._id.toString()
          );
          let genrePercent = [];
          console.log(otherUserGenrePreference[0].user);
          //for loop
          for (let i = 0; i < otherUserGenrePreference.length; i++) {
            if (
              userPrefernce.Action !== 0 &&
              otherUserGenrePreference[i].Action !== 0
            ) {
              genrePercent.push(
                getPercent(
                  userPrefernce.Action,
                  otherUserGenrePreference[i].Action
                )
              );
            }
            if (
              userPrefernce.Comedy !== 0 &&
              otherUserGenrePreference[i].Comedy !== 0
            ) {
              genrePercent.push(
                getPercent(
                  userPrefernce.Comedy,
                  otherUserGenrePreference[i].Comedy
                )
              );
            }
            if (
              userPrefernce.Horror !== 0 &&
              otherUserGenrePreference[i].Horror !== 0
            ) {
              genrePercent.push(
                getPercent(
                  userPrefernce.Horror,
                  otherUserGenrePreference[i].Horror
                )
              );
            }
            if (
              userPrefernce.Romance !== 0 &&
              otherUserGenrePreference[i].Romance !== 0
            ) {
              genrePercent.push(
                getPercent(
                  userPrefernce.Romance,
                  otherUserGenrePreference[i].Romance
                )
              );
            }
            if (
              userPrefernce.Documentary !== 0 &&
              otherUserGenrePreference[i].Documentary !== 0
            ) {
              genrePercent.push(
                getPercent(
                  userPrefernce.Documentary,
                  otherUserGenrePreference[i].Documentary
                )
              );
            }
            if (
              userPrefernce.Adventure !== 0 &&
              otherUserGenrePreference[i].Adventure !== 0
            ) {
              genrePercent.push(
                getPercent(
                  userPrefernce.Adventure,
                  otherUserGenrePreference[i].Adventure
                )
              );
            }
            if (
              userPrefernce.Animation !== 0 &&
              otherUserGenrePreference[i].Animation !== 0
            ) {
              genrePercent.push(
                getPercent(
                  userPrefernce.Animation,
                  otherUserGenrePreference[i].Animation
                )
              );
            }
            if (
              userPrefernce.Drama !== 0 &&
              otherUserGenrePreference[i].Drama !== 0
            ) {
              genrePercent.push(
                getPercent(
                  userPrefernce.Drama,
                  otherUserGenrePreference[i].Drama
                )
              );
            }
            if (
              userPrefernce.Crime !== 0 &&
              otherUserGenrePreference[i].Crime !== 0
            ) {
              genrePercent.push(
                getPercent(
                  userPrefernce.Crime,
                  otherUserGenrePreference[i].Crime
                )
              );
            }
            if (
              userPrefernce.Family !== 0 &&
              otherUserGenrePreference[i].Family !== 0
            ) {
              genrePercent.push(
                getPercent(
                  userPrefernce.Family,
                  otherUserGenrePreference[i].Family
                )
              );
            }
            if (
              userPrefernce.Fantasy !== 0 &&
              otherUserGenrePreference[i].Fantasy !== 0
            ) {
              genrePercent.push(
                getPercent(
                  userPrefernce.Fantasy,
                  otherUserGenrePreference[i].Fantasy
                )
              );
            }
            if (
              userPrefernce.History !== 0 &&
              otherUserGenrePreference[i].History !== 0
            ) {
              genrePercent.push(
                getPercent(
                  userPrefernce.History,
                  otherUserGenrePreference[i].History
                )
              );
            }
            if (
              userPrefernce.Music !== 0 &&
              otherUserGenrePreference[i].Music !== 0
            ) {
              genrePercent.push(
                getPercent(
                  userPrefernce.Music,
                  otherUserGenrePreference[i].Music
                )
              );
            }
            if (
              userPrefernce.Mystery !== 0 &&
              otherUserGenrePreference[i].Mystery !== 0
            ) {
              genrePercent.push(
                getPercent(
                  userPrefernce.Mystery,
                  otherUserGenrePreference[i].Mystery
                )
              );
            }
            if (
              userPrefernce.SciFi !== 0 &&
              otherUserGenrePreference[i].SciFi !== 0
            ) {
              genrePercent.push(
                getPercent(
                  userPrefernce.SciFi,
                  otherUserGenrePreference[i].SciFi
                )
              );
            }
            if (
              userPrefernce.TV !== 0 &&
              otherUserGenrePreference[i].TV !== 0
            ) {
              genrePercent.push(
                getPercent(userPrefernce.TV, otherUserGenrePreference[i].TV)
              );
            }
            if (
              userPrefernce.Thriller !== 0 &&
              otherUserGenrePreference[i].Thriller !== 0
            ) {
              genrePercent.push(
                getPercent(
                  userPrefernce.Thriller,
                  otherUserGenrePreference[i].Thriller
                )
              );
            }
            if (
              userPrefernce.War !== 0 &&
              otherUserGenrePreference[i].War !== 0
            ) {
              genrePercent.push(
                getPercent(userPrefernce.War, otherUserGenrePreference[i].War)
              );
            }
            if (
              userPrefernce.Western !== 0 &&
              otherUserGenrePreference[i].Western !== 0
            ) {
              genrePercent.push(
                getPercent(
                  userPrefernce.Western,
                  otherUserGenrePreference[i].Western
                )
              );
            }
            console.log(genrePercent);
            console.log(otherUserGenrePreference[i]);
            results.push({
              similiarity:
                genrePercent.reduce((a, b) => a + b, 0) / genrePercent.length,
              user: otherUserGenrePreference[i].user,
            });
            genrePercent = [];
          }

          //   console.log(genrePercent.reduce((a, b) => a + b, 0));
          return res
            .status(200)
            .json(results.sort((a, b) => b.similiarity - a.similiarity));
        })
        .catch((e) => {
          return res.status(500).json(500);
        });
    })
    .catch((e) => {
      console.log(e);
      return res.status(500).json(500);
    });
};

exports.getExplorePosts = (req, res) => {
  // pagination require ............................
  Post.find({ postType: "explore" })
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
};
