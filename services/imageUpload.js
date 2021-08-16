const aws = require("aws-sdk");
const multer = require("multer");
const multerS3 = require("multer-s3");

aws.config.update({
  secretAccessKey: process.env.AWS_SECRETE_ACCESS_KEY,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  region: process.env.AWS_REGION,
});

const s3 = new aws.S3();

const uploadProfilePicture = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.AWS_MASH_BUCKET,
    // acl: "public-read",
    metadata: function (req, file, cb) {
      // console.log(file)
      cb(null, { fieldName: "Testing Meta data" });
    },
    key: function (req, file, cb) {
      const newFileName =
        `${req.user._id}/ProfilePicture/` +
        Date.now() +
        "-" +
        file.originalname;
      cb(null, newFileName);
    },
  }),
});

const uploadCoverPicture = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.AWS_MASH_BUCKET,
    // acl: "public-read",
    metadata: function (req, file, cb) {
      // console.log(file);
      cb(null, { fieldName: "Testing Meta data" });
    },
    key: function (req, file, cb) {
      const newFileName =
        `${req.user._id}/CoverPicture/` +
        Date.now() +
        "-" +
        file.originalname;
      cb(null, newFileName);
    },
  }),
});


module.exports = { uploadProfilePicture, uploadCoverPicture, s3 };