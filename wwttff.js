app.get("/register", (req, res) => {
  res.render("_registration")
});
//this is new too need to check
app.post("/register", (req, res) => {
  const uEmail = req.body.email;
  const uPassword = req.body.password;
  const user_id = generateRandomString();
  if (areCredentialsInvalid(uEmail, uPassword)) {
    return res.status(400).send("Here's a bunny with a pancake on its head.  Your argument is invalid.");
    // return res.status(400).render("i_hate_users", {});
  }; else if {
    (checkExsistingEmail() === uEmail) {
      return res.status(400).send("Here's a bunny with a pancake on its head.  Your argument is invalid.");
    } else {
    users[user_id] = {
      id: user_id,
      email: uEmail,
      password: uPassword
    }
    res.cookie("user_id", user_id);
    console.log("NEW ID " + user_id);
    res.redirect('/urls')
  }