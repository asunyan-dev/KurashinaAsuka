const {
  SlashCommandBuilder,
  InteractionContextType,
  EmbedBuilder,
} = require("discord.js");
const { getMarriage } = require("../functions/marriages");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("relationship")
    .setDescription("See if you're married or not")
    .setContexts(
      InteractionContextType.Guild,
      InteractionContextType.PrivateChannel,
    ),

  async execute(interaction) {
    const authorMarry = getMarriage(interaction.user.id);

    const embed = new EmbedBuilder()
      .setTitle("💍 Marriage Status")
      .setThumbnail(interaction.user.displayAvatarURL({ size: 512 }))
      .setColor(0xe410d3)
      .setDescription(
        `<@${interaction.user.id}> ${authorMarry ? `is married with <@${authorMarry}>` : "is not married"}.`,
      )
      .setTimestamp();

    return interaction.reply({ embeds: [embed] });
  },
};
