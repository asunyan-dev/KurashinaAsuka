const { Events, EmbedBuilder, MessageFlags } = require("discord.js");

module.exports = {
  name: Events.InteractionCreate,

  async execute(interaction, client) {
    if (!interaction.isChatInputCommand()) return;

    const command = client.commands.get(interaction.commandName);

    if (!command) return;

    try {
      await command.execute(interaction);
    } catch (error) {
      const errorEmbed = new EmbedBuilder()
        .setTitle("❌ There's a problem... >_<")
        .setColor(0xe410d3)
        .setDescription("There was an error trying to execute this command!")
        .setTimestamp();

      if (interaction.replied || interaction.deferred) {
        await interaction.followUp({
          embeds: [errorEmbed],
          flags: MessageFlags.Ephemeral,
        });
      } else {
        await interaction.reply({
          embeds: [errorEmbed],
          flags: MessageFlags.Ephemeral,
        });
      }
    }
  },
};
