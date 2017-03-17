const express = require("express");
const app = express();
const PORT = process.env.PORT || 8080;
const cookieParser = require('cookie-parser');
const bodyParser = require("body-parser");
app.set("view engine", "ejs");
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: true}));


function generateRandomString() {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for( var i=0; i < 6; i++ )
  text += possible.charAt(Math.floor(Math.random() * possible.length));
  return text;
};


function areCredentialsInvalid(email, password) {
  if (!email || !password) {
    return true;
  }
};

function checkExsistingEmail(email) {
  for (var id in users) {
    if (users[id].email === email)
      return true;
  }
  return false;
};

function checkExsistingEmailAndPassword (email, password){
  for (var id in users) {
    if (users[id].email === email && users[id].password === password) {
      return id;
    }
  }
  // return undefined;
}

const users = {
  'Somechineseguy': {
    id: 'Somechineseguy',
    email: 'alvin.cl.ng@gmail.com',
    password: 'Somechineseguy'
  },
  'Otherguy': {
    id: 'Otherguy',
    email: 'Other@email.com',
    password: 'Otherpassword'
  }

};

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

app.get("/", (req, res) => {
  res.render("_login");
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});





app.use(function(req, res, next){
  res.locals.user = users[req.cookies.user_id];
  res.locals.urls = urlDatabase;
  next();
});




app.get("/urls", (req, res) => {
  let userID = req.cookies.user_id
  let templateVars = {
  };
  res.render("urls_index", templateVars);
});


app.get("/urls/new", (req, res) => {
   let templateVars = {
  };
  res.render("urls_new", templateVars);
});

app.get("/urls/:shortURL", (req, res) => {
  let shortURL = req.params.shortURL;
  let longURL = urlDatabase[shortURL];
  let templateVars = {
    shortURL: shortURL,
    longURL: longURL,
  };
  res.render("urls_show", templateVars);
});

app.get("/u/:shortURL", (req, res) => {
  let longURL = urlDatabase[req.params.shortURL];
  let templateVars = {
  };
  res.redirect(longURL);
});

app.post("/urls", (req, res) => {
  let newRandomString = generateRandomString();
  urlDatabase[newRandomString] = req.body['longURL'];
  res.redirect(`/urls`);
  res.send("Ok");
});


app.get("/register", (req, res) => {
  res.render("_registration");
});



app.post("/register", (req, res) => {
  const uEmail = req.body.email;
  const uPassword = req.body.password;
  const user_id = generateRandomString();
  if (areCredentialsInvalid(uEmail, uPassword)) {
    return res.status(400).send("Here's a bunny with a pancake on its head.  Your argument is invalid.");
    // return res.status(400).render("i_hate_users", {});
  } else if (checkExsistingEmail(uEmail)) {
    return res.status(400).send("Here's a bunny with a pancake on its head.  Your argument is invalid.2");
    } else {
      users[user_id] = {
        id: user_id,
        email: uEmail,
        password: uPassword
      }
      res.cookie("user_id", user_id)
      res.redirect('/urls')
    }
  });




app.post("/urls/:shortURL/delete", (req, res) => {
  delete urlDatabase[req.params.shortURL];
  res.redirect('/urls');
});

app.post("/urls/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  urlDatabase[shortURL] = req.body.longURL
  res.redirect('/urls')
});

app.get("/login", (req, res) => {
  res.render("_login")
})




app.post("/login", (req, res) => {
  const loginEmail = req.body.email;
  const loginPassword = req.body.password;
  const currentUser = checkExsistingEmailAndPassword(loginEmail, loginPassword);
  if (!currentUser)  {
    return res.status(403).send("Wait wait wait.... That's not you")
  }
  res.cookie("user_id", currentUser)
  res.redirect('/urls');
});




app.post("/logout", (req, res) => {
  res.clearCookie("user_id");
  res.redirect('/');
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});


