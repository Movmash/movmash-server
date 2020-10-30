const Room = require("../models/roomModel");
const Conversation = require("../models/conversationModel");
exports.getAllUserRooms = (req, res) => {
  Room.find({ participants: req.user._id })
    .populate("participants", "profileImageUrl userName fullName")
    .then((data) => {
      // console.log(data);
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
