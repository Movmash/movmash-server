const LikedMovie = require("../models/likedMovieModel");
const DislikedMovie = require("../models/dislikedMovieModel");

const requests = require("../requests.js");
const axios = require("../axios.js");
exports.likeMovie = (req, res) => {
  const likedMovie = {
    movieId: req.body.movieId,
    likedBy: req.user._id,
    //movie details also be added
  };
  LikedMovie.create(likedMovie)
    .then((doc) => {
      DislikedMovie.findOneAndDelete({
        movieId: req.body.movieId,
        dislikedBy: req.user._id,
      }).then((data) => {
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
  };
  DislikedMovie.create(dislikedMovie)
    .then((doc) => {
      LikedMovie.findOneAndDelete({
        movieId: req.body.movieId,
        likedBy: req.user._id,
      }).then((data) => {
        return res.json({ liked: false, disliked: true });
      });
      //   return res.status(201).send(doc);
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
      return res.status(201).json({ liked: false });
    })
    .catch((e) => {
      console.log(e);
      return res.status(500).json(e);
    });
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
  let results = [];
  let promises = [];
  axios
    .get(requests.fetchUpcomingMovies)
    .then((response) => {
      results = [...response.data.results.slice(0, 5)]; //onliy p can change the difference
      for (let i = 0; i < results.length; i++) {
        promises.push(
          axios
            .get(
              `https://api.themoviedb.org/3/movie/${results[i].id}/videos?api_key=${process.env.API_KEY}&language=en-US`
            )
            .then((response) => {
              results[i].trailers = response.data.results;
            })
            .catch((e) => {
              console.log(e);
              return res.status(500).json(e.message);
            })
        );
      }
      Promise.all(promises).then(() => {
        return res.status(200).json(results);
      });
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
