const axios = require("axios");
const URL = "https://movmash.herokuapp.com";
// const URL = "http://localhost:8000"


module.exports = axios.create({
  baseURL: URL,
});
