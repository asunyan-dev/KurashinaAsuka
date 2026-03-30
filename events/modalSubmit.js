const { Events, EmbedBuilder, MessageFlags } = require("discord.js");
const config = require("../config.json");

module.exports = {
  name: Events.InteractionCreate,

  async execute(interaction, client) {
    if (!interaction.isModalSubmit()) return;

    let errorEmbed = new EmbedBuilder()
      .setTitle("❌ There's a problem... >_<")
      .setColor("Red")
      .setTimestamp();

    if (interaction.customId === "report_bug") {
      const message = interaction.fields.getTextInputValue("message");

      const guild = await client.guilds.fetch(config.guildId).catch(() => null);
      if (!guild) {
        errorEmbed.setDescription(
          "There was an error, please try again later.",
        );
        console.log(`Failed fetching report guild.`);
        return interaction.reply({
          embeds: [errorEmbed],
          flags: MessageFlags.Ephemeral,
        });
      }

      const channel = await guild.channels
        .fetch(config.reportChannel)
        .catch(() => null);

      if (!channel) {
        errorEmbed.setDescription(
          "There was an error, please try again later.",
        );
        console.log(`Failed fetching report channel.`);
        return interaction.reply({
          embeds: [errorEmbed],
          flags: MessageFlags.Ephemeral,
        });
      }

      const embed = new EmbedBuilder()
        .setTitle("New bug report")
        .setAuthor({
          name: interaction.user.username,
          iconURL: interaction.user.displayAvatarURL({ size: 512 }),
        })
        .setDescription(message)
        .setTimestamp()
        .setColor(0xe410d3);

      const successEmbed = new EmbedBuilder()
        .setTitle("✅ Success")
        .setColor("Green")
        .setDescription("Message sent.")
        .setTimestamp();

      try {
        await channel.send({ embeds: [embed] });
        return interaction.reply({
          embeds: [successEmbed],
          flags: MessageFlags.Ephemeral,
        });
      } catch (err) {
        errorEmbed.setDescription(
          "There was an error, please try again later.",
        );
        console.log("Failed to send report message:", err);
        return interaction.reply({
          embeds: [errorEmbed],
          flags: MessageFlags.Ephemeral,
        });
      }
    }
  },
};
