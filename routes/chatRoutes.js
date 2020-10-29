const Room = require("../models/roomModel");

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
