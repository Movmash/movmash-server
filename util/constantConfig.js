let serverBaseURL = "";
let clientBaseURL = "";

if (process.env.SERVER_ENV === "development") {
  serverBaseURL = "http://localhost:8000";
  clientBaseURL = "http://localhost:3000";
}

module.exports = Object.freeze({
  SERVER_BASE_URL: serverBaseURL,
  CLIENT_BASE_URL: clientBaseURL,
});