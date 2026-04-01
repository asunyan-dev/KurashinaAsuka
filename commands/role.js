const {
  SlashCommandBuilder,
  EmbedBuilder,
  MessageFlags,
  InteractionContextType,
  PermissionFlagsBits,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("role")
    .setDescription("Add/Remove a role to a member")
    .setContexts(InteractionContextType.Guild)
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles)
    .addSubcommand((sub) =>
      sub
        .setName("add")
        .setDescription("Add a role to a member")
        .addUserOption((option) =>
          option
            .setName("user")
            .setDescription("Target user")
            .setRequired(true),
        )
        .addRoleOption((option) =>
          option
            .setName("role")
            .setDescription("The role to add")
            .setRequired(true),
        ),
    )
    .addSubcommand((sub) =>
      sub
        .setName("remove")
        .setDescription("Remove a role from a member")
        .addUserOption((option) =>
          option
            .setName("user")
            .setDescription("Target user")
            .setRequired(true),
        )
        .addRoleOption((option) =>
          option
            .setName("role")
            .setDescription("The role to remove")
            .setRequired(true),
        ),
    ),

  async execute(interaction) {
    const sub = interaction.options.getSubcommand();

    let errorEmbed = new EmbedBuilder()
      .setTitle("❌ There's a problem... >_<")
      .setColor("Red")
      .setTimestamp();

    let successEmbed = new EmbedBuilder()
      .setTitle("✅ Success")
      .setColor("Green")
      .setTimestamp();

    const user = interaction.options.getUser("user", true);
    const role = interaction.options.getRole("role", true);

    if (
      !interaction.guild.members.me.permissions.has(
        PermissionFlagsBits.ManageRoles,
      )
    ) {
      errorEmbed.setDescription("I am missing `Manage Roles` permission.");
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
        "There was an error trying to fetch the target user's info. Please try again later.",
      );
      return interaction.reply({
        embeds: [errorEmbed],
        flags: MessageFlags.Ephemeral,
      });
    }

    if (sub === "add") {
      if (author.roles.highest.position <= role.position) {
        errorEmbed.setDescription(
          "You cannot give a role that is either your highest role or higher than it.",
        );
        return interaction.reply({
          embeds: [errorEmbed],
          flags: MessageFlags.Ephemeral,
        });
      }

      if (
        interaction.guild.members.me.roles.highest.position <= role.position
      ) {
        errorEmbed.setDescription(
          "I cannot give a role that is either my highest role or higher than it.",
        );
        return interaction.reply({
          embeds: [errorEmbed],
          flags: MessageFlags.Ephemeral,
        });
      }

      try {
        await target.roles.add(role);
        successEmbed.setDescription(
          `Given <@${target.id}> the <@&${role.id}> role.`,
        );
        return interaction.reply({
          embeds: [successEmbed],
          flags: MessageFlags.Ephemeral,
        });
      } catch (err) {
        errorEmbed.setDescription(
          "Failed to give the role to the member. Please try again later.",
        );
        return interaction.reply({
          embeds: [errorEmbed],
          flags: MessageFlags.Ephemeral,
        });
      }
    }

    if (sub === "remove") {
      if (author.roles.highest.position <= role.position) {
        errorEmbed.setDescription(
          "You cannot remove a role that is either your highest role or higher than it.",
        );
        return interaction.reply({
          embeds: [errorEmbed],
          flags: MessageFlags.Ephemeral,
        });
      }

      if (
        interaction.guild.members.me.roles.highest.position <= role.position
      ) {
        errorEmbed.setDescription(
          "I cannot remove a role that is either my highest role or higher than it.",
        );
        return interaction.reply({
          embeds: [errorEmbed],
          flags: MessageFlags.Ephemeral,
        });
      }

      try {
        await target.roles.remove(role);

        successEmbed.setDescription(
          `<@&${role.id}> was successfully removed from <@${target.id}>.`,
        );
        return interaction.reply({
          embeds: [successEmbed],
          flags: MessageFlags.Ephemeral,
        });
      } catch (err) {
        errorEmbed.setDescription(
          "There was an error trying to remove the role from member. Please try again later.",
        );
        return interaction.reply({
          embeds: [errorEmbed],
          flags: MessageFlags.Ephemeral,
        });
      }
    }
  },
};
