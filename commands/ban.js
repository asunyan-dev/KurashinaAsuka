const {
  SlashCommandBuilder,
  InteractionContextType,
  PermissionFlagsBits,
  EmbedBuilder,
  MessageFlags,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ban")
    .setDescription("Ban a member")
    .setContexts(InteractionContextType.Guild)
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
    .addUserOption((option) =>
      option.setName("user").setDescription("Target user").setRequired(true),
    )
    .addStringOption((option) =>
      option
        .setName("reason")
        .setDescription("Reason for the ban")
        .setRequired(false),
    ),

  async execute(interaction) {
    const user = interaction.options.getUser("user", true);
    const reason =
      interaction.options.getString("reason") || "No reason provided.";

    let errorEmbed = new EmbedBuilder()
      .setTitle("❌ There's a problem... >_<")
      .setColor("Red")
      .setTimestamp();

    const author = await interaction.guild.members
      .fetch(interaction.user.id)
      .catch(() => null);
    if (!author) {
      errorEmbed.setDescription(
        "There was an error trying to fetch your member info, please try again later.",
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
        "There was an error trying to fetch the target user's info. Please try again later.",
      );
      return interaction.reply({
        embeds: [errorEmbed],
        flags: MessageFlags.Ephemeral,
      });
    }

    if (target.roles.highest.position >= author.roles.highest.position) {
      errorEmbed.setDescription(
        "You cannot ban someone with a higher role than you.",
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
        "I cannot ban this member. They have a higher role than me.",
      );
      return interaction.reply({
        embeds: [errorEmbed],
        flags: MessageFlags.Ephemeral,
      });
    }

    if (!target.bannable) {
      errorEmbed.setDescription("This member cannot be banned.");
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
        "I am missing the `Ban Members` permissions. I cannot perform the ban.",
      );
      return interaction.reply({
        embeds: [errorEmbed],
        flags: MessageFlags.Ephemeral,
      });
    }

    try {
      await target.ban({ reason: reason });
      const successEmbed = new EmbedBuilder()
        .setTitle("✅ Success")
        .setColor("Green")
        .setDescription(
          `<@${target.id}> was successfully banned with reason:\n*${reason}*`,
        )
        .setTimestamp();
      return interaction.reply({
        embeds: [successEmbed],
        flags: MessageFlags.Ephemeral,
      });
    } catch (error) {
      errorEmbed.setDescription(
        "There was an error trying to ban that member. Please try again later.",
      );
      return interaction.reply({
        embeds: [errorEmbed],
        flags: MessageFlags.Ephemeral,
      });
    }
  },
};
