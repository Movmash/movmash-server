const http = require("http");
const express = require("express");
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUI = require("swagger-ui-express");
const {
  addUser,
  removeUser,
  getUserDetail,
  getUsersInRoom,
  getHostDetail,
  updateWatchSecond,
} = require("./util/userManagement");
const app = express();
const path = require("path");
// const cors = require("cors");
const xss = require("xss-clean");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const mongoose = require("mongoose");
const socketio = require("socket.io");
const server = http.createServer(app);
const io = socketio(server);
// const { ExpressPeerServer } = require("peer");
// const customGenerationFunction = () =>
//   (Math.random().toString(36) + "0000000000000000000").substr(2, 16);
// const peerServer = ExpressPeerServer(server, {
//   debug: true,
//   key: "peerjs",
//   path: "/",
//   generateClientId: customGenerationFunction,
// });
require("dotenv").config();
require("./OAuth/googleOAuth");
require("./OAuth/facebookOAuth");
const LiveShow = require("./models/liveShowModel");
const User = require("./models/userModel");
const Conversation = require("./models/conversationModel");
const Notification = require("./models/notificationModel");
const Room = require("./models/roomModel");
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
  getMashUserDetails,
  checkUsernameAvailability,
  getFollowingsDetailsProfile,
  getFollowersDetailsProfile,
  removeFollower,
  undoRemoveFollower,
} = require("./routes/userRoutes.js");
// const mashDBAuth = require("./util/mashDBAuth.js");
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
  getMashUserPost,
  sendBookingRequest,
  getRequestedTicket,
  cancelRequestedTicket,
  markRequestedTicketConfirmed,
  getPostDetails,
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
  checkMovieStatus,
  addToWatchlist,
  removeFromWatchlist,
  createNewList,
  getUserList,
  getMashUserList,
  deleteList,
  updateList,
  getUserWatchList,
  getMashUserWatchList,
  getUserLikeDislikeMovielist,
  getMashUserLikeDislikeMovielist,
} = require("./routes/movieRoutes.js");
const {
  postUserReview,
  movieRatedStatus,
} = require("./routes/reviewRoutes.js");
const {
  getAllUserRooms,
  getRoomsMessages,
  getUnreadRooms,
  markChatRoomRead,
  createChatRoom,
} = require("./routes/chatRoutes.js");
const {
  getLiveShowDetails,
  createLiveShow,
  getAllLiveShow,
  getGenreLiveShow,
  getFollowingsLiveShow,
} = require("./routes/liveShowRoutes");
const {
  getUserRecommendation,
  getExplorePosts,
} = require("./routes/exploreRoutes");
const {
  searchUser,
  searchTicket,
  searchList,
  getMovieList,
  getPeopleList,
  getTicket,
} = require("./routes/searchRoutes");
const chalk = require("chalk");
//.....................................[swagger option]...............................
const swaggerOption = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "Movmash API",
      version: "1.0.0",
      description:
        "Welcome to the Movmash API documentation. Please go through all the doc mention below.",
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },
  apis: ["./documentation/*"],
  servers: ["http://localhost:8000"],
};
const swaggerDocs = swaggerJsDoc(swaggerOption);
const cookieSession = require('cookie-session');
const passport = require("passport");
const { profileImageUpload, coverImageUpload, deleteProfileImage } = require("./routes/fileRoutes");
app.use(xss());
app.use(
  helmet({
    contentSecurityPolicy:
      process.env.NODE_ENV === "production" ? undefined : false,
  })
);
app.use(mongoSanitize());
app.use(
  cookieSession({
    maxAge: 30 * 24 * 60 * 60 * 1000,
    keys: [process.env.COOKIE_KEY]
  })
);
// app.use(cors({ credentials: true, origin: "http://localhost:3000" }));
app.use(passport.initialize());
app.use(passport.session());
app.use("/api-docs",swaggerUI.serve,swaggerUI.setup(swaggerDocs));
//....................................................................................
// app.use("/peerjs", peerServer);
// app.use(cors({ credentials: true, origin: "http://localhost:3000" }));

app.use(express.json());

//....................................................................................

const db = mongoose.connection;

//....................................................................................
app.get("/api/v1/movie/search-movie", searchMovie);

app.get("/api/v1/movie/upcoming-cover", upcomingCovers);

app.get("/api/v1/movie/genre/:genreName/:pageNumber", movieLists);

app.get("/api/v1/movie/details/:movieId", getMovieDetail);
//....................................................................................

app.post("/api/v1/home/signup", signup);
app.post("/api/v1/home/login", login);
app.get("/api/v1/home/user/:id", getUserDetails);
app.put("/api/v1/home/user/follow", followUser);
app.put("/api/v1/home/user/unfollow", unfollowUser);
app.get("/api/v1/home/get-followers", getFollowersDetails);
app.get("/api/v1/home/get-followings", getFollowingsDetails);
app.get("/api/v1/home/get-followers/:userId", getFollowersDetailsProfile);
app.get("/api/v1/home/get-followings/:userId", getFollowingsDetailsProfile);
app.put("/api/v1/home/update-user-details", updateUserDetails);
app.get("/api/v1/home/get-user", getUser);
app.post("/api/v1/home/remove-follower", removeFollower);
app.post("/api/v1/home/undo-remove-follower", undoRemoveFollower);
app.get(
  "/api/v1/home/mash-user-details/:userName",

  getMashUserDetails
);
//...........................................................................................
app.get("/api/v1/home/get-notification", getAllNotifications);
app.put(
  "/api/v1/home/user/read-notification",

  markNotificationRead
);
//.......................................................................
app.get("/api/v1/home/getSubPost", getSubscribedPost);
app.post("/api/v1/home/post",  postOnePosts);
app.put("/api/v1/home/like-post", likePost);
app.put("/api/v1/home/unlike-post", unlikePost);
app.delete("/api/v1/home/delete-post/:postId", deletePost);
// app.get("/api/v1/home/getSubPost", getSubscribedPost);
app.get("/api/v1/home/myPost", getMyPost);
app.post("/api/v1/home/comment-post", postComment);
app.delete("/api/v1/home/delete-comment/:commentId", deleteComment);
app.put("/api/v1/home/like-comment", likeComment);
app.put("/api/v1/home/unlike-comment", unlikeComment);
app.get("/api/v1/home/get-post-comment", getPostComments);
app.get("/api/v1/home/mash-user-post/:userName", getMashUserPost);
app.get("/api/v1/home/get-post-details/:postId", getPostDetails);
app.get("/api/v1/home/check-username-availability/:userName", checkUsernameAvailability);
//...........................................................................................
app.get(
  "/api/v1/movie/get-user-like-dislike-movielist",

  getUserLikeDislikeMovielist
);
app.get(
  "/api/v1/movie/get-mash-user-like-dislike-movielist/:userName",

  getMashUserLikeDislikeMovielist
);
app.post("/api/v1/movie/like-movie", likeMovie);
app.post("/api/v1/movie/dislike-movie", dislikeMovie);
app.post("/api/v1/movie/undo-like-movie", undoLikeMovie);
app.post("/api/v1/movie/undo-dislike-movie", undoDislikeMovie);
app.get("/api/v1/movie/movie-status/:id", checkMovieStatus);
//..
app.get("/api/v1/movie/get-user-list", getUserList);
app.get(
  "/api/v1/movie/get-mash-user-list/:userName",

  getMashUserList
);
//..
app.get("/api/v1/movie/get-user-watchList", getUserWatchList);
app.get(
  "/api/v1/movie/get-mash-user-watchlist/:userName",

  getMashUserWatchList
);
//...
app.put("/api/v1/movie/update-list", updateList);
app.delete("/api/v1/movie/delete-list/:listId", deleteList);
app.post("/api/v1/movie/create-new-list", createNewList);
app.post("/api/v1/movie/add-to-watchlist", addToWatchlist);
app.post(
  "/api/v1/movie/remove-from-watchlist",

  removeFromWatchlist
);
app.get(
  "/api/v1/movie/movie-rated-status/:movieId",

  movieRatedStatus
);
app.post("/api/v1/movie/post-user-review", postUserReview);
//....
app.post("/api/v1/home/create-chat-room", createChatRoom);
app.get("/api/v1/home/get-user-rooms", getAllUserRooms);
app.get("/api/v1/home/get-unread-rooms", getUnreadRooms);
app.get(
  "/api/v1/home/get-rooms-messages/:roomId",

  getRoomsMessages
);
app.put("/api/v1/home/mark-chatRoom-read", markChatRoomRead);
//..................

app.post("/api/v1/live/create-live-show", createLiveShow);

app.get(
  "/api/v1/live/get-live-show-details/:roomCode",

  getLiveShowDetails
);
app.get(
  "/api/v1/live/get-genre-live-show/:genre",

  getGenreLiveShow
);
app.get("/api/v1/live/get-all-live-show", getAllLiveShow);
app.get(
  "/api/v1/live/get-followings-live-show",

  getFollowingsLiveShow
);
//...

app.get(
  "/api/v1/explore/get-user-recommendation",

  getUserRecommendation
);
app.get("/api/v1/explore/get-explore-post", getExplorePosts);

//......
app.get("/api/v1/search-list", searchList);
app.get("/api/v1/search-user", searchUser);
app.get("/api/v1/search-ticket", searchTicket);
//.................................... [Explore] .............................................
app.get("/api/v1/search-get-list", getMovieList);
app.get("/api/v1/search-get-people", getPeopleList);
app.get("/api/v1/search-get-ticket",getTicket);
//............................................ ticket booking management .................
app.post(
  "/api/v1/bookingTicket/send-booking-request",

  sendBookingRequest
);
app.get(
  "/api/v1/bookingTicket/get-requested-ticket",

  getRequestedTicket
);
app.delete(
  "/api/v1/bookingTicket/cancel-requested-ticket/:postId",

  cancelRequestedTicket
);
app.put(
  "/api/v1/bookingTicket/mark-ticket-confirm",

  markRequestedTicketConfirmed
);
//.....................................[File Upload] ........................................
app.post("/api/v1/upload-image/profile", profileImageUpload);
app.post("/api/v1/upload-image/cover",coverImageUpload);
app.post("/api/v1/delete-image/cover", deleteProfileImage);
//.........................................................

//.................................... [web sockets] .........................................

db.once("open", () => {
  console.log(chalk.hex("#fab95b").bold("🚀 Change stream activated 📗"));
  require("./triggers/triggers");

  ///...................................
  const notification = db.collection("notifications");
  const changeStreamForNotification = notification.watch();
  changeStreamForNotification.on("change", (change) => {
    // console.log("heyyy");
    // console.log("change in server", change);
    if (change.operationType === "insert") {
      Notification.findById(change.fullDocument._id)
        .populate("senderId", "profileImageUrl userName fullName")
        .then((doc) => {
          return io
            .to(change.fullDocument.recipientId.toString())
            .emit("notification", doc);
        })
        .catch((e) => {
          console.log(e);
        });
    }
  });
});
const users = {};

const socketToRoom = {};
io.on("connection", (socket) => {
  // console.log(socket.handshake.query.id);
  socket.join(socket.handshake.query.id);

  // console.log("new connection have build");

  socket.on("sendMessage", (message) => {
    // console.log(message);
    try {
      let chat = new Conversation(message);

      chat.save((err, doc) => {
        if (err) return console.log(err);

        Conversation.find({ _id: doc._id })
          .populate("sender", "userName profileImageUrl fullName")
          .populate("recipient", "userName profileImageUrl fullName")
          .then((doc) => {
            Room.findByIdAndUpdate(
              message.roomId,
              { lastMessage: doc[0] },
              { new: true }
            )
              .populate("participants", "profileImageUrl userName fullName")
              .then((data) => {
                // console.log(message.roomId);
                io.to(message.sender)
                  .to(message.recipient)
                  .emit("message-room", data);
                return io
                  .to(message.sender)
                  .to(message.recipient)
                  .emit("message", doc);
              })
              .catch((e) => {
                console.log(e);
              });
          })
          .catch((e) => {
            console.log(e);
          });
      });
    } catch (error) {
      console.error(error);
    }
  });

  socket.on("get-user-in-the-room-for-room-info", (data) => {
    const userList = getUsersInRoom(data.roomId);
    // console.log(userList);
    io.emit("user-list-inside-the-room-for-room-info", userList);
  });
  socket.on(
    "join-party",
    ({ roomCode, userName, userId, fullName, profileImageUrl }) => {
      // console.log(roomCode, userName);
      LiveShow.findOneAndUpdate(
        { roomCode },
        { $inc: { memberNumber: 1 } },
        { new: true }
      )
        .then((data) => {
          // console.log(data, 1);
          if (data === null) {
            socket.emit("room-not-found");
            return;
          }
          const { user } = addUser({
            id: socket.id,
            room: roomCode,
            userName: userName,
            fullName: fullName,
            profileImageUrl:profileImageUrl,
            host: userId === data.host.toString(),
            watchSecond: 0,
            userId: userId
          });
          socket.join(user.room);
          socket.emit("party-message", {
            user: "admin",
            text: `welcome, ${user.fullName} !!!`,
            type: "greet",
          });
          socket.broadcast.to(user.room).emit("party-message", {
            user: "admin",
            text: `${user.fullName} has joined!`,
            type: "greet",
          });
          let host = null;
          if (userId === data.host.toString()) {
            host = socket.id;
            socket.emit("set-host");
            socket.broadcast.to(roomCode).emit("host-enter-in-room");
          } else {
            // can check if host is not available the emit something .....................................................................................................................
            // console.log(getHostDetail(roomCode));
            if (getHostDetail(roomCode) === undefined) {
              socket.emit("no-host-available");
            } else {
              host = getHostDetail(roomCode).id;
              // console.log(host);
            }
          }
          const userList = getUsersInRoom(roomCode);
          io.to(roomCode).emit("user-list-inside-the-room", userList);
          if (socket.id !== host) {
            // console.log("call the host " + host);
            setTimeout(() => {
              socket.broadcast.to(host).emit("get-data", { caller: socket.id });
            }, 2000);
          } else {
            // console.log("I am the host");
          }
        })
        .catch((e) => {
          console.log(e);
        });
    }
  );
  socket.on(
    "send-party-message",
    ({
      roomCode,
      userName,
      message,
      fullName,
      profileImageUrl,
    }) => {
      // console.log(socket.id);
      const user = getUserDetail(socket.id);

      io.to(user.room).emit("party-message", {
        user: user.userName,
        text: message,
        type: "user",
        fullName,
        profileImageUrl
      });
    }
  );

  socket.on("update-watch-second",({ watchSecond })=> {
    updateWatchSecond(socket.id, watchSecond);
  });

  //...........................................
  socket.on("play-video", (data) => {
    var roomnum = data.room;
    // console.log("1");

    socket.broadcast.to(roomnum).emit("play-video-client");
  });

  socket.on("play-other", (data) => {
    var roomnum = data.roomCode;
    // console.log("2");
    // console.log(roomnum);
    socket.broadcast.to(roomnum).emit("just-play");
  });
  socket.on("pause-other", (data) => {
    var roomnum = data.roomCode;
    // console.log("3");
    // console.log(roomnum);
    socket.broadcast.to(roomnum).emit("just-pause");
  });
  socket.on("seek-other", (data) => {
    var roomnum = data.roomCode;
    var currTime = data.time;
    // var state = data.state;
    // console.log("4");
    socket.broadcast.to(roomnum).emit("just-seek", {
      time: currTime,
      // state: state
    });
  });
  socket.on("sync-video", (data) => {
    var roomnum = data.roomCode;
    var currTime = data.time;
    var state = data.state;
    // console.log("4");
    socket.broadcast.to(roomnum).emit("sync-video-client", {
      time: currTime,
      state: state,
    });
  });
  //.........................
  socket.on("sync-the-host", (data) => {
    // console.log("hello");
    // console.log(data);
    socket.broadcast.to(data.caller).emit("sync-the-video-with-host", {
      time: data.time,
      state: data.state,
    });
  });
  socket.on("sync-the-host-button", (data) => {
    // console.log("hello");
    socket.broadcast.to(data.roomCode).emit("sync-the-video-with-host-button", {
      time: data.time,
      state: data.state,
    });
  });
  //........................
  socket.on("sync-host", (data) => {
    if (getHostDetail(data.roomCode) !== undefined) {
      // console.log("sync-host");
      // var host = io.sockets.adapter.rooms[socket.roomnum].host;
      let host = getHostDetail(data.roomCode).id;
      // console.log(host)
      if (socket.id !== host) {
        // console.log("is host");
        socket.broadcast.to(host).emit("get-data", { caller: socket.id });
      } else {
        // console.log("not host");
        socket.emit("sync-host-server");
      }
    }
  });
  socket.on("get-host-data", (data) => {
    if (getHostDetail(data.roomCode) !== undefined) {
      // var roomnum = data.room;
      // var host = io.sockets.adapter.rooms[roomnum].host;
      let host = getHostDetail(data.roomCode);
      if (data.currTime === undefined) {
        let caller = socket.id;
        socket.broadcast.to(host).emit("get-player-data", {
          room: data.roomCode,
          caller: caller,
        });
      } else {
        var caller = data.caller;

        socket.broadcast.to(caller).emit("compareHost", data);
      }
    }
  });
  socket.on("change host", (data) => {
    if (io.sockets.adapter.rooms[socket.roomnum] !== undefined) {
      var roomnum = data.room;
      var newHost = socket.id;
      var currHost = io.sockets.adapter.rooms[socket.roomnum].host;

      if (newHost !== currHost) {
        socket.broadcast.to(currHost).emit("unSetHost");

        io.sockets.adapter.rooms[socket.roomnum].host = newHost;

        socket.emit("set-host");

        // io.sockets.adapter.rooms[socket.roomnum].hostName = socket
      }
    }
  });
  //.....get user in the room ...........................
  // socket.on("join-video-chat-room", (roomCode, id) => {
  //   socket.join(roomCode);
  //   console.log(id, roomCode);
  //   io.to(roomCode).emit("user-connected-to-video-chat", id);
  // });
  socket.on("get-user-in-the-room", (data) => {
    const userList = getUsersInRoom(data.roomId);
    console.log(data);
    socket.emit("user-list-inside-the-room", userList);
  });
  socket.on("sending-signal", (payload) => {
    socket.broadcast.to(payload.userToSignal).emit("user-joined-video-chat", {
      signal: payload.signal,
      callerID: payload.callerID,
    });
    // console.log("sending singnal");
  });
  socket.on("returning-signal", (payload) => {
    socket.broadcast.to(payload.callerID).emit("receiving-returned-signal", {
      signal: payload.signal,
      id: socket.id,
    });
    // console.log("returning singnal");
  });
  //............//.....//....................

  socket.on("join room", (roomID) => {
    const userList = getUsersInRoom(roomID);
    // console.log(roomID);
    if (users[roomID]) {
      const length = users[roomID].length;
      if (length === 4) {
        socket.emit("room full");
        return;
      }
      users[roomID].push(socket.id);
    } else {
      users[roomID] = [socket.id];
    }
    // console.log(users);
    // console.log(userList);
    socketToRoom[socket.id] = roomID;
    // const usersInThisRoom = userList.filter((user) => user.id !== socket.id);

    const usersInThisRoom = users[roomID].filter((id) => id !== socket.id);
    // console.log(usersInThisRoom, 23);
    socket.emit("all users", usersInThisRoom);
  });

  socket.on("sending signal", (payload) => {
    // console.log("sending signal");
    io.to(payload.userToSignal).emit("user joined", {
      signal: payload.signal,
      callerID: payload.callerID,
    });
  });

  socket.on("returning signal", (payload) => {
    // console.log("returning signal");
    io.to(payload.callerID).emit("receiving returned signal", {
      signal: payload.signal,
      id: socket.id,
    });
  });

  socket.on(
    "change-room-video-source",
    ({ liveShowId, roomCode, videoUrl }) => {
      // console.log(payload);
      LiveShow.findByIdAndUpdate(liveShowId, { videoUrl }, { new: true })
        .then((newLiveShowData) => {
          io.to(roomCode).emit("new-room-video-source", newLiveShowData);
          // socket.broadcast
          //   .to(roomCode)
          //   .emit("new-room-video-source", newLiveShowData);
        })
        .catch((e) => {
          console.log(e);
        });
    }
  );

  socket.on("change-room-info", ({genre,privacy,roomTitle,description,liveShowId,roomCode})=> {
    LiveShow.findByIdAndUpdate(
      liveShowId,
      { genre, privacy, roomTitle, description },
      { new: true }
    )
      .then((newLiveShowData) => {
        io.to(roomCode).emit("new-room-info", newLiveShowData);
      })
      .catch((e) => {
        console.log(e);
      });
  });
  //.............//...........//..............
  //......................................................
  socket.on("leaving-party", () => {
    // console.log("leaving-party");
    const userDetail = getUserDetail(socket.id);

    if (userDetail !== undefined) {
      if (userDetail.host) {
        socket.broadcast.to(userDetail.room).emit("no-host-available");
      }
      // console.log(userDetail);
      User.findByIdAndUpdate(userDetail.userId, {
        $inc: { watchHour: userDetail.watchSecond},
      }, {new:true})
        .then((data) => {
          LiveShow.findOneAndUpdate(
            { roomCode: userDetail.room },
            { $inc: { memberNumber: -1 } },
            { new: true }
          )
            .then((data) => {
              const user = removeUser(socket.id);
              // console.log(data);
              if (users[userDetail.room]) {
                const indexVideo = users[userDetail.room].filter(
                  (u) => u === socket.id
                );
                if (indexVideo !== -1)
                  users[userDetail.room].splice(indexVideo, 1)[0];
              }

              if (user) {
                socket.broadcast.to(user.room).emit("party-message", {
                  user: "admin",
                  text: `${user.fullName} has left`,
                  type: "greet",
                });
                const userList = getUsersInRoom(user.room);
                // console.log(userList, "leaving");
                io.to(user.room).emit("user-list-inside-the-room", userList);
                io.to(user.room).emit("close-peer");
                // console.log("closePeer");
                socket.leave(user.room);
                // io.to(user.room).emit("party-message", {
                //   user: "admin",
                //   text: `${user.name} has left`,
                //   type: "greet",
                // });
              }
            })
            .catch((e) => {
              console.log(e);
            });
        })
        .catch((e) => {
          console.log(e);
        });
      
    }
  });
  //......................................

  //...........................................
  socket.on("disconnect", () => {
    // console.log("disconnected user");
    const userDetail = getUserDetail(socket.id);
    if (userDetail !== undefined) {
      if (userDetail.host) {
        socket.broadcast.to(userDetail.room).emit("no-host-available");
      }
      // console.log(userDetail);
      User.findByIdAndUpdate(userDetail.userId, {
       $inc: { watchHour: userDetail.watchSecond},
      }, {new:true})
        .then(() => {
          LiveShow.findOneAndUpdate(
            { roomCode: userDetail.room },
            { $inc: { memberNumber: -1 } },
            { new: true }
          )
            .then((data) => {
              const user = removeUser(socket.id);
              // console.log(data);
              if (users[userDetail.room]) {
                const indexVideo = users[userDetail.room].filter(
                  (u) => u === socket.id
                );
                if (indexVideo !== -1)
                  users[userDetail.room].splice(indexVideo, 1)[0];
              }
              if (user) {
                io.to(user.room).emit("party-message", {
                  user: "admin",
                  text: `${user.fullName} has left`,
                  type: "greet",
                });
                const userList = getUsersInRoom(user.room);
                io.to(user.room).emit("user-list-inside-the-room", userList);
                io.to(user.room).emit("close-peer");
                // console.log("closePeer");
                socket.leave(user.room);
              }
            })
            .catch((e) => {
              console.log(e);
            });
        })
        .catch((e) => {
          console.log(e);
        });
    }
  });
});
const port = process.env.PORT || 8000;
app.set("socketio", io);
//......................................[Server database connection].......................
mongoose
  .connect(process.env.DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    server.listen(port, () => {
      console.log(
        chalk.hex("#fab95b").bold(`🚀 Server ready at http://localhost:${port} 📗`)
      );
      console.log( chalk.hex("#fab95b").bold("🚀 MashDB is now connected 📗"));
    });
  })
  .catch((e) => console.log(e));
//...........................................................
require("./routes/authRoutes")(app);
app.use(express.static(path.join(__dirname, "build")));
//...............................................................................
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "build", "index.html"));
});
// app.use(authRoutes);
// app.get("/auth/google",googleAuth);
// app.get("/auth/google/callback", googleAuthCallback);