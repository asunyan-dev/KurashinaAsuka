const {
  SlashCommandBuilder,
  InteractionContextType,
  PermissionFlagsBits,
  EmbedBuilder,
  MessageFlags,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("unmute")
    .setDescription("Unmute a member")
    .setContexts(InteractionContextType.Guild)
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .addUserOption((option) =>
      option.setName("user").setDescription("Target user").setRequired(true),
    ),

  async execute(interaction) {
    const user = interaction.options.getUser("user", true);

    let errorEmbed = new EmbedBuilder()
      .setTitle("❌ There's a problem... >_<")
      .setColor("Red")
      .setTimestamp();

    if (
      !interaction.guild.members.me.permissions.has(
        PermissionFlagsBits.ModerateMembers,
      )
    ) {
      errorEmbed.setDescription("I am missing `Timeout Members` permission.");
      return interaction.reply({
        embeds: [errorEmbed],
        flags: MessageFlags.Ephemeral,
      });
    }

    const author = await interaction.guild.members
      .fetch(interaction.user.id)
      .catch(() => null);
    if (!author) {
      errorEmbed.setDescription(
        "There was an error trying to fetch your member info. Please try again later.",
      );
      return interaction.reply({
        embeds: [errorEmbed],
        flags: MessageFlags.Ephemeral,
      });
    }

    const target = await interaction.guild.members
      .fetch(user.id)
      .catch(() => null);
    if (!target) {
      errorEmbed.setDescription(
        "There was an error trying to fetch target info. Please try again later.",
      );
      return interaction.reply({
        embeds: [errorEmbed],
        flags: MessageFlags.Ephemeral,
      });
    }

    if (target.roles.highest.position >= author.roles.highest.position) {
      errorEmbed.setDescription(
        "You can't unmute someone with a higher role than you.",
      );
      return interaction.reply({
        embeds: [errorEmbed],
        flags: MessageFlags.Ephemeral,
      });
    }

    if (
      target.roles.highest.position >=
      interaction.guild.members.me.roles.highest.position
    ) {
      errorEmbed.setDescription(
        "I cannot unmute someone with a higher role than myself.",
      );
      return interaction.reply({
        embeds: [errorEmbed],
        flags: MessageFlags.Ephemeral,
      });
    }

    if (!target.moderatable) {
      errorEmbed.setDescription("This member cannot be unmuted.");
      return interaction.reply({
        embeds: [errorEmbed],
        flags: MessageFlags.Ephemeral,
      });
    }

    if (!target.isCommunicationDisabled()) {
      errorEmbed.setDescription("This member is not muted.");
      return interaction.reply({
        embeds: [errorEmbed],
        flags: MessageFlags.Ephemeral,
      });
    }

    try {
      await target.timeout(null);
      const successEmbed = new EmbedBuilder()
        .setTitle(`✅ Success`)
        .setDescription(`<@${target.id}> was unmuted.`)
        .setColor("Green")
        .setTimestamp();
      return interaction.reply({
        embeds: [successEmbed],
        flags: MessageFlags.Ephemeral,
      });
    } catch (err) {
      errorEmbed.setDescription(
        "There was an error trying to unmute that member. Please try again later.",
      );
      return interaction.reply({
        embeds: [errorEmbed],
        flags: MessageFlags.Ephemeral,
      });
    }
  },
};
