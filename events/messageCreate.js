const { Events, EmbedBuilder } = require("discord.js");
const { getAfk, removeAfk } = require("../functions/afk");

module.exports = {
  name: Events.MessageCreate,

  async execute(message) {
    if (message.author.bot) return;

    if (!message.guild) return;

    const authorAfk = getAfk(message.author.id);

    if (afkStatus) {
      const embed = new EmbedBuilder()
        .setTitle("👋 Welcome back!")
        .setDescription("I removed your AFK status.")
        .setColor(0xe410d3)
        .setTimestamp();

      message.reply({ embeds: [embed] });
    }

    if (message.mentions.users > 0) {
      message.mentions.users.forEach((user) => {
        const afkStatus = getAfk(user.id);

        if (afkStatus) {
          const embed = new EmbedBuilder()
            .setTitle("Hey there!")
            .setDescription(`<@${user.id}> is AFK:\n${afkStatus}`)
            .setColor(0xe410d3)
            .setTimestamp();

          message.reply({ embeds: [embed] });
        }
      });
    }
  },
};
