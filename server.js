const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();
const requests = require("./requests.js");
const axios = require("./axios.js");
const {
  signup,
  login,
  getUserDetails,
  followUser,
  unfollowUser,
} = require("./routes/userRoutes.js");
const mashDBAuth = require("./util/mashDBAuth.js");
const {
  postOnePosts,
  likePost,
  unlikePost,
  deletePost,
  getSubscribedPost,
  getMyPost,
} = require("./routes/postRoutes.js");
//....................................................................................

app.use(cors((origin = "http://localhost:3000"), (optionsSuccessStatus = 200)));
app.use(express.json());
mongoose.connect(process.env.DB_URI, {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

//....................................................................................

const db = mongoose.connection;
db.once("open", () => {
  console.log("mashDB is now connected");
});

//....................................................................................

app.get("/api/v1/movie/upcoming-cover", (req, res) => {
  let results = [];
  let promises = [];
  axios
    .get(requests.fetchUpcomingMovies)
    .then((response) => {
      results = [...response.data.results.splice(0, 5)];
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
              res.status(500).json(e.message);
            })
        );
      }
      Promise.all(promises).then(() => {
        res.status(200).json(results);
      });
    })
    .catch((e) => {
      console.log(e);
      res.status(500).json(e.message);
    });
});

app.get("/api/v1/movie/genre/:genreName/:pageNumber", (req, res) => {
  const genre = req.params.genreName;
  const page = req.params.pageNumber;
  switch (genre) {
    case "trending":
      axios
        .get(requests.fetchTrending + `&page=${page}`)
        .then((response) => {
          res.status(200).json(response.data);
        })
        .catch((e) => {
          console.log(e);
          res.status(500).json(e.message);
        });
      break;
    case "topRated":
      axios
        .get(requests.fetchTopRated + `&page=${page}`)
        .then((response) => {
          res.status(200).json(response.data);
        })
        .catch((e) => {
          console.log(e);
          res.status(500).json(e.message);
        });
      break;
    case "action":
      axios
        .get(requests.fetchActionMovies + `&page=${page}`)
        .then((response) => {
          res.status(200).json(response.data);
        })
        .catch((e) => {
          console.log(e);
          res.status(500).json(e.message);
        });
      break;
    case "comedy":
      axios
        .get(requests.fetchComedyMovies + `&page=${page}`)
        .then((response) => {
          res.status(200).json(response.data);
        })
        .catch((e) => {
          console.log(e);
          res.status(500).json(e.message);
        });
      break;
    case "horror":
      axios
        .get(requests.fetchHorrorMovies + `&page=${page}`)
        .then((response) => {
          res.status(200).json(response.data);
        })
        .catch((e) => {
          console.log(e);
          res.status(500).json(e.message);
        });
      break;
    case "romance":
      axios
        .get(requests.fetchRomanceMovies + `&page=${page}`)
        .then((response) => {
          res.status(200).json(response.data);
        })
        .catch((e) => {
          console.log(e);
          res.status(500).json(e.message);
        });
      break;
    case "documentary":
      axios
        .get(requests.fetchDocumentaries + `&page=${page}`)
        .then((response) => {
          res.status(200).json(response.data);
        })
        .catch((e) => {
          console.log(e);
          res.status(500).json(e.message);
        });
      break;
    case "upcoming":
      axios
        .get(requests.fetchUpcomingMovies + `&page=${page}`)
        .then((response) => {
          res.status(200).json(response.data);
        })
        .catch((e) => {
          console.log(e);
          res.status(500).json(e.message);
        });
      break;
    case "adventure":
      axios
        .get(requests.fetchAdventureMovies + `&page=${page}`)
        .then((response) => {
          res.status(200).json(response.data);
        })
        .catch((e) => {
          console.log(e);
          res.status(500).json(e.message);
        });
      break;
    case "animation":
      axios
        .get(requests.fetchAnimationMovies + `&page=${page}`)
        .then((response) => {
          res.status(200).json(response.data);
        })
        .catch((e) => {
          console.log(e);
          res.status(500).json(e.message);
        });
      break;
    case "drama":
      axios
        .get(requests.fetchDramaMovies + `&page=${page}`)
        .then((response) => {
          res.status(200).json(response.data);
        })
        .catch((e) => {
          console.log(e);
          res.status(500).json(e.message);
        });
      break;
    case "crime":
      axios
        .get(requests.fetchCrimeMovies + `&page=${page}`)
        .then((response) => {
          res.status(200).json(response.data);
        })
        .catch((e) => {
          console.log(e);
          res.status(500).json(e.message);
        });
      break;
    case "family":
      axios
        .get(requests.fetchFamilyMovies + `&page=${page}`)
        .then((response) => {
          res.status(200).json(response.data);
        })
        .catch((e) => {
          console.log(e);
          res.status(500).json(e.message);
        });
      break;
    case "fanatasy":
      axios
        .get(requests.fetchFantasyMovies + `&page=${page}`)
        .then((response) => {
          res.status(200).json(response.data);
        })
        .catch((e) => {
          console.log(e);
          res.status(500).json(e.message);
        });
      break;
    case "history":
      axios
        .get(requests.fetchHistoryMovies + `&page=${page}`)
        .then((response) => {
          res.status(200).json(response.data);
        })
        .catch((e) => {
          console.log(e);
          res.status(500).json(e.message);
        });
      break;
    case "music":
      axios
        .get(requests.fetchMusicMovies + `&page=${page}`)
        .then((response) => {
          res.status(200).json(response.data);
        })
        .catch((e) => {
          console.log(e);
          res.status(500).json(e.message);
        });
      break;
    case "scifi":
      axios
        .get(requests.fetchSciFiMovies + `&page=${page}`)
        .then((response) => {
          res.status(200).json(response.data);
        })
        .catch((e) => {
          console.log(e);
          res.status(500).json(e.message);
        });
      break;
    case "tvMovie":
      axios
        .get(requests.fetchTVMovies + `&page=${page}`)
        .then((response) => {
          res.status(200).json(response.data);
        })
        .catch((e) => {
          console.log(e);
          res.status(500).json(e.message);
        });
      break;
    case "thiller":
      axios
        .get(requests.fetchThrillerMovies + `&page=${page}`)
        .then((response) => {
          res.status(200).json(response.data);
        })
        .catch((e) => {
          console.log(e);
          res.status(500).json(e.message);
        });
      break;
    case "war":
      axios
        .get(requests.fetchWarMovies + `&page=${page}`)
        .then((response) => {
          res.status(200).json(response.data);
        })
        .catch((e) => {
          console.log(e);
          res.status(500).json(e.message);
        });
      break;
    default:
      console.log(type);
  }
});

app.get("/api/v1/movie/details/:movieId", (req, res) => {
  const id = req.params.movieId;
  let results = {};
  axios
    .get(
      `/movie/${id}?api_key=${process.env.API_KEY}&language=en-US&append_to_response=videos,credits`
    )
    .then((response) => {
      results = { ...response.data };
      res.status(200).json(results);
    })
    .catch((e) => {
      console.log(e);
      res.status(500).json(e.message);
    });
});
//....................................................................................

app.post("/api/v1/home/signup", signup);
app.post("/api/v1/home/login", login);
app.get("/api/v1/home/user/:id", mashDBAuth, getUserDetails);
app.put("/api/v1/home/user/follow", mashDBAuth, followUser);
app.put("/api/v1/home/user/unfollow", mashDBAuth, unfollowUser);
//.......................................................................
app.get("/api/v1/home/getSubPost", mashDBAuth, getSubscribedPost);
app.post("/api/v1/home/post", mashDBAuth, postOnePosts);
app.put("/api/v1/home/like-post", mashDBAuth, likePost);
app.put("/api/v1/home/unlike-post", mashDBAuth, unlikePost);
app.delete("/api/v1/home/delete-post/:postId", mashDBAuth, deletePost);
app.get("/api/v1/home/getSubPost", mashDBAuth, getSubscribedPost);
app.get("/api/v1/home/myPost", mashDBAuth, getMyPost);
//...........................................................................................
const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`the server is started at port ${port}`);
});
