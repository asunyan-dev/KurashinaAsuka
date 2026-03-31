const {
  SlashCommandBuilder,
  InteractionContextType,
  EmbedBuilder,
  MessageFlags,
} = require("discord.js");
const { setAfk, getAfk, removeAfk } = require("../functions/afk");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("afk")
    .setDescription("Manage your afk status")
    .setContexts(InteractionContextType.Guild)
    .addSubcommand((sub) =>
      sub
        .setName("set")
        .setDescription("Set your afk status")
        .addStringOption((option) =>
          option
            .setName("message")
            .setDescription("Your afk message")
            .setRequired(false),
        ),
    )
    .addSubcommand((sub) =>
      sub
        .setName("edit")
        .setDescription("Edit your afk message")
        .addStringOption((option) =>
          option
            .setName("message")
            .setDescription("Your new afk message")
            .setRequired(true),
        ),
    )
    .addSubcommand((sub) =>
      sub.setName("remove").setDescription("Remove your afk status"),
    ),

  async execute(interaction) {
    const sub = interaction.options.getSubcommand();

    let errorEmbed = new EmbedBuilder()
      .setTitle("❌ There's a problem... >_<")
      .setColor("Red")
      .setTimestamp();

    let successEmbed = new EmbedBuilder()
      .setTitle("✅ Success!")
      .setColor("Green")
      .setTimestamp();

    const afkStatus = getAfk(interaction.user.id);

    if (sub === "set") {
      if (afkStatus) {
        errorEmbed.setDescription(
          "You're already AFK!\n\n**Tip**: You wanna edit your AFK message? run `/afk edit`!",
        );
        return interaction.reply({
          embeds: [errorEmbed],
          flags: MessageFlags.Ephemeral,
        });
      }

      const message = interaction.options.getString("message", false) || "AFK";

      setAfk(interaction.user.id, message);

      successEmbed.setDescription(`You're now AFK! Your message:\n${message}`);
      return interaction.reply({
        embeds: [successEmbed],
        flags: MessageFlags.Ephemeral,
      });
    }

    if (sub === "edit") {
      if (!afkStatus) {
        errorEmbed.setDescription(
          "You're not AFK!\n**Tip:** Run `/afk set` to set your AFK status.",
        );
        return interaction.reply({
          embeds: [errorEmbed],
          flags: MessageFlags.Ephemeral,
        });
      }

      const message = interaction.options.getString("message", true);

      setAfk(interaction.user.id, message);

      successEmbed.setDescription(`AFK message edited to:\n${message}`);
      return interaction.reply({
        embeds: [successEmbed],
        flags: MessageFlags.Ephemeral,
      });
    }

    if (sub === "remove") {
      if (!afkStatus) {
        errorEmbed.setDescription("You were not AFK!!");
        return interaction.reply({
          embeds: [errorEmbed],
          flags: MessageFlags.Ephemeral,
        });
      }

      removeAfk(interaction.user.id);

      successEmbed.setDescription("Removed your AFK status.");
      return interaction.reply({
        embeds: [successEmbed],
        flags: MessageFlags.Ephemeral,
      });
    }
  },
};
