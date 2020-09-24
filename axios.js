const axios = require("axios");

module.exports = axios.create({
  baseURL: "https://api.themoviedb.org/3",
});
