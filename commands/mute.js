const {
  SlashCommandBuilder,
  InteractionContextType,
  PermissionFlagsBits,
  EmbedBuilder,
  MessageFlags,
} = require("discord.js");
const ms = require("ms");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("mute")
    .setDescription("Mute a member")
    .setContexts(InteractionContextType.Guild)
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .addUserOption((option) =>
      option.setName("user").setDescription("Target user").setRequired(true),
    )
    .addStringOption((option) =>
      option
        .setName("duration")
        .setDescription("Duration of mute, ex: 1 day")
        .setRequired(true),
    )
    .addStringOption((option) =>
      option
        .setName("reason")
        .setDescription("Reason of the mute")
        .setRequired(false),
    ),

  async execute(interaction) {
    const user = interaction.options.getUser("user", true);
    const stringDuration = interaction.options.getString("duration", true);
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
        "There was an error trying to fetch target info. Please try again later.",
      );
      return interaction.reply({
        embeds: [errorEmbed],
        flags: MessageFlags.Ephemeral,
      });
    }

    if (
      !interaction.guild.members.me.permissions.has(
        PermissionFlagsBits.ModerateMembers,
      )
    ) {
      errorEmbed.setDescription("I am missing `Timeout Members` permissions.");
      return interaction.reply({
        embeds: [errorEmbed],
        flags: MessageFlags.Ephemeral,
      });
    }

    if (target.roles.highest.position >= author.roles.highest.position) {
      errorEmbed.setDescription(
        "You can't mute someone with a higher role than you.",
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
        "I can't mute someone with a higher role than me.",
      );
      return interaction.reply({
        embeds: [errorEmbed],
        flags: MessageFlags.Ephemeral,
      });
    }

    if (!target.moderatable) {
      errorEmbed.setDescription("This member can't be muted.");
      return interaction.reply({
        embeds: [errorEmbed],
        flags: MessageFlags.Ephemeral,
      });
    }

    const duration = ms(stringDuration);

    try {
      await target.timeout(duration, reason);
      const successEmbed = new EmbedBuilder()
        .setTitle("✅ Success")
        .setColor("Green")
        .setDescription(
          `<@${target.id}> was muted for ${stringDuration}, with reason:\n${reason}`,
        )
        .setTimestamp();
      return interaction.reply({
        embeds: [successEmbed],
        flags: MessageFlags.Ephemeral,
      });
    } catch (err) {
      errorEmbed.setDescription(
        "There was an error trying to timeout that member. Please try again later.",
      );
      return interaction.reply({
        embeds: [errorEmbed],
        flags: MessageFlags.Ephemeral,
      });
    }
  },
};
