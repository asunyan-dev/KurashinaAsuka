const { Events, ActivityType } = require("discord.js");

module.exports = {
  name: Events.ClientReady,
  once: true,

  async execute(client) {
    console.log(`Connected as ${client.user.tag}`);

    client.user.setPresence({
      activities: [
        {
          type: ActivityType.Custom,
          name: "meow",
          state: "meow",
        },
      ],
      status: "online",
    });
  },
};
