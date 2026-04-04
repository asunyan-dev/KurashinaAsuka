const {
  SlashCommandBuilder,
  InteractionContextType,
  EmbedBuilder,
  MessageFlags,
} = require("discord.js");
const { fetchUrl } = require("../functions/fetchUrl");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("kitsune")
    .setDescription("Get a random foxgirl image")
    .setContexts(
      InteractionContextType.Guild,
      InteractionContextType.PrivateChannel,
    ),

  async execute(interaction) {
    let errorEmbed = new EmbedBuilder()
      .setTitle("❌ There's a problem... >_<")
      .setColor("Red")
      .setTimestamp();

    const res = await fetchUrl("https://nekos.best/api/v2/kitsune");

    if (!res.ok || !res.data) {
      errorEmbed.setDescription(
        "There was an error with the API, please try again later.",
      );
      return interaction.reply({
        embeds: [errorEmbed],
        flags: MessageFlags.Ephemeral,
      });
    }

    const result = res.data.results[0];

    const embed = new EmbedBuilder()
      .setTitle("🦊 Konkon~")
      .setColor(0xe410d3)
      .setDescription(
        `Artist: ${result.artist_name}\n[Source](${result.source_url})`,
      )
      .setImage(result.url)
      .setFooter({ text: "Provided by nekos.best" })
      .setTimestamp();

    return interaction.reply({ embeds: [embed] });
  },
};
