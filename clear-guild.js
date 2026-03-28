const { REST, Routes } = require("discord.js");
const config = require("./config.json");

const commands = [];

const rest = new REST({ version: "10" }).setToken(config.token);

(async () => {
  try {
    console.log("Clearing guild commands...");

    await rest.put(
      Routes.applicationGuildCommands(config.clientId, config.guildId),
      { body: commands },
    );

    console.log("Cleared guild commands.");
  } catch (err) {
    console.error(err);
  }
})();
