var express = require("express");
var app = express();
var PORT = process.env.PORT || 8080; // default port 8080
var cookieParser = require('cookie-parser')
app.set("view engine", "ejs");
app.use(cookieParser())



function generateRandomString() {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for( var i=0; i < 6; i++ )
  text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;

}

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

var urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

app.get("/u/:shortURL", (req, res) => {
  let longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});

app.get("/", (req, res) => {
  res.end("Hello!");
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

//find out whats the difference between app get and app post
// how to push objects into ejs


app.get("/urls", (req, res) => {
  let templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});


app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

app.post("/urls", (req, res) => {
  // console.log(req.body);  // debug statement to see POST parameters
  // res.send("Ok");         // Respond with 'Ok' (we will replace this)
  // When URL is received, generate short URL get URL
  let newRandomString = generateRandomString();
  // Set newRandomString as my key to the URL that i typed urls_inde
  urlDatabase[newRandomString] = req.body['longURL']
  // console.log(urlDatabase)
  // res.send("Ok");         // Respond with 'Ok' (we will replace this)
  // Redirect to site that I typed in but using the shorten URL as my key
  res.redirect(`/urls/${newRandomString}`)
  res.send("Ok");
});

app.post("/urls/:shortURL/delete", (req, res) => {
  delete urlDatabase[req.params.shortURL];
  res.redirect('/urls');
});

app.post("/urls/:shortURL", (req, res) => {
  // Need to edit these 2 lines
  const shortURL = req.params.shortURL
  // short URL is now the key to my data base
  // Look over this code
  urlDatabase[shortURL] = req.body.longURL
  res.redirect(`/urls`)
})

app.post("/login", (req, res) => {
  res.cookie('cookie-username', req.body.Username)
  res.redirect('/')
})

app.get("/hello", (req, res) => {
  res.end("<html><body>Hello <b>World</b></body></html>\n");
});

app.get("/urls/:shortURL", (req, res) => {
  let shortURL = req.params.shortURL;
  let longURL = urlDatabase[shortURL];
  //remind yourself what do these lines do
  let templateVars = { shortURL: shortURL, longURL: longURL };
  res.render("urls_show", templateVars);
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});