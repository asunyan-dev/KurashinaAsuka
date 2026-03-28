const {
  SlashCommandBuilder,
  EmbedBuilder,
  InteractionContextType,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("gayness")
    .setDescription("Check the gayness of a user")
    .setContexts(
      InteractionContextType.Guild,
      InteractionContextType.PrivateChannel,
    )
    .addUserOption((option) =>
      option.setName("user").setDescription("Target user").setRequired(false),
    ),

  async execute(interaction) {
    let target = interaction.options.getUser("user", false);

    if (!target) target = interaction.user;

    const gaynessLevel = Math.floor(100 * (1 - Math.pow(Math.random(), 2)));

    const embed = new EmbedBuilder()
      .setTitle("🏳️‍🌈 Gayness")
      .setDescription(`<@${target.id}> is **${gaynessLevel}%** gay!`)
      .setThumbnail(target.displayAvatarURL({ size: 512 }))
      .setColor(0xe410d3)
      .setFooter({ text: "Source: Trust me, bro" })
      .setTimestamp();

    return interaction.reply({ embeds: [embed] });
  },
};
