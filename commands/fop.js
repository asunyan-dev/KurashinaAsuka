const {
  SlashCommandBuilder,
  InteractionContextType,
  EmbedBuilder,
  MessageFlags,
} = require("discord.js");
const { fetchUrl } = require("../functions/fetchUrl");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("fop")
    .setDescription("Get a random fox image")
    .setContexts(
      InteractionContextType.Guild,
      InteractionContextType.PrivateChannel,
    ),

  async execute(interaction) {
    const res = await fetchUrl("https://randomfox.ca/floof");

    if (!res.ok || !res.data) {
      const errorEmbed = new EmbedBuilder()
        .setTitle("❌ There's a problem... >_<")
        .setColor("Red")
        .setDescription(
          "There was an error with the API, please try again later.",
        )
        .setTimestamp();

      return interaction.reply({
        embeds: [errorEmbed],
        flags: MessageFlags.Ephemeral,
      });
    }

    const embed = new EmbedBuilder()
      .setTitle("🦊 Fox")
      .setImage(res.data.image)
      .setColor(0xe410d3)
      .setFooter({ text: "Provided by randomfox.ca" })
      .setTimestamp();

    return interaction.reply({ embeds: [embed] });
  },
};
