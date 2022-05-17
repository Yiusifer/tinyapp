const express = require("express");
const res = require("express/lib/response");
const app = express();
const PORT = 7000; // default port 7000

const bodyParser = require("body-parser");
const { json } = require("express/lib/response");
const req = require("express/lib/request");
app.use(bodyParser.urlencoded({ extended: true }));


// Generate random short URL
function generateRandomString() {
  return Math.random().toString(36).slice(2, 8);
}


app.set("view engine", "ejs");


const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
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
  const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[1] };
  res.render("urls_show", templateVars);
});

app.post("/urls", (req, res) => {
  console.log(req.body);  // Log the POST request body to the console
  urlDatabase[shortURL] = [Object.values(req.body)];
  //console.log(urlDatabase)
});

// Redirects to corresponding long URL after receiving short URL
app.get("/u/:shortURL", (req, res) => {
  const longURL = res.redirect(urlDatabase[req.params.shortURL])
  res.redirect(longURL);
});

app.post("/urls/:shortURL/delete", (req, res) => {
  delete urlDatabase.shortURL;
  res.redirect("/urls");
})