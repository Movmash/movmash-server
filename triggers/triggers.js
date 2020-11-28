// const Notification = require("../models/notificationModel");
// const Post = require("../models/postModel");
// const User = require("../models/userModel");
// const Comment = require("../models/commentModel");
// const mongoose = require("mongoose");
// const db = mongoose.connection;

// const posts = db.collection("posts");
// const changeStreamForPostLikes = posts.watch();
// changeStreamForPostLikes.on("change", (change) => {
//   if (change.operationType === "update") {
//     // console.log(change);
//     const updatedDocumentId = change.documentKey._id;

//     if ("commentCount" in change.updateDescription.updatedFields) return;

//     if (Object.keys(change.updateDescription.updatedFields).length > 2) {
//       // trigger on like the post led to create a new notification
//       // console.log(
//       //   typeof change.updateDescription.updatedFields.likes === "undefined"
//       // );
//       // console.log(
//       //   typeof change.updateDescription.updatedFields.likes === "undefined"
//       // );
//       if (
//         typeof change.updateDescription.updatedFields.likes === "undefined" ||
//         change.updateDescription.updatedFields.likes.length === 1
//       ) {
//         console.log("liked");
//         if (
//           typeof change.updateDescription.updatedFields.likes !== "undefined"
//         ) {
//           Post.findById(updatedDocumentId)
//             .then((doc) => {
//               //if user not like its own post
//               // console.log(doc);
//               // console.log("change 1", change);
//               // console.log(change.updateDescription.updatedFields.likes);
//               if (
//                 doc.postedBy !==
//                 change.updateDescription.updatedFields[
//                   Object.keys(change.updateDescription.updatedFields)[1]
//                 ]
//               ) {
//                 console.log(
//                   "change 1",
//                   change.updateDescription.updatedFields.likes
//                 );
//                 const newLikeOfPostNotification = {
//                   type: "like",
//                   senderId:
//                     change.updateDescription.updatedFields[
//                       Object.keys(change.updateDescription.updatedFields)[1]
//                     ],
//                   postId: updatedDocumentId,
//                   recipientId: doc.postedBy,
//                 };
//                 Notification.create(newLikeOfPostNotification)
//                   .then((doc) => {
//                     console.log(doc);
//                   })
//                   .catch((e) => {
//                     console.log(e);
//                   });
//               }
//               // console.log(doc);
//             })
//             .catch((e) => {
//               console.log(e);
//             });
//         } else {
//           Post.findById(updatedDocumentId)
//             .then((doc) => {
//               //if user not like its own post
//               console.log(
//                 "change 1",
//                 change.updateDescription.updatedFields[
//                   Object.keys(change.updateDescription.updatedFields)[1]
//                 ]
//               );
//               // if (!doc.likes.includes(doc.postedBy)) {
//               if (
//                 doc.postedBy !==
//                 change.updateDescription.updatedFields[
//                   Object.keys(change.updateDescription.updatedFields)[1]
//                 ]
//               ) {
//                 const newLikeOfPostNotification = {
//                   type: "like",
//                   senderId:
//                     change.updateDescription.updatedFields[
//                       Object.keys(change.updateDescription.updatedFields)[1]
//                     ],
//                   postId: updatedDocumentId,
//                   recipientId: doc.postedBy,
//                 };
//                 Notification.create(newLikeOfPostNotification)
//                   .then((doc) => {
//                     console.log(doc);
//                   })
//                   .catch((e) => {
//                     console.log(e);
//                   });
//               }
//               // console.log(doc);
//             })
//             .catch((e) => {
//               console.log(e);
//             });
//         }
//       }
//       // trigger on unlike the post let to delete the notification
//       else {
//         console.log("unliked");
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
//         typeof change.updateDescription.updatedFields.followers === "undefined"
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
//         const followerUserId = change.updateDescription.updatedFields.followers;
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

// const comments = db.collection("comments");
// const changeStreamForComments = comments.watch();

// changeStreamForComments.on("change", (change) => {
//   // console.log(change);
//   if (change.operationType === "insert") {
//     Post.findById(change.fullDocument.postId)
//       .then((doc) => {
//         if (
//           doc.postedBy.toString() !== change.fullDocument.commentedBy.toString()
//         ) {
//           const newCommentNotification = {
//             type: "comment",
//             senderId: change.fullDocument.commentedBy,
//             postId: change.fullDocument.postId,
//             recipientId: doc.postedBy,
//             commentId: change.fullDocument._id,
//           };
//           Notification.create(newCommentNotification)
//             .then((newNotification) => {
//               console.log(newNotification);
//             })
//             .catch((e) => {
//               console.log(e);
//             });
//         }
//       })
//       .catch((e) => {
//         console.log(e);
//       });
//   } else if (change.operationType === "delete") {
//     Notification.findOneAndDelete({
//       commentId: change.documentKey._id,
//       type: "comment",
//     }).exec((err, result) => {
//       if (err) console.log(err);
//       console.log(result);
//     });
//   }
//   if (change.operationType === "update") {
//     if (Object.keys(change.updateDescription.updatedFields).length > 2) {
//       if (
//         typeof change.updateDescription.updatedFields.likes === "undefined" ||
//         change.updateDescription.updatedFields.likes.length === 1
//       ) {
//         // console.log(
//         //   typeof change.updateDescription.updatedFields.likes !== "undefined"
//         // );
//         if (
//           typeof change.updateDescription.updatedFields.likes !== "undefined"
//         ) {
//           // console.log("heoll");
//           Comment.findById(change.documentKey._id)
//             .then((comment) => {
//               if (
//                 comment.commentedBy.toString() !==
//                 change.updateDescription.updatedFields[
//                   Object.keys(change.updateDescription.updatedFields)[1]
//                 ].toString()
//               ) {
//                 // console.log("heoll");
//                 const newLikeOfCommentNotification = {
//                   type: "comment like",
//                   senderId: change.updateDescription.updatedFields.likes[0],
//                   postId: comment.postId,
//                   recipientId: comment.commentedBy,
//                   commentId: change.documentKey._id,
//                 };
//                 Notification.create(newLikeOfCommentNotification)
//                   .then((doc) => {
//                     // console.log("1");
//                     console.log(doc);
//                   })
//                   .catch((e) => {
//                     console.log(e);
//                   });
//               }
//             })
//             .catch((e) => {
//               console.log(e);
//             });
//         } else {
//           console.log("heoll");
//           Comment.findById(change.documentKey._id)
//             .then((comment) => {
//               if (
//                 comment.commentedBy.toString() !==
//                 change.updateDescription.updatedFields[
//                   Object.keys(change.updateDescription.updatedFields)[1]
//                 ].toString()
//               ) {
//                 console.log("heoll");
//                 console.log("heolasdasdal");
//                 const newLikeOfCommentNotification = {
//                   type: "comment like",
//                   senderId:
//                     change.updateDescription.updatedFields[
//                       Object.keys(change.updateDescription.updatedFields)[1]
//                     ],
//                   postId: comment.postId,
//                   recipientId: comment.commentedBy,
//                   commentId: change.documentKey._id,
//                 };
//                 Notification.create(newLikeOfCommentNotification)
//                   .then((doc) => {
//                     console.log("2");
//                     console.log(doc);
//                   })
//                   .catch((e) => {
//                     console.log(e);
//                   });
//               }
//             })
//             .catch((e) => {
//               console.log(e);
//             });
//         }
//         console.log("liked");
//       } else {
//         console.log(change, 1);
//         if ("likes" in change.updateDescription.updatedFields) {
//           const likeUserId = change.updateDescription.updatedFields.likes;
//           Notification.deleteMany(
//             { type: "comment like", senderId: { $nin: likeUserId } },
//             (err) => {
//               if (err) console.log(err);
//             }
//           );
//         }
//         console.log("dislike");
//       }
//     }
//   }
// });

// // if ("likeCount" in change.updateDescription.updatedFields) {
// //       // trigger on like the post led to create a new notification
// //       // console.log(
// //       //   typeof change.updateDescription.updatedFields.likes === "undefined"
// //       // );
// //       // console.log(
// //       //   typeof change.updateDescription.updatedFields.likes === "undefined"
// //       // );
// //       if (typeof change.updateDescription.updatedFields.likes === "undefined") {
// //         console.log("liked");
// //         Post.findById(updatedDocumentId)
// //           .then((doc) => {
// //             //if user not like its own post
// //             if (!doc.likes.includes(doc.postedBy)) {
// //               const newNotification = {
// //                 type: "like",
// //                 senderId:
// //                   change.updateDescription.updatedFields[
// //                     Object.keys(change.updateDescription.updatedFields)[1]
// //                   ],
// //                 postId: updatedDocumentId,
// //                 recipientId: doc.postedBy,
// //               };
// //               Notification.create(newNotification)
// //                 .then((doc) => {
// //                   console.log(doc);
// //                 })
// //                 .catch((e) => {
// //                   console.log(e);
// //                 });
// //             }
// //             // console.log(doc);
// //           })
// //           .catch((e) => {
// //             console.log(e);
// //           });
// //       }

//.......................................................................................

const Notification = require("../models/notificationModel");
const Post = require("../models/postModel");
const User = require("../models/userModel");
const Comment = require("../models/commentModel");
const Like = require("../models/likePostModel");
const mongoose = require("mongoose");
const db = mongoose.connection;

const likes = db.collection("likes");
const changeStreamForLikes = likes.watch();
changeStreamForLikes.on("change", (change) => {
  // console.log(change);
  if (change.operationType === "insert") {
    Post.findById(change.fullDocument.postId).then((postDoc) => {
      if (
        postDoc.postedBy.toString() !== change.fullDocument.likedBy.toString()
      ) {
        const newCommentNotification = {
          type: "like",
          senderId: change.fullDocument.likedBy,
          postId: change.fullDocument.postId,
          recipientId: postDoc.postedBy,
          likeId: change.fullDocument._id,
        };
        Notification.create(newCommentNotification)
          .then((doc) => {
            console.log(doc);
          })
          .catch((e) => {
            console.log(e);
          });
      }
    });
  } else if (change.operationType === "delete") {
    Notification.findOneAndDelete({
      likeId: change.documentKey._id,
      type: "like",
    }).exec((err, result) => {
      if (err) console.log(err);
      console.log(result);
    });
  }
});

const users = db.collection("users");
const changeStreamForFollowing = users.watch();
changeStreamForFollowing.on("change", (change) => {
  // console.log(typeof change.updateDescription.updatedFields.followers);
  if (change.operationType === "update") {
    if ("followersCount" in change.updateDescription.updatedFields) {
      if (
        typeof change.updateDescription.updatedFields.followers === "undefined"
      ) {
        console.log("follow");
        // console.log(
        //   change.updateDescription.updatedFields[
        //     Object.keys(change.updateDescription.updatedFields)[0]
        //   ]
        // );
        const newFollowNotification = {
          type: "following",
          recipientId: change.documentKey._id,
          senderId:
            change.updateDescription.updatedFields[
              Object.keys(change.updateDescription.updatedFields)[0]
            ],
        };
        Notification.create(newFollowNotification)
          .then((doc) => {
            console.log(doc);
          })
          .catch((e) => {
            console.log(e);
          });
      } else {
        console.log("unfollow");
        console.log(change);
        const followerUserId = change.updateDescription.updatedFields.followers;
        Notification.deleteMany(
          { type: "following", senderId: { $nin: followerUserId } },
          (err) => {
            if (err) console.log(err);
          }
        );
      }
    }
  }
});

const comments = db.collection("comments");
const changeStreamForComments = comments.watch();

changeStreamForComments.on("change", (change) => {
  // console.log(change);
  if (change.operationType === "insert") {
    Post.findById(change.fullDocument.postId)
      .then((doc) => {
        if (
          doc.postedBy.toString() !== change.fullDocument.commentedBy.toString()
        ) {
          const newCommentNotification = {
            type: "comment",
            senderId: change.fullDocument.commentedBy,
            postId: change.fullDocument.postId,
            recipientId: doc.postedBy,
            commentId: change.fullDocument._id,
          };
          Notification.create(newCommentNotification)
            .then((newNotification) => {
              console.log(newNotification);
            })
            .catch((e) => {
              console.log(e);
            });
        }
      })
      .catch((e) => {
        console.log(e);
      });
  } else if (change.operationType === "delete") {
    Notification.findOneAndDelete({
      commentId: change.documentKey._id,
      type: "comment",
    }).exec((err, result) => {
      if (err) console.log(err);
      console.log(result);
    });
  }
  if (change.operationType === "update") {
    if (Object.keys(change.updateDescription.updatedFields).length > 2) {
      if (
        typeof change.updateDescription.updatedFields.likes === "undefined" ||
        change.updateDescription.updatedFields.likes.length === 1
      ) {
        // console.log(
        //   typeof change.updateDescription.updatedFields.likes !== "undefined"
        // );
        if (
          typeof change.updateDescription.updatedFields.likes !== "undefined"
        ) {
          // console.log("heoll");
          Comment.findById(change.documentKey._id)
            .then((comment) => {
              if (
                comment.commentedBy.toString() !==
                change.updateDescription.updatedFields[
                  Object.keys(change.updateDescription.updatedFields)[1]
                ].toString()
              ) {
                // console.log("heoll");
                const newLikeOfCommentNotification = {
                  type: "comment like",
                  senderId: change.updateDescription.updatedFields.likes[0],
                  postId: comment.postId,
                  recipientId: comment.commentedBy,
                  commentId: change.documentKey._id,
                };
                Notification.create(newLikeOfCommentNotification)
                  .then((doc) => {
                    console.log("1");
                    console.log(doc);
                  })
                  .catch((e) => {
                    console.log(e);
                  });
              }
            })
            .catch((e) => {
              console.log(e);
            });
        } else {
          console.log("heoll");
          Comment.findById(change.documentKey._id)
            .then((comment) => {
              if (
                comment.commentedBy.toString() !==
                change.updateDescription.updatedFields[
                  Object.keys(change.updateDescription.updatedFields)[1]
                ].toString()
              ) {
                console.log("heoll");
                console.log("heolasdasdal");
                const newLikeOfCommentNotification = {
                  type: "comment like",
                  senderId:
                    change.updateDescription.updatedFields[
                      Object.keys(change.updateDescription.updatedFields)[1]
                    ],
                  postId: comment.postId,
                  recipientId: comment.commentedBy,
                  commentId: change.documentKey._id,
                };
                Notification.create(newLikeOfCommentNotification)
                  .then((doc) => {
                    console.log("2");
                    console.log(doc);
                  })
                  .catch((e) => {
                    console.log(e);
                  });
              }
            })
            .catch((e) => {
              console.log(e);
            });
        }
        console.log("liked");
      } else {
        console.log(change);
        if ("likes" in change.updateDescription.updatedFields) {
          const likeUserId = change.updateDescription.updatedFields.likes;
          Notification.deleteMany(
            { type: "comment like", senderId: { $nin: likeUserId } },
            (err) => {
              if (err) console.log(err);
            }
          );
        }
        console.log("dislike");
      }
    }
  }
});

// if ("likeCount" in change.updateDescription.updatedFields) {
//       // trigger on like the post led to create a new notification
//       // console.log(
//       //   typeof change.updateDescription.updatedFields.likes === "undefined"
//       // );
//       // console.log(
//       //   typeof change.updateDescription.updatedFields.likes === "undefined"
//       // );
//       if (typeof change.updateDescription.updatedFields.likes === "undefined") {
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

//.....................................

// const posts = db.collection("posts");
// const changeStreamForPostLikes = posts.watch();
// changeStreamForPostLikes.on("change", (change) => {
//   if (change.operationType === "update") {
//     // console.log(change);
//     const updatedDocumentId = change.documentKey._id;
//     // console.log(change);
//     if (Object.keys(change.updateDescription.updatedFields).length > 2) {
//       // trigger on like the post led to create a new notification
//       // console.log(
//       //   typeof change.updateDescription.updatedFields.likes === "undefined"
//       // );
//       // console.log(
//       //   typeof change.updateDescription.updatedFields.likes === "undefined"
//       // );
//       if ("commentCount" in change.updateDescription.updatedFields) return;
//       if (
//         typeof change.updateDescription.updatedFields.likes === "undefined" ||
//         change.updateDescription.updatedFields.likes.length === 1
//       ) {
//         // console.log("liked");//
//         if (
//           typeof change.updateDescription.updatedFields.likes !== "undefined"
//         ) {
//           console.log("1");
//           Post.findById(updatedDocumentId)
//             .then((doc) => {
//               //if user not like its own post
//               if (!doc.likes.includes(doc.postedBy)) {
//                 const newLikeOfPostNotification = {
//                   type: "like",
//                   senderId:
//                     change.updateDescription.updatedFields[
//                       Object.keys(change.updateDescription.updatedFields)[1]
//                     ],
//                   postId: updatedDocumentId,
//                   recipientId: doc.postedBy,
//                 };
//                 Notification.create(newLikeOfPostNotification)
//                   .then((doc) => {
//                     console.log(doc);
//                   })
//                   .catch((e) => {
//                     console.log(e);
//                   });
//               }
//               // console.log(doc);
//             })
//             .catch((e) => {
//               console.log(e);
//             });
//         } else {
//           console.log("2");
//           Post.findById(updatedDocumentId)
//             .then((doc) => {
//               //if user not like its own post
//               if (!doc.likes.includes(doc.postedBy)) {
//                 const newLikeOfPostNotification = {
//                   type: "like",
//                   senderId:
//                     change.updateDescription.updatedFields[
//                       Object.keys(change.updateDescription.updatedFields)[1]
//                     ],
//                   postId: updatedDocumentId,
//                   recipientId: doc.postedBy,
//                 };
//                 Notification.create(newLikeOfPostNotification)
//                   .then((doc) => {
//                     console.log(doc);
//                   })
//                   .catch((e) => {
//                     console.log(e);
//                   });
//               }
//               // console.log(doc);
//             })
//             .catch((e) => {
//               console.log(e);
//             });
//         }
//       }
//       // trigger on unlike the post let to delete the notification
//       else {
//         console.log("unliked");
//         if ("likes" in change.updateDescription.updatedFields) {
//           // console.log("unlike");//
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
