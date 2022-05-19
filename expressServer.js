//Importing the middleware
const express = require("express");
const app = express();
const res = require("express/lib/response");
var cookieParser = require('cookie-parser')
const bodyParser = require("body-parser");
const { json } = require("express/lib/response");
const req = require("express/lib/request");

const PORT = 7000; // default port 7000


app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())
app.use(bodyParser.urlencoded({ extended: true }));


// Generate random short URL
function generateRandomString() {
  return Math.random().toString(36).slice(2, 8);
}
// Random ID for user
function generateRandomId() {
  return Math.random().toString(36).slice(2, 8);
}
// Searches for existing email in database
function emailSearcher(userEmail) {
  for (const user in users) {
    if (users[user].email === userEmail) {
      return users[user];
    }
  }
  return false;
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
  const templateVars = { user_id: undefined };
  res.render("urls_new", templateVars);
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase, user_id: req.cookies.user_id };
  res.render("urls_index", templateVars);

});

app.get("/urls/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  const longURL = urlDatabase[shortURL];
  const templateVars = { shortURL, longURL };
  res.render("urls_show", templateVars);
});

app.post("/urls", (req, res) => {

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
  const templateVars = { user_id: undefined };
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
  urlDatabase[req.params.id] = req.body.longUrl
  res.redirect('/urls')
})

// Handling user registration
app.get("/register", (req, res) => {
  const templateVars = { user_id: undefined };
  res.render("registration", templateVars);
})

app.post("/register", (req, res) => {
  if ((!req.body.email) || (!req.body.password)) {
    return res.status(400).send("Uh oh, something went wrong: Error 404");
  }

  if (emailSearcher(req.body.email)) {
    return res.status(400).send("This email is already in use: Error 404");
  }
  // Create unique cookie value for user
  const currentUserId = generateRandomId();
  users[currentUserId] = { id: currentUserId, email: req.body.email, password: req.body.password };
  res.cookie("user_id", currentUserId);

  res.redirect("/urls");
})


// login and logout routes
app.post("/logout", (req, res) => {
  res.clearCookie("user_id")//
  res.send("Successful logout")//
})

app.get("/login", (req, res) => {
  const templateVars = { user_id: undefined };
  res.render("login", templateVars);
})

app.post("/login", (req, res) => {
  let email = req.body.email;
  let password = req.body.password;
  const result = emailSearcher(email);
  if ((result) && result.password === req.body.password) {
    res.cookie("user_id", result.id);
    return res.redirect("urls");
  }
  res.status(403).send("No user can be found at that email address");
  return res.redirect("/login");
})

