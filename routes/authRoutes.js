const passport = require("passport")

module.exports = (app) => {
    app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
app.get("/auth/google/callback", passport.authenticate("google"), (req,res) => {
    res.redirect("http://localhost:3000/");
});
app.get('/current_user',(req,res) => {
    return res.status(200).json(req.user)
})
app.get('/logout',(req,res) => {
    req.logout();
    res.redirect("http://localhost:3000/login")
})
}