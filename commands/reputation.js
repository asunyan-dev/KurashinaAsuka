const {
  SlashCommandBuilder,
  InteractionContextType,
  EmbedBuilder,
  MessageFlags,
} = require("discord.js");
const { addReputation, getReputation } = require("../functions/reputation");
const { getCooldown, setCooldown } = require("../functions/cooldowns");
const ms = require("ms");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("reputation")
    .setDescription("Give a reputation point to a user")
    .setContexts(
      InteractionContextType.Guild,
      InteractionContextType.PrivateChannel,
    )
    .addUserOption((option) =>
      option.setName("user").setDescription("Target user").setRequired(true),
    ),

  async execute(interaction) {
    const target = interaction.options.getUser("user", true);

    let errorEmbed = new EmbedBuilder()
      .setTitle("❌ There's a problem... >_<")
      .setColor("Red")
      .setTimestamp();

    const cooldown = getCooldown(interaction.user.id, "reputation");

    if (Date.now() < cooldown) {
      errorEmbed.setDescription(
        `You're on cooldown! You can use that command again <t:${Math.floor(cooldown / 1000)}:R>`,
      );
      return interaction.reply({
        embeds: [errorEmbed],
        flags: MessageFlags.Ephemeral,
      });
    }

    if (target.id === interaction.user.id) {
      errorEmbed.setDescription(
        "You cannot give a reputation point to yourself!",
      );
      return interaction.reply({
        embeds: [errorEmbed],
        flags: MessageFlags.Ephemeral,
      });
    }

    const repCount = getReputation(target.id) ?? 0;

    const newRepCount = repCount + 1;

    const embed = new EmbedBuilder()
      .setDescription(
        `You've given a reputation point to <@${target.id}>. They now have \`${newRepCount}\` reputation points!`,
      )
      .setColor(0xe410d3)
      .setThumbnail(target.displayAvatarURL({ size: 512 }))
      .setTimestamp();

    addReputation(target.id);

    setCooldown(interaction.user.id, "reputation", ms("1 day"));

    return interaction.reply({ embeds: [embed] });
  },
};
