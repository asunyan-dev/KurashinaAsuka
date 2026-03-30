const {
  SlashCommandBuilder,
  InteractionContextType,
  PermissionFlagsBits,
  EmbedBuilder,
  MessageFlags,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("kick")
    .setDescription("Kick a member")
    .setContexts(InteractionContextType.Guild)
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
    .addUserOption((option) =>
      option.setName("user").setDescription("Target user").setRequired(true),
    )
    .addStringOption((option) =>
      option
        .setName("reason")
        .setDescription("Reason of the kick")
        .setRequired(false),
    ),

  async execute(interaction) {
    const user = interaction.options.getUser("user", true);
    const reason =
      interaction.options.getString("reason", false) || "No reason provided.";

    let errorEmbed = new EmbedBuilder()
      .setTitle("❌ There's a problem... >_<")
      .setColor("Red")
      .setTimestamp();

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

    if (
      !interaction.guild.members.me.permissions.has(
        PermissionFlagsBits.KickMembers,
      )
    ) {
      errorEmbed.setDescription(
        "I am missing `Kick Members` permission. Action Cancelled.",
      );
      return interaction.reply({
        embeds: [errorEmbed],
        flags: MessageFlags.Ephemeral,
      });
    }

    if (target.roles.highest.position >= author.roles.highest.position) {
      errorEmbed.setDescription(
        "You cannot kick someone with a higher role than you.",
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
        "I cannot kick someone with a higher role than me.",
      );
      return interaction.reply({
        embeds: [errorEmbed],
        flags: MessageFlags.Ephemeral,
      });
    }

    if (!target.kickable) {
      errorEmbed.setDescription("This member cannot be kicked.");
      return interaction.reply({
        embeds: [errorEmbed],
        flags: MessageFlags.Ephemeral,
      });
    }

    try {
      await member.kick({ reason: reason });
      const successEmbed = new EmbedBuilder()
        .setTitle("✅ Success")
        .setDescription(`<@${target.id}> was kicked with reason:\n${reason}`)
        .setColor("Green")
        .setTimestamp();
      return interaction.reply({
        embeds: [successEmbed],
        flags: MessageFlags.Ephemeral,
      });
    } catch (err) {
      errorEmbed.setDescription(
        "There was an error trying to kick that member. Please try again later.",
      );
      return interaction.reply({
        embeds: [errorEmbed],
        flags: MessageFlags.Ephemeral,
      });
    }
  },
};
