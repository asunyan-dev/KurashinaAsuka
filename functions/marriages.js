const { MessageReferenceType } = require("discord.js");
const fs = require("fs");
const path = require("path");

const file = path.join(__dirname, "../data/marriages.json");
if (!fs.existsSync(file)) {
  fs.writeFileSync(file, JSON.stringify({}, null, 2));
}

function load() {
  let data = JSON.parse(fs.readFileSync(file, "utf8"));
  return data;
}

function save(data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

function ensureUser(data, userId) {
  if (!data[userId]) {
    data[userId] = null;
  }
}

function marry(user1, user2) {
  const data = load();
  ensureUser(data, user1);
  ensureUser(data, user2);
  data[user1] = user2;
  data[user2] = user1;
  save(data);
}

function divorce(user1, user2) {
  const data = load();
  ensureUser(data, user1);
  ensureUser(data, user2);
  delete data[user1];
  delete data[user2];
  save(data);
}

function getMarriage(userId) {
  const data = load();
  ensureUser(data, userId);
  return data[userId];
}

module.exports = {
  marry,
  divorce,
  getMarriage,
};
