const LiveShow = require("../models/liveShowModel");

exports.getLiveShowDetails = (req, res) => {
  LiveShow.findOne({ roomCode: req.params.roomCode })
    .then((data) => {
      return res.status(200).json(data);
    })
    .catch((e) => {
      return res.status(500).json(e);
    });
};

exports.createLiveShow = (req, res) => {
  const liveShowDetail = {
    host: req.user._id,
    description: req.body.description,
    roomCode: req.body.roomCode,
    posterUrl: req.body.posterUrl,
    privacy: req.body.privacy,
    roomTitle: req.body.roomTitle,
  };
  LiveShow.create(liveShowDetail)
    .then((data) => {
      return res.status(201).json(data);
    })
    .catch((e) => {
      return res.status(500).json(e);
    });
};
