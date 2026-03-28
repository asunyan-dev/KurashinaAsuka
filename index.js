process.on("unhandledRejection", (reason, promise) => {
  console.log("Unhandled Promise Rejection:", reason);
});

process.on("uncaughtException", (error) => {
  console.log("Uncaught Exception:", error);
});

const { Client, Collection, GatewayIntentBits } = require("discord.js");
const fs = require("fs");
const path = require("path");
const config = require("./config.json");

const dataDir = path.join(__dirname, "data");
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.commands = new Collection();

const commandsPath = path.join(__dirname, "commands");
const commandFiles = fs.existsSync(commandsPath)
  ? fs.readdirSync(commandsPath).filter((f) => f.endsWith(".js"))
  : [];

for (const file of commandFiles) {
  const command = require(path.join(commandsPath, file));

  if ("data" in command && "execute" in command) {
    client.commands.set(command.data.name, command);
  } else {
    console.warn(
      `[WARNING] - The command at ${file} is missing data or execute.`,
    );
  }
}

const eventsPath = path.join(__dirname, "events");
const eventFiles = fs.readdirSync(eventsPath).filter((f) => f.endsWith(".js"));

for (const file of eventFiles) {
  const event = require(path.join(eventsPath, file));

  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args, client));
  } else {
    client.on(event.name, (...args) => event.execute(...args, client));
  }
}

client.login(config.token);
