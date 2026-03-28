const {
  SlashCommandBuilder,
  InteractionContextType,
  EmbedBuilder,
  MessageFlags,
} = require("discord.js");
const { fetchUrl } = require("../functions/fetchUrl");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("meow")
    .setDescription("You're a good catgirl :3")
    .setContexts(
      InteractionContextType.Guild,
      InteractionContextType.PrivateChannel,
    ),

  async execute(interaction) {
    const response = await fetchUrl("https://nekos.best/api/v2/nya");

    if (!response.ok || !response.data) {
      const errorEmbed = new EmbedBuilder()
        .setTitle("There's a problem... >_<")
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

    const result = response.data.results[0];

    const embed = new EmbedBuilder()
      .setTitle(`${interaction.user.displayName} meows :3`)
      .setDescription(`*Anime: ${result.anime_name}*`)
      .setImage(result.url)
      .setColor(0xe410d3)
      .setFooter({ text: "Provided by nekos.best" })
      .setTimestamp();

    return interaction.reply({ embeds: [embed] });
  },
};
