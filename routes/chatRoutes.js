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
