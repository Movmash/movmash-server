const passport = require("passport")
const {CLIENT_BASE_URL} = require("../util/constantConfig");
module.exports = (app) => {
    app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
app.get("/auth/google/callback", passport.authenticate("google"), (req,res) => {
    res.redirect(`${CLIENT_BASE_URL}/`);
});
app.get('/current_user',(req,res) => {
    return res.status(200).json(req.user)
})
app.get('/logout',(req,res) => {
    req.logout();
    res.redirect(`${CLIENT_BASE_URL}/login`);
})

app.get("/auth/facebook", passport.authenticate("facebook"));

app.get(
  "/auth/facebook/callback",
  passport.authenticate("facebook"),(req,res) => {
      res.redirect(`${CLIENT_BASE_URL}/`);
  }
);
}