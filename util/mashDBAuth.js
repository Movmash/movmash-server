const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

module.exports = mashDBAuth = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(403).json({ error: "Unauthorized" });
  }
  const token = authorization.replace("Bearer ", "");
  var secret = Buffer.from("myClientSecret", "base64");
  jwt.verify(token, secret, (err, decodedToken) => {
    if (!err) {
      const { _id } = decodedToken;
      User.findById(_id)
        .select("-password")
        .then((userData) => {
          req.user = userData;
          return next();
        });
      // req.user = decodedToken.user;
      // User.findOne({ email: req.user.email })
      //   .then((doc) => {
      //     req.user.userName = doc.userName;
      //     //......more to add
      //     //......
      //     //......
      //     //.....
      //     //.....

      //     return next();
      //   })
      //   .catch((e) => {
      //     return res.status(500).json({ e });
      //   });
    } else {
      console.log("w " + err);
      return res.status(403).json(err);
    }
  });
  // let idToken;
  // if (
  //   req.headers.authorization &&
  //   req.headers.authorization.startsWith("Bearer ")
  // ) {
  //   idToken = req.headers.authorization.split("Bearer ")[1];
  // } else {
  //   console.log("no token found");
  //   return res.status(403).json({ error: "Unauthorized" });
  // }
  // var secret = Buffer.from("myClientSecret", "base64");

  // jwt.verify(idToken, secret, (err, decodedToken) => {
  //   if (!err) {
  //     req.user = decodedToken.user;
  //     User.findOne({ email: req.user.email })
  //       .then((doc) => {
  //         req.user.userName = doc.userName;
  //         //......more to add
  //         //......
  //         //......
  //         //.....
  //         //.....

  //         return next();
  //       })
  //       .catch((e) => {
  //         return res.status(500).json({ e });
  //       });
  //   } else {
  //     console.log("w " + err);
  //     return res.status(403).json(err);
  //   }
  // });
};
