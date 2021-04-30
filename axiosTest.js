const axios = require("axios");
const URL = "https://movmash.herokuapp.com";


module.exports = axios.create({
  baseURL: URL,
});
