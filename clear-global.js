const { REST, Routes } = require("discord.js");
const config = require("./config.json");

const commands = [];

const rest = new REST({ version: "10" }).setToken(config.token);

(async () => {
  try {
    console.log("Clearing global commands...");

    await rest.put(Routes.applicationCommands(config.clientId), {
      body: commands,
    });

    console.log("Cleared global commands.");
  } catch (err) {
    console.error(err);
  }
})();
