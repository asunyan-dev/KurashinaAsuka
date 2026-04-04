const {
  SlashCommandBuilder,
  InteractionContextType,
  EmbedBuilder,
  MessageFlags,
} = require("discord.js");
const { fetchUrl } = require("../functions/fetchUrl");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("coffee")
    .setDescription("Get a random coffee picture")
    .setContexts(
      InteractionContextType.Guild,
      InteractionContextType.PrivateChannel,
    ),

  async execute(interaction) {
    const res = await fetchUrl("https://coffee.alexflipnote.dev/random.json");

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
      .setTitle("☕ It's coffee time!")
      .setColor(0xe410d3)
      .setImage(res.data.file)
      .setFooter({ text: "Provided by AlexFlipNote API" })
      .setTimestamp();

    return interaction.reply({ embeds: [embed] });
  },
};
