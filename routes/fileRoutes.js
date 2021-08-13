const {uploadCoverPicture, uploadProfilePicture, s3} = require("../services/imageUpload");
const User = require("../models/userModel");
const singleProfileUpload = uploadProfilePicture.single("image");
const singleCoverUpload = uploadCoverPicture.single("image");
exports.profileImageUpload = (req,res) => {

    singleProfileUpload(req, res, (e) => {
        User.findByIdAndUpdate(req.user._id, {
          profileImageUrl: req.file.location,
        },{new:true}).then(data => {
          return res.status(201).json({'imageUrl': req.file.location});
        }).catch(e => {
          return res.status(422).json(e)
        });
        
    })

}

exports.coverImageUpload = (req,res) => {

    singleCoverUpload(req, res, (e) => {
      console.log(e);
       User.findByIdAndUpdate(
         req.user._id,
         {
           coverImageUrl: req.file.location,
         },
         { new: true }
       )
         .then((data) => {
           return res.status(201).json({ imageUrl: req.file.location });
         })
         .catch((e) => {
           return res.status(422).json(e);
         });
    });

}

exports.deleteProfileImage = (req,res) => {
s3.deleteObject(
  {
    Bucket: process.env.AWS_MASH_BUCKET,
    Key: "CoverPicture/1623327493965-Ankur.png",
  },
  (err, data) => {
    console.log(data);
  }
);
}

exports.deleteCoverImage = (req, res) => {
  s3.deleteObject(
    {
      Bucket: process.env.AWS_MASH_BUCKET,
      Key: "CoverPicture/1623327493965-Ankur.png",
    },
    (err, data) => {
      console.log(data);
    }
  );
};