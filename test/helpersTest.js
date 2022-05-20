const { assert, expect } = require('chai');

const { emailSearcher } = require('../helpers.js');

const testUsers = {
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

describe('getUserByEmail', function() {

  it('should return a user with valid email', function() {
    const user = emailSearcher("user@example.com", testUsers)
    const expectedUserID = "userRandomID";
    assert(user.email) === (expectedUserID);
  });

  it ('should return false for a non-existant email', function() {
    const user = emailSearcher("user15@example.com", testUsers);
    const expectedOutput = "false"
    expect(user).to.deep.equal(false)
  })
});