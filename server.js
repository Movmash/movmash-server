const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();
// const requests = require("./requests.js");
// const axios = require("./axios.js");
const {
  signup,
  login,
  getUserDetails,
  followUser,
  unfollowUser,
  getFollowersDetails,
  getFollowingsDetails,
  updateUserDetails,
  getUser,
} = require("./routes/userRoutes.js");
const mashDBAuth = require("./util/mashDBAuth.js");
const {
  postOnePosts,
  likePost,
  unlikePost,
  deletePost,
  getSubscribedPost,
  getMyPost,
  postComment,
  deleteComment,
  likeComment,
  unlikeComment,
  getPostComments,
} = require("./routes/postRoutes.js");
const {
  markNotificationRead,
  getAllNotifications,
} = require("./routes/notificationRoutes.js");
const {
  likeMovie,
  dislikeMovie,
  undoLikeMovie,
  undoDislikeMovie,
  searchMovie,
  upcomingCovers,
  movieLists,
  getMovieDetail,
} = require("./routes/movieRoutes.js");
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
  require("./triggers/triggers");
});

//....................................................................................
app.get("/api/v1/movie/search-movie", searchMovie);

app.get("/api/v1/movie/upcoming-cover", upcomingCovers);

app.get("/api/v1/movie/genre/:genreName/:pageNumber", movieLists);

app.get("/api/v1/movie/details/:movieId", getMovieDetail);
//....................................................................................

app.post("/api/v1/home/signup", signup);
app.post("/api/v1/home/login", login);
app.get("/api/v1/home/user/:id", mashDBAuth, getUserDetails);
app.put("/api/v1/home/user/follow", mashDBAuth, followUser);
app.put("/api/v1/home/user/unfollow", mashDBAuth, unfollowUser);
app.get("/api/v1/home/get-followers", mashDBAuth, getFollowersDetails);
app.get("/api/v1/home/get-followings", mashDBAuth, getFollowingsDetails);
app.put("/api/v1/home/update-user-details", mashDBAuth, updateUserDetails);
app.get("/api/v1/home/get-user", mashDBAuth, getUser);
//...........................................................................................
app.get("/api/v1/home/get-notification", mashDBAuth, getAllNotifications);
app.put(
  "/api/v1/home/user/read-notification",
  mashDBAuth,
  markNotificationRead
);
//.......................................................................
app.get("/api/v1/home/getSubPost", mashDBAuth, getSubscribedPost);
app.post("/api/v1/home/post", mashDBAuth, postOnePosts);
app.put("/api/v1/home/like-post", mashDBAuth, likePost);
app.put("/api/v1/home/unlike-post", mashDBAuth, unlikePost);
app.delete("/api/v1/home/delete-post/:postId", mashDBAuth, deletePost);
// app.get("/api/v1/home/getSubPost", mashDBAuth, getSubscribedPost);
app.get("/api/v1/home/myPost", mashDBAuth, getMyPost);
app.post("/api/v1/home/comment-post", mashDBAuth, postComment);
app.delete("/api/v1/home/delete-comment/:commentId", mashDBAuth, deleteComment);
app.put("/api/v1/home/like-comment", mashDBAuth, likeComment);
app.put("/api/v1/home/unlike-comment", mashDBAuth, unlikeComment);
app.get("/api/v1/home/get-post-comment", mashDBAuth, getPostComments);
//...........................................................................................

app.post("/api/v1/movie/like-movie", mashDBAuth, likeMovie);
app.post("/api/v1/movie/dislike-movie", mashDBAuth, dislikeMovie);
app.post("/api/v1/movie/undo-like-movie", mashDBAuth, undoLikeMovie);
app.post("/api/v1/movie/undo-dislike-movie", mashDBAuth, undoDislikeMovie);
const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`the server is started at port ${port}`);
});

// const posts = db.collection("posts");
// const changeStream = posts.watch();

// changeStream.on("change", (change) => {
//   if (change.operationType === "update") {
//     // console.log(change);
//     const updatedDocumentId = change.documentKey._id;
//     if ("likeCount" in change.updateDescription.updatedFields) {
//       // trigger on like the post led to create a new notification
//       // console.log(
//       //   typeof change.updateDescription.updatedFields.likes === "undefined"
//       // );
//       console.log(
//         typeof change.updateDescription.updatedFields.likes === "undefined"
//       );
//       if (
//         typeof change.updateDescription.updatedFields.likes === "undefined"
//       ) {
//         console.log("liked");
//         Post.findById(updatedDocumentId)
//           .then((doc) => {
//             //if user not like its own post
//             if (!doc.likes.includes(doc.postedBy)) {
//               const newNotification = {
//                 type: "like",
//                 senderId:
//                   change.updateDescription.updatedFields[
//                     Object.keys(change.updateDescription.updatedFields)[1]
//                   ],
//                 postId: updatedDocumentId,
//                 recipientId: doc.postedBy,
//               };
//               Notification.create(newNotification)
//                 .then((doc) => {
//                   console.log(doc);
//                 })
//                 .catch((e) => {
//                   console.log(e);
//                 });
//             }
//             // console.log(doc);
//           })
//           .catch((e) => {
//             console.log(e);
//           });
//       }
//       // trigger on unlike the post let to delete the notification
//       else {
//         if ("likes" in change.updateDescription.updatedFields) {
//           console.log("unlike");
//           const likeUserId = change.updateDescription.updatedFields.likes;
//           console.log(likeUserId);
//           Notification.deleteMany(
//             { type: "like", senderId: { $nin: likeUserId } },
//             (err) => {
//               if (err) console.log(err);
//             }
//           );
//         }

//         // db.collection("notifications")
//         // console.log(
//         //   change.updateDescription.updatedFields[
//         //     Object.keys(change.updateDescription.updatedFields)[1]
//         //   ]
//         // );
//         // console.log(typeof change.updateDescription.updatedFields.likes);
//         // console.log(change);
//         //         }
//       }
//     }

//     // console.log(
//     // change.updateDescription.updatedFields[
//     //   Object.keys(change.updateDescription.updatedFields)[1]
//     // ]
//     // );
//     // Post.findById(change.documentKey._id).then((doc) => console.log(doc));
//   }
// });
// const users = db.collection("users");
// const changeStreamForFollowing = users.watch();
// changeStreamForFollowing.on("change", (change) => {
//   // console.log(typeof change.updateDescription.updatedFields.followers);
//   if (change.operationType === "update") {
//     if ("followersCount" in change.updateDescription.updatedFields) {
//       if (
//         typeof change.updateDescription.updatedFields.followers ===
//         "undefined"
//       ) {
//         console.log("follow");
//         // console.log(
//         //   change.updateDescription.updatedFields[
//         //     Object.keys(change.updateDescription.updatedFields)[0]
//         //   ]
//         // );
//         const newFollowNotification = {
//           type: "following",
//           recipientId: change.documentKey._id,
//           senderId:
//             change.updateDescription.updatedFields[
//               Object.keys(change.updateDescription.updatedFields)[0]
//             ],
//         };
//         Notification.create(newFollowNotification)
//           .then((doc) => {
//             console.log(doc);
//           })
//           .catch((e) => {
//             console.log(e);
//           });
//       } else {
//         console.log("unfollow");
//         console.log(change);
//         const followerUserId =
//           change.updateDescription.updatedFields.followers;
//         Notification.deleteMany(
//           { type: "following", senderId: { $nin: followerUserId } },
//           (err) => {
//             if (err) console.log(err);
//           }
//         );
//       }
//     }
//   }
// });
