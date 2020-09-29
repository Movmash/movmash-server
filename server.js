const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();
const requests = require("./requests.js");
const axios = require("./axios.js");
const Notification = require("./models/notificationModel");
const Post = require("./models/postModel");
const User = require("./models/userModel");
const {
  signup,
  login,
  getUserDetails,
  followUser,
  unfollowUser,
} = require("./routes/userRoutes.js");
const mashDBAuth = require("./util/mashDBAuth.js");
const {
  postOnePosts,
  likePost,
  unlikePost,
  deletePost,
  getSubscribedPost,
  getMyPost,
} = require("./routes/postRoutes.js");
const { markNotificationRead } = require("./routes/notificationRoutes.js");
//....................................................................................

app.use(cors((origin = "http://localhost:3000"), (optionsSuccessStatus = 200)));
app.use(express.json());
mongoose.connect(process.env.DB_URI, {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

//....................................................................................

const db = mongoose.connection;
db.once("open", () => {
  console.log("mashDB is now connected");
  const posts = db.collection("posts");
  const changeStream = posts.watch();

  changeStream.on("change", (change) => {
    if (change.operationType === "update") {
      // console.log(change);
      const updatedDocumentId = change.documentKey._id;
      if ("likeCount" in change.updateDescription.updatedFields) {
        // trigger on like the post led to create a new notification
        // console.log(
        //   typeof change.updateDescription.updatedFields.likes === "undefined"
        // );
        console.log(
          typeof change.updateDescription.updatedFields.likes === "undefined"
        );
        if (
          typeof change.updateDescription.updatedFields.likes === "undefined"
        ) {
          console.log("liked");
          Post.findById(updatedDocumentId)
            .then((doc) => {
              //if user not like its own post
              if (!doc.likes.includes(doc.postedBy)) {
                const newNotification = {
                  type: "like",
                  senderId:
                    change.updateDescription.updatedFields[
                      Object.keys(change.updateDescription.updatedFields)[1]
                    ],
                  postId: updatedDocumentId,
                  recipientId: doc.postedBy,
                };
                Notification.create(newNotification)
                  .then((doc) => {
                    console.log(doc);
                  })
                  .catch((e) => {
                    console.log(e);
                  });
              }
              // console.log(doc);
            })
            .catch((e) => {
              console.log(e);
            });
        }
        // trigger on unlike the post let to delete the notification
        else {
          if ("likes" in change.updateDescription.updatedFields) {
            console.log("unlike");
            const likeUserId = change.updateDescription.updatedFields.likes;
            console.log(likeUserId);
            Notification.deleteMany(
              { type: "like", senderId: { $nin: likeUserId } },
              (err) => {
                if (err) console.log(err);
              }
            );
          }

          // db.collection("notifications")
          // console.log(
          //   change.updateDescription.updatedFields[
          //     Object.keys(change.updateDescription.updatedFields)[1]
          //   ]
          // );
          // console.log(typeof change.updateDescription.updatedFields.likes);
          // console.log(change);
          //         }
        }
      }

      // console.log(
      // change.updateDescription.updatedFields[
      //   Object.keys(change.updateDescription.updatedFields)[1]
      // ]
      // );
      // Post.findById(change.documentKey._id).then((doc) => console.log(doc));
    }
  });
  const users = db.collection("users");
  const changeStreamForFollowing = users.watch();
  changeStreamForFollowing.on("change", (change) => {
    // console.log(typeof change.updateDescription.updatedFields.followers);
    if (change.operationType === "update") {
      if ("followersCount" in change.updateDescription.updatedFields) {
        if (
          typeof change.updateDescription.updatedFields.followers ===
          "undefined"
        ) {
          console.log("follow");
          // console.log(
          //   change.updateDescription.updatedFields[
          //     Object.keys(change.updateDescription.updatedFields)[0]
          //   ]
          // );
          const newFollowNotification = {
            type: "following",
            recipientId: change.documentKey._id,
            senderId:
              change.updateDescription.updatedFields[
                Object.keys(change.updateDescription.updatedFields)[0]
              ],
          };
          Notification.create(newFollowNotification)
            .then((doc) => {
              console.log(doc);
            })
            .catch((e) => {
              console.log(e);
            });
        } else {
          console.log("unfollow");
          console.log(change);
          const followerUserId =
            change.updateDescription.updatedFields.followers;
          Notification.deleteMany(
            { type: "following", senderId: { $nin: followerUserId } },
            (err) => {
              if (err) console.log(err);
            }
          );
        }
      }
    }
  });
});

//....................................................................................

app.get("/api/v1/movie/upcoming-cover", (req, res) => {
  let results = [];
  let promises = [];
  axios
    .get(requests.fetchUpcomingMovies)
    .then((response) => {
      results = [...response.data.results.splice(0, 5)];
      for (let i = 0; i < results.length; i++) {
        promises.push(
          axios
            .get(
              `https://api.themoviedb.org/3/movie/${results[i].id}/videos?api_key=${process.env.API_KEY}&language=en-US`
            )
            .then((response) => {
              results[i].trailers = response.data.results;
            })
            .catch((e) => {
              console.log(e);
              res.status(500).json(e.message);
            })
        );
      }
      Promise.all(promises).then(() => {
        res.status(200).json(results);
      });
    })
    .catch((e) => {
      console.log(e);
      res.status(500).json(e.message);
    });
});

app.get("/api/v1/movie/genre/:genreName/:pageNumber", (req, res) => {
  const genre = req.params.genreName;
  const page = req.params.pageNumber;
  switch (genre) {
    case "trending":
      axios
        .get(requests.fetchTrending + `&page=${page}`)
        .then((response) => {
          res.status(200).json(response.data);
        })
        .catch((e) => {
          console.log(e);
          res.status(500).json(e.message);
        });
      break;
    case "topRated":
      axios
        .get(requests.fetchTopRated + `&page=${page}`)
        .then((response) => {
          res.status(200).json(response.data);
        })
        .catch((e) => {
          console.log(e);
          res.status(500).json(e.message);
        });
      break;
    case "action":
      axios
        .get(requests.fetchActionMovies + `&page=${page}`)
        .then((response) => {
          res.status(200).json(response.data);
        })
        .catch((e) => {
          console.log(e);
          res.status(500).json(e.message);
        });
      break;
    case "comedy":
      axios
        .get(requests.fetchComedyMovies + `&page=${page}`)
        .then((response) => {
          res.status(200).json(response.data);
        })
        .catch((e) => {
          console.log(e);
          res.status(500).json(e.message);
        });
      break;
    case "horror":
      axios
        .get(requests.fetchHorrorMovies + `&page=${page}`)
        .then((response) => {
          res.status(200).json(response.data);
        })
        .catch((e) => {
          console.log(e);
          res.status(500).json(e.message);
        });
      break;
    case "romance":
      axios
        .get(requests.fetchRomanceMovies + `&page=${page}`)
        .then((response) => {
          res.status(200).json(response.data);
        })
        .catch((e) => {
          console.log(e);
          res.status(500).json(e.message);
        });
      break;
    case "documentary":
      axios
        .get(requests.fetchDocumentaries + `&page=${page}`)
        .then((response) => {
          res.status(200).json(response.data);
        })
        .catch((e) => {
          console.log(e);
          res.status(500).json(e.message);
        });
      break;
    case "upcoming":
      axios
        .get(requests.fetchUpcomingMovies + `&page=${page}`)
        .then((response) => {
          res.status(200).json(response.data);
        })
        .catch((e) => {
          console.log(e);
          res.status(500).json(e.message);
        });
      break;
    case "adventure":
      axios
        .get(requests.fetchAdventureMovies + `&page=${page}`)
        .then((response) => {
          res.status(200).json(response.data);
        })
        .catch((e) => {
          console.log(e);
          res.status(500).json(e.message);
        });
      break;
    case "animation":
      axios
        .get(requests.fetchAnimationMovies + `&page=${page}`)
        .then((response) => {
          res.status(200).json(response.data);
        })
        .catch((e) => {
          console.log(e);
          res.status(500).json(e.message);
        });
      break;
    case "drama":
      axios
        .get(requests.fetchDramaMovies + `&page=${page}`)
        .then((response) => {
          res.status(200).json(response.data);
        })
        .catch((e) => {
          console.log(e);
          res.status(500).json(e.message);
        });
      break;
    case "crime":
      axios
        .get(requests.fetchCrimeMovies + `&page=${page}`)
        .then((response) => {
          res.status(200).json(response.data);
        })
        .catch((e) => {
          console.log(e);
          res.status(500).json(e.message);
        });
      break;
    case "family":
      axios
        .get(requests.fetchFamilyMovies + `&page=${page}`)
        .then((response) => {
          res.status(200).json(response.data);
        })
        .catch((e) => {
          console.log(e);
          res.status(500).json(e.message);
        });
      break;
    case "fanatasy":
      axios
        .get(requests.fetchFantasyMovies + `&page=${page}`)
        .then((response) => {
          res.status(200).json(response.data);
        })
        .catch((e) => {
          console.log(e);
          res.status(500).json(e.message);
        });
      break;
    case "history":
      axios
        .get(requests.fetchHistoryMovies + `&page=${page}`)
        .then((response) => {
          res.status(200).json(response.data);
        })
        .catch((e) => {
          console.log(e);
          res.status(500).json(e.message);
        });
      break;
    case "music":
      axios
        .get(requests.fetchMusicMovies + `&page=${page}`)
        .then((response) => {
          res.status(200).json(response.data);
        })
        .catch((e) => {
          console.log(e);
          res.status(500).json(e.message);
        });
      break;
    case "scifi":
      axios
        .get(requests.fetchSciFiMovies + `&page=${page}`)
        .then((response) => {
          res.status(200).json(response.data);
        })
        .catch((e) => {
          console.log(e);
          res.status(500).json(e.message);
        });
      break;
    case "tvMovie":
      axios
        .get(requests.fetchTVMovies + `&page=${page}`)
        .then((response) => {
          res.status(200).json(response.data);
        })
        .catch((e) => {
          console.log(e);
          res.status(500).json(e.message);
        });
      break;
    case "thiller":
      axios
        .get(requests.fetchThrillerMovies + `&page=${page}`)
        .then((response) => {
          res.status(200).json(response.data);
        })
        .catch((e) => {
          console.log(e);
          res.status(500).json(e.message);
        });
      break;
    case "war":
      axios
        .get(requests.fetchWarMovies + `&page=${page}`)
        .then((response) => {
          res.status(200).json(response.data);
        })
        .catch((e) => {
          console.log(e);
          res.status(500).json(e.message);
        });
      break;
    default:
      console.log(type);
  }
});

app.get("/api/v1/movie/details/:movieId", (req, res) => {
  const id = req.params.movieId;
  let results = {};
  axios
    .get(
      `/movie/${id}?api_key=${process.env.API_KEY}&language=en-US&append_to_response=videos,credits`
    )
    .then((response) => {
      results = { ...response.data };
      res.status(200).json(results);
    })
    .catch((e) => {
      console.log(e);
      res.status(500).json(e.message);
    });
});
//....................................................................................

app.post("/api/v1/home/signup", signup);
app.post("/api/v1/home/login", login);
app.get("/api/v1/home/user/:id", mashDBAuth, getUserDetails);
app.put("/api/v1/home/user/follow", mashDBAuth, followUser);
app.put("/api/v1/home/user/unfollow", mashDBAuth, unfollowUser);
app.put("/api/v1/home/user/notification", mashDBAuth, markNotificationRead);
//.......................................................................
app.get("/api/v1/home/getSubPost", mashDBAuth, getSubscribedPost);
app.post("/api/v1/home/post", mashDBAuth, postOnePosts);
app.put("/api/v1/home/like-post", mashDBAuth, likePost);
app.put("/api/v1/home/unlike-post", mashDBAuth, unlikePost);
app.delete("/api/v1/home/delete-post/:postId", mashDBAuth, deletePost);
app.get("/api/v1/home/getSubPost", mashDBAuth, getSubscribedPost);
app.get("/api/v1/home/myPost", mashDBAuth, getMyPost);
//...........................................................................................
const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`the server is started at port ${port}`);
});
