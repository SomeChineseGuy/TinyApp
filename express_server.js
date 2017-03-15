var express = require("express");
var app = express();
var PORT = process.env.PORT || 8080; // default port 8080

app.set("view engine", "ejs");

function generateRandomString() {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for( var i=0; i < 6; i++ )
  text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;

}
console.log(generateRandomString())
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
  res.redirect(`/urls/ ${newRandomString}`)

});

app.get("/hello", (req, res) => {
  res.end("<html><body>Hello <b>World</b></body></html>\n");
});

app.get("/urls/:id", (req, res) => {
  let templateVars = { shortURL: req.params.id };
  console.log(req.params.id)
  res.render("urls_show", templateVars);
});



app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});