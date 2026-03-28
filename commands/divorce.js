const {
  SlashCommandBuilder,
  InteractionContextType,
  EmbedBuilder,
  MessageFlags,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
  ComponentType,
} = require("discord.js");
const { divorce, getMarriage } = require("../functions/marriages");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("divorce")
    .setDescription("Divorce with your partner")
    .setContexts(
      InteractionContextType.Guild,
      InteractionContextType.PrivateChannel,
    ),

  async execute(interaction) {
    let errorEmbed = new EmbedBuilder()
      .setTitle("❌ There's a problem... >_<")
      .setColor("Red")
      .setTimestamp();

    const authorMarry = getMarriage(interaction.user.id);

    if (!authorMarry) {
      errorEmbed.setDescription("You are not married.");
      return interaction.reply({
        embeds: [errorEmbed],
        flags: MessageFlags.Ephemeral,
      });
    }

    const embed = new EmbedBuilder()
      .setTitle("Divorce")
      .setDescription(
        `Are you sure you want to divorce with <@${authorMarry}>?`,
      )
      .setColor(0xe410d3)
      .setTimestamp();

    const yesButton = new ButtonBuilder()
      .setCustomId("yes_divorce")
      .setLabel("Yes")
      .setStyle(ButtonStyle.Success);

    const noButton = new ButtonBuilder()
      .setCustomId("no_divorce")
      .setLabel("No")
      .setStyle(ButtonStyle.Danger);

    const row = new ActionRowBuilder().addComponents(yesButton, noButton);

    const reply = await interaction.reply({
      embeds: [embed],
      components: [row],
    });

    const collector = reply.createMessageComponentCollector({
      componentType: ComponentType.Button,
      time: 60_000,
    });

    collector.on("collect", async (i) => {
      if (i.user.id !== interaction.user.id) {
        errorEmbed.setDescription("This button is not for you!!!");
        return i.reply({ embeds: [errorEmbed], flags: MessageFlags.Ephemeral });
      }

      if (i.customId === "yes_divorce") {
        const yesEmbed = new EmbedBuilder()
          .setTitle("✅ Success")
          .setDescription("You're successfully divorced now.")
          .setColor("Green")
          .setTimestamp();

        collector.stop("accepted");
        divorce(interaction.user.id, authorMarry);
        return i.update({ embeds: [yesEmbed], components: [] });
      }

      if (i.customId === "no_divorce") {
        const noEmbed = new EmbedBuilder()
          .setTitle("❌ Cancelled")
          .setDescription("You refused the divorce. Action cancelled.")
          .setColor("Red")
          .setTimestamp();

        collector.stop("denied");
        return i.update({ embeds: [noEmbed], components: [] });
      }
    });

    collector.on("end", async (_, reason) => {
      if (reason === "time") {
        const cancelEmbed = new EmbedBuilder()
          .setTitle("❌ Too late")
          .setDescription("You took too long to answer. Action Cancelled.")
          .setColor("Red")
          .setTimestamp();

        try {
          await interaction.editReply({
            embeds: [cancelEmbed],
            components: [],
          });
        } catch {}
      }
    });
  },
};
