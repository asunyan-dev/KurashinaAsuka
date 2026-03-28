const {
  SlashCommandBuilder,
  InteractionContextType,
  EmbedBuilder,
  MessageFlags,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ComponentType,
} = require("discord.js");
const { marry, getMarriage } = require("../functions/marriages");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("marry")
    .setDescription("Marry another user")
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

    if (target.id === interaction.user.id) {
      errorEmbed.setDescription("You can't marry yourself!!!");
      return interaction.reply({
        embeds: [errorEmbed],
        flags: MessageFlags.Ephemeral,
      });
    }

    const authorMarry = getMarriage(interaction.user.id);
    if (authorMarry) {
      errorEmbed.setDescription(
        "You're already married. Use the command `/divorce` before marrying someone else.",
      );
      return interaction.reply({
        embeds: [errorEmbed],
        flags: MessageFlags.Ephemeral,
      });
    }

    const targetMarry = getMarriage(target.id);
    if (targetMarry) {
      errorEmbed.setDescription("This user is already married.");
      return interaction.reply({
        embeds: [errorEmbed],
        flags: MessageFlags.Ephemeral,
      });
    }

    const embed = new EmbedBuilder()
      .setTitle("💍 You've got proposed!")
      .setDescription(
        `<@${target.id}>, <@${interaction.user.id}> wants to marry you. Do you accept?`,
      )
      .setColor(0xe410d3)
      .setTimestamp();

    const yesButton = new ButtonBuilder()
      .setCustomId("yes_marry")
      .setLabel("Yes")
      .setStyle(ButtonStyle.Success);

    const noButton = new ButtonBuilder()
      .setCustomId("no_marry")
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
      if (i.user.id !== target.id) {
        errorEmbed.setDescription("This button is not for you!!!");
        return i.reply({ embeds: [errorEmbed], flags: MessageFlags.Ephemeral });
      }

      if (i.customId === "yes_marry") {
        const yesEmbed = new EmbedBuilder()
          .setTitle("💍 Just married!")
          .setDescription(
            `<@${interaction.user.id}> and <@${target.id}> are now married!`,
          )
          .setColor("Green")
          .setTimestamp();

        collector.stop("accepted");
        marry(interaction.user.id, target.id);
        return i.update({ embeds: [yesEmbed], components: [] });
      }

      if (i.customId === "no_marry") {
        const noEmbed = new EmbedBuilder()
          .setTitle("😔 Sorry...")
          .setDescription(
            `<@${target.id}> denied <@${interaction.user.id}>'s proposal...`,
          )
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
          .setDescription(`<@${target.id}> took too long to answer.`)
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
