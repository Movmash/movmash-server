// const http = require("http");
// const express = require("express");
// const app = express();
// const server = http.createServer(app);
// const socketio = require("socket.io");
// const io = socketio(server);
const Room = require("../models/roomModel");
const Conversation = require("../models/conversationModel");
exports.getAllUserRooms = (req, res) => {
  Room.find({ participants: req.user._id })
    .populate("participants", "profileImageUrl userName fullName")
    .sort("-updatedAt")
    .then((data) => {
      // console.log(data);
      return res.status(200).json(data);
    })
    .catch((e) => {
      console.log(e);
    });
};
exports.markChatRoomRead = (req, res) => {
  Room.findByIdAndUpdate(req.body.roomId, { "lastMessage.read": true })
    .then((doc) => {
      return res.status(201).json({ msg: "mark as read" });
    })
    .catch((e) => {
      console.log(e);
      return res.status(500);
    });
};
exports.getUnreadRooms = (req, res) => {
  Room.find({
    "lastMessage.read": false,
    "lastMessage.recipient": req.user._id,
  })
    .populate("participants", "profileImageUrl userName fullName")
    .sort("-updatedAt")
    .then((data) => {
      console.log(data);
      return res.status(200).json(data);
    })
    .catch((e) => {
      console.log(e);
    });
};

exports.getRoomsMessages = (req, res) => {
  Conversation.find({ roomId: req.params.roomId })
    .populate("sender", "userName profileImageUrl fullName")
    .populate("recipient", "userName profileImageUrl fullName")
    .then((doc) => {
      return res.status(200).json(doc);
    })
    .catch((e) => {
      console.log(e);
      return res.status(500).json(e);
    });
};

exports.createChatRoom = (req, res) => {
  const io = req.app.get("socketio");
  Room.findOne({
    $and: [{ participants: req.body.userId }, { participants: req.user._id }],
  })
    .populate("participants", "profileImageUrl userName fullName")
    .then((doc) => {
      console.log(doc);
      if (!doc) {
        const newRoom = {
          participants: [req.body.userId, req.user._id],
          lastMessage: {},
        };
        Room.create(newRoom)
          .then((room) => {
            Room.findById(room._id)
              .populate("participants", "profileImageUrl userName fullName")
              .then((fullroomdata) => {
                // const firstConversation = {
                //   sender: req.user._id,
                //   recipient: req.body.userId,
                //   //  message: "shared a post",
                //   //  type: req.body.type,
                //   //  postData: req.body.postData,
                //   read: false,
                //   roomId: room._id,
                // };
                let firstConversation;
                if (req.body.type === "movie") {
                  firstConversation = {
                    sender: req.user._id,
                    recipient: req.body.userId,
                    message: "suggested a movie",
                    type: req.body.type,
                    movieData: req.body.movieData,
                    read: false,
                    roomId: room._id,
                  };
                } else if (req.body.type === "review") {
                  firstConversation = {
                    sender: req.user._id,
                    recipient: req.body.userId,
                    message: "shared a post",
                    type: req.body.type,
                    postData: req.body.postData,
                    read: false,
                    roomId: room._id,
                  };
                } else if (req.body.type === "suggestMe") {
                  firstConversation = {
                    sender: req.user._id,
                    recipient: req.body.userId,
                    message: "shared a post",
                    type: req.body.type,
                    postData: req.body.postData,
                    read: false,
                    roomId: room._id,
                  };
                } else {
                  firstConversation = {
                    sender: req.user._id,
                    recipient: req.body.userId,
                    //  message: "shared a post",
                    //  type: req.body.type,
                    //  postData: req.body.postData,
                    read: false,
                    roomId: room._id,
                  };
                }
                console.log(req.body.type);
                Conversation.create(firstConversation)
                  .then((chat) => {
                    Room.findByIdAndUpdate(
                      room._id,
                      { lastMessage: chat },
                      { new: true }
                    )
                      .populate(
                        "participants",
                        "profileImageUrl userName fullName"
                      )
                      .then((newRoomData) => {
                        if (req.body.type) {
                          io.to(req.body.userId).emit(
                            "message-room",
                            newRoomData
                          );
                        }

                        return res.status(201).json(fullroomdata);
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
              });
          })
          .catch((e) => {
            console.log(e);
          });
      } else {
        // if (req.body.type) {
        let firstConversation = {};
        if (req.body.type === "movie") {
          firstConversation = {
            sender: req.user._id,
            recipient: req.body.userId,
            message: "suggested a movie",
            type: req.body.type,
            movieData: req.body.movieData,
            read: false,
            roomId: doc._id,
          };
        } else if (req.body.type === "review") {
          firstConversation = {
            sender: req.user._id,
            recipient: req.body.userId,
            message: "shared a post",
            type: req.body.type,
            postData: req.body.postData,
            read: false,
            roomId: doc._id,
          };
          console.log(req.body.postData);
        } else if (req.body.type === "suggestMe") {
          firstConversation = {
            sender: req.user._id,
            recipient: req.body.userId,
            message: "shared a post",
            type: req.body.type,
            postData: req.body.postData,
            read: false,
            roomId: doc._id,
          };
        } else {
          firstConversation = {
            sender: req.user._id,
            recipient: req.body.userId,
            //  message: "shared a post",
            //  type: req.body.type,
            //  postData: req.body.postData,
            read: false,
            roomId: doc._id,
          };
        }
        Conversation.create(firstConversation)
          .then((chat) => {
            Conversation.findById(chat._id)
              .populate("sender", "userName profileImageUrl fullName")
              .populate("recipient", "userName profileImageUrl fullName")
              .then((chatdata) => {
                Room.findByIdAndUpdate(
                  doc._id,
                  { lastMessage: chat },
                  { new: true }
                )
                  .populate("participants", "profileImageUrl userName fullName")
                  .then((data) => {
                    io.to(req.body.userId).emit("message-room", data);
                    return io.to(req.body.userId).emit("message", [chatdata]);
                  })
                  .catch((e) => {
                    console.log(e);
                  });
              })
              .catch((e) => {
                console.log(e);
              });

            return res.status(201).json(doc);
          })
          .catch((e) => {
            console.log(e);
          });
        // })
        // .catch((e) => {
        //   console.log(e);
        // });
        // } else {
        //   return res.status(200).json(doc);
        // }
      }
    })
    .catch((e) => {
      console.log(e);
      return res.status(500).json(e);
    });
};
