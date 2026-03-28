const fs = require("fs");
const path = require("path");

const file = path.join(__dirname, "../data/cooldowns.json");
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

function ensureCooldown(data, userId, commandName) {
  if (!data[userId]) {
    data[userId] = {};
  }

  if (!data[userId][commandName]) {
    data[userId][commandName] = Date.now();
  }
}

function setCooldown(userId, commandName, amount) {
  const data = load();
  ensureCooldown(data, userId, commandName);
  data[userId][commandName] = Date.now() + amount;
  save(data);
}

function getCooldown(userId, commandName) {
  const data = load();
  ensureCooldown(data, userId, commandName);
  return data[userId][commandName];
}

module.exports = { setCooldown, getCooldown };
