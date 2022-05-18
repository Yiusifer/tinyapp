const express = require("express");
const res = require("express/lib/response");
const app = express();
const PORT = 7000; // default port 7000

const bodyParser = require("body-parser");
const { json } = require("express/lib/response");
const req = require("express/lib/request");
app.use(bodyParser.urlencoded({ extended: true }));

//Importing the middleware
app.use(express.urlencoded({ extended: true }));


// Generate random short URL
function generateRandomString() {
  return Math.random().toString(36).slice(2, 8);
}
// Random ID for user
function generateRandomId() {
  return Math.random().toString(36).slice(2, 8);
}


app.set("view engine", "ejs");

// Databases
const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

const users = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
 "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
  }
};


app.get("/", (req, res) => {
  res.send("Hello!");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});

app.get("/urls/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  const longURL = urlDatabase[shortURL];
  const templateVars = { shortURL, longURL };
  res.render("urls_show", templateVars);
});

app.post("/urls", (req, res) => {
  //console.log("req.body.longUrl", req.body.longURL);
  //console.log("req.body.name", req.body.name);
  const longURL = req.body.longURL;
  const shortURL = generateRandomString();
  //Sending shortURL to urls_show.ejs so it can link to relevant page
  //res.render("urls_show", shortURL);
  urlDatabase[shortURL] = longURL;
  res.redirect(`/urls/${shortURL}`);
  console.log(urlDatabase);
});

// Redirects to corresponding long URL after receiving short URL
app.get("/u/:shortURL", (req, res) => {
  const longURL = res.redirect(urlDatabase[req.params.shortURL]);
  res.redirect(longURL);
});

// Deletes URL
app.post("/urls/:shortURL/delete", (req, res) => {
  delete urlDatabase[req.params.shortURL];
  res.redirect("/urls");
})

app.post("/urls/:id", (req, res) => {
  // Update urlDatabase with new url (longURL)
  urlDatabase[req.params.id] = res.body.longURL
})

// Handling user registration
app.get("/register", (req, res) => {
  res.render("registration");
})

app.post("/register", (req, res) => {
    const currentUserId = generateRandomId();
    users["user" + currentUserId] = {id: currentUserId, email: req.body.email, password: req.body.password};
    res.cookie("user_id", currentUserId);
    res.redirect("/urls");
})