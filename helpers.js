// Searches for existing email in database
function emailSearcher(userEmail, database) {
  for (const user in database) {
    if (database[user].email === userEmail) {
      return database[user];
    }
  }
  return false;
}

// Generate random short URL/userId
function generateRandomString() {
  return Math.random().toString(36).slice(2, 8);
}

module.exports = {emailSearcher, generateRandomString}