//----------------------//----------------------//Variables
const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;
const cookieParser = require('cookie-parser');
const bodyParser = require("body-parser");
const cookieSession = require('cookie-session')

const bcrypt = require('bcrypt');
const password = "purple-monkey-dinosaur";
const hashed_password = bcrypt.hashSync(password, 10);

app.set("view engine", "ejs");
app.use(cookieSession({
  name: 'session',
  keys: ['jump', 'up', 'here'],
  maxAge: 24 * 60 * 60 * 1000
}));

app.use(bodyParser.urlencoded({extended: true}));

//----------------------//----------------------//Functions


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
    if (users[id].email === email && bcrypt.hashSync(password, users[id].password)) {
      return id;
    }
  }
}

function matchingCurrrentUser (shortURL, userID) {
  if (urlDatabase[shortURL].userId === userID) {
    return true;
  } else {
    return false;
  }
}

function loopDataBase(currentUser) {
  var space = [];
  for (let keyDataBase in urlDatabase) {
   if (matchingCurrrentUser(keyDataBase, currentUser)){
    space.push({'short':keyDataBase, 'long': urlDatabase[keyDataBase].url});
    }
  }
  return space;
}


//----------------------//----------------------//Object

const users = {
  'Somechineseguy': {
    id: 'Somechineseguy',
    email: 'alvin.cl.ng@gmail.com',
    password: 'Somechineseguy',
  },
  'Otherguy': {
    id: 'Otherguy',
    email: 'Other@email.com',
    "password": 'Otherpassword'
  }
};

const urlDatabase = {
  "b2xVn2": {
    url: "http://www.lighthouselabs.ca",
    userId: "Somechineseguy"
  },
  "9sm5xK": {
    url: "http://www.google.com",
    userId: "Otherguy"
  },
};

//----------------------//----------------------//Middleware

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.use(function(req, res, next){
  if(req.session.user_id in users) {
    if(typeof users[req.session.user_id].email !== "undefined") {
      res.locals.userlogin = true;
      res.locals.user = users[req.session.user_id];
    } else {
      res.locals.userlogin = false;
      }
    } else {
      res.locals.userlogin = false;
    }
  res.locals.urls = urlDatabase;
  next();
});

//----------------------//----------------------//Loading page

app.get("/", (req, res) => {
  if(res.locals.userlogin) {
   res.redirect("/urls");
 } else {
   res.redirect("/login");
 }
});

app.get("/urls", (req, res) => {
  let userID = req.session.user_id
  let templateVars = {
    "urlArray": loopDataBase(req.session.user_id)
  };
  if(res.locals.userlogin) {
   res.render("urls_index", templateVars);
 } else {
  res.status(401).render("_401");
}
});

app.get("/urls/new", (req, res) => {
   if(res.locals.userlogin) {
   res.render("urls_new");
 } else {
   res.sttus(401).render("_401");
 }
});

//----------------------//----------------------//Short URLS

app.get("/urls/:shortURL", (req, res) => {
  let shortURL = req.params.shortURL;
  if(res.locals.userlogin) {
    if (!urlDatabase[shortURL]) {
      res.status(404).render("_404");
    } else if (res.locals.user.id !== urlDatabase[shortURL].userId) {
      res.status(403).render("_403");
    } else {
      let longURL = urlDatabase[shortURL].url;
      let templateVars = {
        shortURL: shortURL,
        longURL: longURL,
      };
       res.render("urls_show", templateVars);
    }
  } else {
   res.status(401).render("_401");
  }
});

app.get("/u/:shortURL", (req, res) => {
  if(!urlDatabase[req.params.shortURL]) {
    res.status(404).render('_404')
  } else {
    res.redirect(urlDatabase[req.params.shortURL]['url']);
  }
});


//----------------------//----------------------//Register

app.get("/register", (req, res) => {
  res.render("_registration");
});

app.post("/register", (req, res) => {
  const uEmail = req.body.email;
  const uPassword = req.body.password;
  const user_id = generateRandomString();
  if (areCredentialsInvalid(uEmail, uPassword)) {
    return res.status(400).send("Here's a bunny with a pancake on its head.  Your argument is invalid....  Also you typed in the wrong password... PANCAKES!!");
  } else if (checkExsistingEmail(uEmail)) {
    return res.status(400).send("Here's a bunny with a pancake on its head.  Your argument is invalid.... Also that email is in uses.... PANCAKES!!!");
    } else {
      users[user_id] = {
        id: user_id,
        email: uEmail,
        password: bcrypt.hashSync(uPassword, 10)
      }
      req.session.user_id = user_id;
      res.redirect('/urls');
    }
  });

//----------------------//----------------------///URLS

app.post("/urls", (req, res) => {
  if(res.locals.userlogin) {
    let newRandomString = generateRandomString();
    var userId = req.session["user_id"];
    var urlDetails = {};
    urlDetails['url'] = req.body.longURL;
    urlDetails['userId'] = userId;
    urlDatabase[newRandomString] = urlDetails;
    res.redirect(`/urls`);
  } else {
    res.sttus(401).render("_401");
   }
});

app.post("/urls/:shortURL/delete", (req, res) => {
  if(res.locals.userlogin) {
  delete urlDatabase[req.params.shortURL];
  res.redirect('/urls');
  } else {
   res.sttus(401).render("_401")
 }
});

app.post("/urls/:shortURL", (req, res) => {
let shortURL = req.params.shortURL;
  if(res.locals.userlogin) {
    if (!urlDatabase[shortURL]) {
      res.status(404).render("_404");
    }
    else if (res.locals.user.id !== urlDatabase[shortURL].userId) {
      res.status(403).render("_403");
    } else {
      urlDatabase[shortURL].url = req.body.longURL;
      res.redirect('/urls/' + shortURL);
    }
  } else {
   res.status(401).render("_401");
  }
});
//----------------------//----------------------//Login
app.get("/login", (req, res) => {
  res.render("_login");
})

app.post("/login", (req, res) => {
  const loginEmail = req.body.email;
  const loginPassword = req.body.password;
  const currentUser = checkExsistingEmailAndPassword(loginEmail, loginPassword);
  if (!currentUser)  {
    return res.status(403).send("Wait wait wait.... That's not you")
  }
  const user = {
    user_id: currentUser
  }
  req.session = user;
  res.redirect('/urls');
});

app.post("/logout", (req, res) => {
  req.session = null;
  res.redirect('/');
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});



