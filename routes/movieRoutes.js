const LikedMovie = require("../models/likedMovieModel");
const DislikedMovie = require("../models/dislikedMovieModel");
const Watchlist = require("../models/watchListModel");
const { genreConverter } = require("../util/genreConverter");
const UserGenrePreference = require("../models/userGenrePreferenceModel");
const User = require("../models/userModel");
const requests = require("../requests.js");
const axios = require("../axios.js");
const List = require("../models/listModel");
exports.createNewList = (req, res) => {
  const newList = {
    createdBy: req.user,
    movieList: req.body.movieList,
    listTitle: req.body.listTitle,
    description: req.body.description,
    privacy: req.body.privacy,
    tags: req.body.tags,
  };

  List.create(newList)
    .then((list) => {
      return res.status(201).json(list);
    })
    .catch((e) => {
      console.log(e);
      return res.status(500).json(e);
    });
};
exports.updateList = (req, res) => {
  const newList = {
    movieList: req.body.movieList,
    listTitle: req.body.listTitle,
    description: req.body.description,
    privacy: req.body.privacy,
    tags: req.body.tags,
  };
  List.findByIdAndUpdate(req.body.id, newList, { new: true })

    .then((doc) => {
      console.log(doc);
      List.findOne({ _id: doc._id })
        .populate("createdBy", "profileImageUrl userName fullname")
        .then((newDoc) => {
          return res.status(201).json(newDoc);
        })
        .catch((e) => {
          console.log(e);
          return res.status(500).json(e);
        });
    })
    .catch((e) => {
      console.log(e);
      return res.status(500).json(e);
    });
};
exports.getUserList = (req, res) => {
  List.find({ createdBy: req.user._id })
    .populate("createdBy", "userName profileImageUrl fullName")
    .sort("-createdAt")
    .then((list) => {
      return res.status(200).json(list);
    })
    .catch((e) => {
      console.log(e);
      return res.status(500).json(e);
    });
};

exports.getMashUserList = (req, res) => {
  User.findOne({ userName: req.params.userName })
    .then((user) => {
      List.find({ createdBy: user._id })
        .populate("createdBy", "userName profileImageUrl fullName")
        .sort("-createdAt")
        .then((list) => {
          return res.status(200).json(list);
        })
        .catch((e) => {
          console.log(e);
          return res.status(500).json(e);
        });
    })
    .catch((e) => {
      console.log(e);
    });
};

exports.deleteList = (req, res) => {
  List.findByIdAndDelete(req.params.listId)
    .then(() => {
      return res.status(201).json({ message: "deleted sucessfully" });
    })
    .catch((e) => {
      console.log(e);
    });
};

//..

exports.getUserLikeDislikeMovielist = (req, res) => {
  const result = {};
  LikedMovie.find({ likedBy: req.user._id })
    .sort("-createdAt")
    .then((liked) => {
      result["likedMovies"] = liked;
      DislikedMovie.find({ dislikedBy: req.user._id })
        .then((dislike) => {
          result["dislikedMovies"] = dislike;
          return res.status(200).json(result);
        })
        .catch((e) => {
          console.log(e);
          return res.status(500).json(e);
        });
    })
    .catch((e) => {
      console.log(e);
      return res.status(500).json(e);
    });
};
exports.getMashUserLikeDislikeMovielist = (req, res) => {
  User.findOne({ userName: req.params.userName })
    .sort("-createdAt")
    .then((user) => {
      const result = {};
      LikedMovie.find({ likedBy: user._id })
        .then((liked) => {
          result["likedMovies"] = liked;
          DislikedMovie.find({ dislikedBy: user._id })
            .then((dislike) => {
              result["dislikedMovies"] = dislike;
              return res.status(200).json(result);
            })
            .catch((e) => {
              console.log(e);
              return res.status(500).json(e);
            });
        })
        .catch((e) => {
          console.log(e);
          return res.status(500).json(e);
        });
    })
    .catch((e) => {
      console.log(e);
      return res.status(500).json(e);
    });
};
exports.likeMovie = (req, res) => {
  const likedMovie = {
    movieId: req.body.movieId,
    likedBy: req.user._id,
    movieTitle: req.body.movieTitle,
    overview: req.body.overview,
    moviePoster: req.body.moviePoster,
    releaseDate: req.body.releaseDate,
    genreId: req.body.genreId,
    //movie details also be added
  };

  LikedMovie.create(likedMovie)
    .then((doc) => {
      DislikedMovie.findOneAndDelete({
        movieId: req.body.movieId,
        dislikedBy: req.user._id,
      }).then((data) => {
        const genreName = genreConverter(doc.genreId);
        const updatedGenre = { $inc: {} };
        for (let i = 0; i < genreName.length; i++) {
          updatedGenre.$inc[genreName[i]] = 1;
        }
        console.log(updatedGenre);
        // UserGenrePreference.findOne({ user: req.user._id }).then((user) => {
        //   if (!user) {
        //     UserGenrePreference.create({ user: req.user._id })
        //       .then((pref) => {
        //         UserGenrePreference.findByIdAndUpdate(pref._id, updatedGenre,{new:true})
        //           .then((updated) => {
        //             console.log(updated);
        //           })
        //           .catch((e) => {
        //             console.log(e);
        //           });
        //       })
        //       .catch((e) => {
        //         console.log(e);
        //       });
        //   } else {
        //     UserGenrePreference.findOneAndUpdate(
        //       { user: req.user._id },
        //       updatedGenre,
        //       { new: true }
        //     )
        //       .then((pref) => {
        //         console.log(pref);
        //       })
        //       .catch((e) => {
        //         console.log(e);
        //       });
        //   }
        // });
        UserGenrePreference.findOneAndUpdate(
          { user: req.user._id },
          updatedGenre,
          { new: true, upsert: true }
        )
          .then((pref) => {
            console.log(pref);
          })
          .catch((e) => {
            console.log(e);
          });
        return res.status(201).json({ liked: true, disliked: false });
      });
    })
    .catch((e) => {
      console.log(e);

      return res.status(500).json(e);
    });
};

exports.dislikeMovie = (req, res) => {
  const dislikedMovie = {
    movieId: req.body.movieId,
    dislikedBy: req.user._id,
    movieTitle: req.body.movieTitle,
    overview: req.body.overview,
    moviePoster: req.body.moviePoster,
    releaseDate: req.body.releaseDate,
    genreId: req.body.genreId,
  };
  DislikedMovie.create(dislikedMovie)
    .then((doc) => {
      LikedMovie.findOneAndDelete({
        movieId: req.body.movieId,
        likedBy: req.user._id,
      }).then((data) => {
        const genreName = genreConverter(doc.genreId);
        const updatedGenre = { $inc: {} };
        for (let i = 0; i < genreName.length; i++) {
          updatedGenre.$inc[genreName[i]] = -1;
        }
        console.log(updatedGenre);
        UserGenrePreference.findOneAndUpdate(
          { user: req.user._id },
          updatedGenre,
          {
            new: true,
            upsert: true,
          }
        )
          .then((pref) => {
            console.log(pref);
          })
          .catch((e) => {
            console.log(e);
          });

        return res.status(201).json({ liked: false, disliked: true });
      });
    })
    .catch((e) => {
      console.log(e);

      return res.status(500).json(e);
    });
};

exports.undoDislikeMovie = (req, res) => {
  DislikedMovie.findOneAndDelete({
    movieId: req.body.movieId,
    dislikedBy: req.user._id,
  })
    .then((doc) => {
      if(doc === null) return res.status(201).json({ disliked: false });
      const genreName = genreConverter(doc.genreId);
      const updatedGenre = { $inc: {} };
      for (let i = 0; i < genreName.length; i++) {
        updatedGenre.$inc[genreName[i]] = 1;
      }
      console.log(updatedGenre);
      UserGenrePreference.findOneAndUpdate(
        { user: req.user._id },
        updatedGenre,
        {
          new: true,
          upsert: true,
        }
      )
        .then((pref) => {
          console.log(pref);
        })
        .catch((e) => {
          console.log(e);
        });
      return res.status(201).json({ disliked: false });
    })
    .catch((e) => {
      console.log(e);
      return res.status(500).json(e);
    });
};

exports.undoLikeMovie = (req, res) => {
  LikedMovie.findOneAndDelete({
    movieId: req.body.movieId,
    likedBy: req.user._id,
  })
    .then((doc) => {
      if(doc === null ) return res.status(201).json({ liked: false });
      const genreName = genreConverter(doc.genreId);
      const updatedGenre = { $inc: {} };
      for (let i = 0; i < genreName.length; i++) {
        updatedGenre.$inc[genreName[i]] = -1;
      }
      console.log(updatedGenre);
      UserGenrePreference.findOneAndUpdate(
        { user: req.user._id },
        updatedGenre,
        {
          new: true,
          upsert: true,
        }
      )
        .then((pref) => {
          console.log(pref);
        })
        .catch((e) => {
          console.log(e);
        });
      return res.status(201).json({ liked: false });
    })
    .catch((e) => {
      console.log(e);
      return res.status(500).json(e);
    });
};
//.................
exports.getUserWatchList = (req, res) => {
  Watchlist.find({ watchlistedBy: req.user._id })
    .populate("watchlistedBy", "profileImageUrl userName fullName")
    .sort("-createdAt")
    .then((watchlist) => {
      return res.status(200).json(watchlist);
    })
    .catch((e) => {
      console.log(e);
      return res.status(500).json(e);
    });
};
exports.getMashUserWatchList = (req, res) => {
  User.findOne({ userName: req.params.userName })
    .then((user) => {
      Watchlist.find({ watchlistedBy: user._id })
        .populate("watchlistedBy", "profileImageUrl userName fullName")
        .sort("-createdAt")
        .then((watchlist) => {
          return res.status(200).json(watchlist);
        })
        .catch((e) => {
          console.log(e);
          return res.status(500).json(e);
        });
    })
    .catch((e) => {
      console.log(e);
      return res.status(500).json(e);
    });
};
exports.addToWatchlist = (req, res) => {
  const watchlist = {
    movieId: req.body.movieId,
    watchlistedBy: req.user._id,
    movieTitle: req.body.movieTitle,
    overview: req.body.overview,
    moviePoster: req.body.moviePoster,
    releaseDate: req.body.releaseDate,
    genreId: req.body.genreId,
  };
  Watchlist.create(watchlist)
    .then((doc) => {
      return res.status(201).json({ ...doc });
    })
    .catch((e) => {
      console.log(e);
      return res.status(201).json({ ...e });
    });
};
exports.removeFromWatchlist = (req, res) => {
  Watchlist.findOneAndDelete({
    movieId: req.body.movieId,
    watchlistedBy: req.user._id,
  })
    .then((doc) => {
      return res.status(201).json({ inWatchlist: false });
    })
    .catch((e) => {
      console.log(e);
      return res.status(500).json(e);
    });
};
exports.checkMovieStatus = (req, res) => {
  Watchlist.findOne({ movieId: req.params.id, watchlistedBy: req.user._id })
    .then((watchlistMovie) => {
      if (watchlistMovie !== null) {
        LikedMovie.findOne({ movieId: req.params.id, likedBy: req.user._id })
          .then((likedDoc) => {
            if (likedDoc !== null) {
              return res
                .status(200)
                .json({ liked: true, disliked: false, inWatchlist: true });
            } else if (likedDoc === null) {
              DislikedMovie.findOne({
                movieId: req.params.id,
                dislikedBy: req.user._id,
              })
                .then((dislikedDoc) => {
                  if (dislikedDoc !== null) {
                    return res.status(200).json({
                      liked: false,
                      disliked: true,
                      inWatchlist: true,
                    });
                  } else {
                    return res.status(200).json({
                      liked: false,
                      disliked: false,
                      inWatchlist: true,
                    });
                  }
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
        LikedMovie.findOne({ movieId: req.params.id, likedBy: req.user._id })
          .then((likedDoc) => {
            if (likedDoc !== null) {
              return res
                .status(200)
                .json({ liked: true, disliked: false, inWatchlist: false });
            } else if (likedDoc === null) {
              DislikedMovie.findOne({
                movieId: req.params.id,
                dislikedBy: req.user._id,
              })
                .then((dislikedDoc) => {
                  if (dislikedDoc !== null) {
                    return res.status(200).json({
                      liked: false,
                      disliked: true,
                      inWatchlist: false,
                    });
                  } else {
                    return res.status(200).json({
                      liked: false,
                      disliked: false,
                      inWatchlist: false,
                    });
                  }
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
    })
    .catch((e) => console.log(e));
};

exports.searchMovie = (req, res) => {
  const query = req.query.query;
  axios
    .get(requests.searchMovies + `&query=${query}`)
    .then((response) => {
      return res.status(200).json(response.data);
    })
    .catch((e) => {
      return res.status(500).json(e);
    });
};
exports.getMovieDetail = (req, res) => {
  const id = req.params.movieId;
  let results = {};
  axios
    .get(
      `/movie/${id}?api_key=${process.env.API_KEY}&language=en-US&append_to_response=videos,credits`
    )
    .then((response) => {
      results = { ...response.data };
      return res.status(200).json(results);
    })
    .catch((e) => {
      console.log(e);
      return res.status(500).json(e.message);
    });
};
exports.upcomingCovers = (req, res) => {
  // let results = [];
  // let promises = [];
  // axios
  //   .get(requests.fetchUpcomingMovies)
  //   .then((response) => {
  //     results = [...response.data.results.slice(0, 5)]; //onliy p can change the difference
  //     for (let i = 0; i < results.length; i++) {
  //       promises.push(
  //         axios
  //           .get(
  //             `https://api.themoviedb.org/3/movie/${results[i].id}/videos?api_key=${process.env.API_KEY}&language=en-US`
  //           )
  //           .then((response) => {
  //             results[i].trailers = response.data.results;
  //           })
  //           .catch((e) => {
  //             console.log(e);
  //             return res.status(500).json(e.message);
  //           })
  //       );
  //     }
  //     Promise.all(promises).then(() => {
  //       return res.status(200).json(results);
  //     });
  //   })
  //   .catch((e) => {
  //     console.log(e);
  //     console.log("hello");
  //     return res.status(500).json(e.message);
  //   });

  axios
    .get(requests.fetchUpcomingMovies)
    .then((response) => {
      results = [...response.data.results.slice(0, 5)]; //onliy p can change the difference

      return res.status(200).json(results);
    })
    .catch((e) => {
      console.log(e);
      console.log("hello");
      return res.status(500).json(e.message);
    });
};

exports.movieLists = (req, res) => {
  const genre = req.params.genreName;
  const page = req.params.pageNumber;
  switch (genre) {
    case "Trending":
      axios
        .get(requests.fetchTrending + `&page=${page}`)
        .then((response) => {
          return res.status(200).json(response.data);
        })
        .catch((e) => {
          console.log(e);
          return res.status(500).json(e.message);
        });
      break;
    case "Top Rated":
      axios
        .get(requests.fetchTopRated + `&page=${page}`)
        .then((response) => {
          return res.status(200).json(response.data);
        })
        .catch((e) => {
          console.log(e);
          return res.status(500).json(e.message);
        });
      break;
    case "Action":
      axios
        .get(requests.fetchActionMovies + `&page=${page}`)
        .then((response) => {
          return res.status(200).json(response.data);
        })
        .catch((e) => {
          console.log(e);
          return res.status(500).json(e.message);
        });
      break;
    case "Comedy":
      axios
        .get(requests.fetchComedyMovies + `&page=${page}`)
        .then((response) => {
          return res.status(200).json(response.data);
        })
        .catch((e) => {
          console.log(e);
          return res.status(500).json(e.message);
        });
      break;
    case "Horror":
      axios
        .get(requests.fetchHorrorMovies + `&page=${page}`)
        .then((response) => {
          return res.status(200).json(response.data);
        })
        .catch((e) => {
          console.log(e);
          return res.status(500).json(e.message);
        });
      break;
    case "Romance":
      axios
        .get(requests.fetchRomanceMovies + `&page=${page}`)
        .then((response) => {
          return res.status(200).json(response.data);
        })
        .catch((e) => {
          console.log(e);
          return res.status(500).json(e.message);
        });
      break;
    case "Documentary":
      axios
        .get(requests.fetchDocumentaries + `&page=${page}`)
        .then((response) => {
          return res.status(200).json(response.data);
        })
        .catch((e) => {
          console.log(e);
          return res.status(500).json(e.message);
        });
      break;
    case "Upcoming":
      axios
        .get(requests.fetchUpcomingMovies + `&page=${page}`)
        .then((response) => {
          return res.status(200).json(response.data);
        })
        .catch((e) => {
          console.log(e);
          res.status(500).json(e.message);
        });
      break;
    case "Adventure":
      axios
        .get(requests.fetchAdventureMovies + `&page=${page}`)
        .then((response) => {
          return res.status(200).json(response.data);
        })
        .catch((e) => {
          console.log(e);
          return res.status(500).json(e.message);
        });
      break;
    case "Animation":
      axios
        .get(requests.fetchAnimationMovies + `&page=${page}`)
        .then((response) => {
          return res.status(200).json(response.data);
        })
        .catch((e) => {
          console.log(e);
          return res.status(500).json(e.message);
        });
      break;
    case "Drama":
      axios
        .get(requests.fetchDramaMovies + `&page=${page}`)
        .then((response) => {
          return res.status(200).json(response.data);
        })
        .catch((e) => {
          console.log(e);
          res.status(500).json(e.message);
        });
      break;
    case "Crime":
      axios
        .get(requests.fetchCrimeMovies + `&page=${page}`)
        .then((response) => {
          return res.status(200).json(response.data);
        })
        .catch((e) => {
          console.log(e);
          return res.status(500).json(e.message);
        });
      break;
    case "Family":
      axios
        .get(requests.fetchFamilyMovies + `&page=${page}`)
        .then((response) => {
          return res.status(200).json(response.data);
        })
        .catch((e) => {
          console.log(e);
          return res.status(500).json(e.message);
        });
      break;
    case "Fantasy":
      axios
        .get(requests.fetchFantasyMovies + `&page=${page}`)
        .then((response) => {
          return res.status(200).json(response.data);
        })
        .catch((e) => {
          console.log(e);
          return res.status(500).json(e.message);
        });
      break;
    case "History":
      axios
        .get(requests.fetchHistoryMovies + `&page=${page}`)
        .then((response) => {
          return res.status(200).json(response.data);
        })
        .catch((e) => {
          console.log(e);
          return res.status(500).json(e.message);
        });
      break;
    case "Music":
      axios
        .get(requests.fetchMusicMovies + `&page=${page}`)
        .then((response) => {
          return res.status(200).json(response.data);
        })
        .catch((e) => {
          console.log(e);
          return res.status(500).json(e.message);
        });
      break;
    case "Sci-Fi":
      axios
        .get(requests.fetchSciFiMovies + `&page=${page}`)
        .then((response) => {
          return res.status(200).json(response.data);
        })
        .catch((e) => {
          console.log(e);
          return res.status(500).json(e.message);
        });
      break;
    case "TV Movie":
      axios
        .get(requests.fetchTVMovies + `&page=${page}`)
        .then((response) => {
          return res.status(200).json(response.data);
        })
        .catch((e) => {
          console.log(e);
          return res.status(500).json(e.message);
        });
      break;
    case "Thriller":
      axios
        .get(requests.fetchThrillerMovies + `&page=${page}`)
        .then((response) => {
          return res.status(200).json(response.data);
        })
        .catch((e) => {
          console.log(e);
          return res.status(500).json(e.message);
        });
      break;
    case "War":
      axios
        .get(requests.fetchWarMovies + `&page=${page}`)
        .then((response) => {
          return res.status(200).json(response.data);
        })
        .catch((e) => {
          console.log(e);
          return res.status(500).json(e.message);
        });
      break;
    default:
      console.log(type);
  }
};

// headers: {
//         'Content-Type': 'application/json; charset=utf-8',
//         'Content-Length': Buffer.byteLength(post_data),
//         'Accept': 'application/json',
//         'Accept-Encoding': 'gzip,deflate,sdch',
//         'Accept-Language': 'en-US,en;q=0.8'
//     }

// exports.movieLists = (req, res) => {}

// exports.upcomingCovers = (req, res) => {};
