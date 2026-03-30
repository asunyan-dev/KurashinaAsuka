const {
  SlashCommandBuilder,
  InteractionContextType,
  PermissionFlagsBits,
  EmbedBuilder,
  MessageFlags,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("unban")
    .setDescription("Unban a user")
    .setContexts(InteractionContextType.Guild)
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
    .addStringOption((option) =>
      option
        .setName("id")
        .setDescription("ID of the user to unban")
        .setRequired(true),
    ),

  async execute(interaction) {
    const targetId = interaction.options.getString("id", true);

    let errorEmbed = new EmbedBuilder()
      .setTitle("❌ There's a problem... >_<")
      .setColor("Red")
      .setTimestamp();

    const ban = await interaction.guild.bans.fetch(targetId).catch(() => null);

    if (!ban) {
      errorEmbed.setDescription("Couldn't fetch ban. Is the user banned?");
      return interaction.reply({
        embeds: [errorEmbed],
        flags: MessageFlags.Ephemeral,
      });
    }

    if (
      !interaction.guild.members.me.permissions.has(
        PermissionFlagsBits.BanMembers,
      )
    ) {
      errorEmbed.setDescription(
        "I cannot unban this member, I miss `Ban Members` permission.",
      );
      return interaction.reply({
        embeds: [errorEmbed],
        flags: MessageFlags.Ephemeral,
      });
    }

    try {
      await interaction.guild.bans.remove(targetId);
      const successEmbed = new EmbedBuilder()
        .setTitle("✅ Success")
        .setDescription(`<@${targetId}> was successfully unbanned.`)
        .setColor("Green")
        .setTimestamp();
      return interaction.reply({
        embeds: [successEmbed],
        flags: MessageFlags.Ephemeral,
      });
    } catch (err) {
      errorEmbed.setDescription(
        "Failed to unban user. Please try again later.",
      );
      return interaction.reply({
        embeds: [errorEmbed],
        flags: MessageFlags.Ephemeral,
      });
    }
  },
};
