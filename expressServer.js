//Importing the middleware
const express = require("express");
const app = express();
const res = require("express/lib/response");
const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session');
const bodyParser = require("body-parser");
const { json } = require("express/lib/response");
const req = require("express/lib/request");
const bcrypt = require('bcryptjs');
// Helper functions
const { emailSearcher, generateRandomString } = require("./helpers");


const PORT = 7000; // default port 7000


app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieSession({
  name: 'session',
  keys: ["Coding is so much fun!", "I love Lighthouse Labs!"],
}));



app.set("view engine", "ejs");

// Databases
const urlDatabase = {
  "b2xVn2": {
    longUrl: "http://www.lighthouselabs.ca",
    user_id: undefined
  },
  "9sm5xK": {
    longUrl: "http://www.google.com",
    user_id: undefined
  }
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


app.get("/urls/new", (req, res) => {
  const templateVars = { user_id: req.session.user_id };
  if (!req.session.user_id) {
    return res.redirect("/login");
  }
  res.render("urls_new", templateVars);
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase, user_id: req.session.user_id };
  res.render("urls_index", templateVars);
  console.log(users);

});

app.post("/urls", (req, res) => {
  const longURL = req.body.longURL;
  const shortURL = generateRandomString();

  // Updates url Database after creating new short url
  urlDatabase[shortURL] = { longUrl: longURL, user_id: req.session.user_id };
  urlDatabase[shortURL].user_id = req.session.user_id;
  res.redirect(`/urls/${shortURL}`);
  console.log(urlDatabase);
});

app.get("/urls/:shortURL", (req, res) => {
  if (!req.session.user_id) {
    return res.status(402).send(`Error: Please login or register`);
  }
  if (!urlDatabase[req.params.shortURL]) {
    return res.send(`Error: ${req.params.shortURL} does not match any existing tiny URL`);
  }

  if (req.session.user_id !== urlDatabase[req.params.shortURL].user_id) {
    return res.send(`The tiny URL: ${req.params.shortURL} does not belong to you.`);
  }
  const shortURL = req.params.shortURL;
  const longURL = urlDatabase[shortURL];
  const templateVars = { shortURL, longURL, user_id: req.session.user_id };
  res.render("urls_show", templateVars);
});



// Redirects to corresponding long URL after receiving short URL
app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL].longUrl;
  res.redirect(longURL);
});

// Deletes URL
app.post("/urls/:shortURL/delete", (req, res) => {
  delete urlDatabase[req.params.shortURL];
  res.redirect("/urls");
});

app.post("/urls/:id", (req, res) => {
  // Edits urlDatabase with new url(longURL)
  urlDatabase[req.params.id].longUrl = req.body.longUrl;
  return res.redirect('/urls');
});

// Handling user registration
app.get("/register", (req, res) => {
  const templateVars = { user_id: undefined };
  res.render("registration", templateVars);
});

app.post("/register", (req, res) => {
  if ((!req.body.email) || (!req.body.password)) {
    return res.status(400).send("Uh oh, something went wrong: Error 404. Please enter a valid email address and password.");
  }

  if (emailSearcher(req.body.email, users)) {
    return res.status(400).send("This email is already in use: Error 404");
  }
  // Create unique cookie value for user
  const currentUserId = generateRandomString();
  users[currentUserId] = { id: currentUserId, email: req.body.email, password: bcrypt.hashSync(req.body.password, 10) };
  req.session.user_id = currentUserId;

  res.redirect("/urls");
});


// login and logout routes
app.post("/logout", (req, res) => {
  // Clearing cookies upon logout
  req.session = null;
  res.redirect("/urls");
});

app.get("/login", (req, res) => {
  const templateVars = { user_id: undefined };
  res.render("login", templateVars);
});

app.post("/login", (req, res) => {
  let email = req.body.email;
  const result = emailSearcher(email, users);
  if (result && bcrypt.compareSync(req.body.password, result.password)) {
    req.session.user_id = result.id;
    return res.redirect("urls");
  }
  return res.status(403).send("No user can be found at that email address");
});


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});