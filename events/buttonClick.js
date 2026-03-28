const {
  Events,
  EmbedBuilder,
  MessageFlags,
  ActionRowBuilder,
  ButtonBuilder,
} = require("discord.js");
const { ACTIONS } = require("../constants/actions");
const { fetchUrl } = require("../functions/fetchUrl");

module.exports = {
  name: Events.InteractionCreate,

  async execute(interaction) {
    if (!interaction.isButton()) return;

    let errorEmbed = new EmbedBuilder()
      .setTitle("❌ There's a problem... >_<")
      .setColor("Red")
      .setTimestamp();

    if (interaction.customId.startsWith("interact_back")) {
      const [, chosenAction, originalTargetId] =
        interaction.customId.split(":");

      if (interaction.user.id !== originalTargetId) {
        errorEmbed.setDescription("This button is not for you!!!");
        return interaction.reply({
          embeds: [errorEmbed],
          flags: MessageFlags.Ephemeral,
        });
      }

      if (!(chosenAction in ACTIONS)) {
        errorEmbed.setDescription(
          "There was an unknown error, please try again later.",
        );
        console.log(`Missing action: ${chosenAction}`);
        return interaction.reply({
          embeds: [errorEmbed],
          flags: MessageFlags.Ephemeral,
        });
      }

      const action = ACTIONS[chosenAction];

      const response = await fetchUrl(
        `https://nekos.best/api/v2/${chosenAction}`,
      );

      if (!response.ok || !response.data) {
        errorEmbed.setDescription(
          "There was an error with the API, please try again later.",
        );
        return interaction.reply({
          embeds: [errorEmbed],
          flags: MessageFlags.Ephemeral,
        });
      }

      const result = response.data.results[0];

      const newTarget = interaction.message.interactionMetadata.user;

      const embed = new EmbedBuilder()
        .setTitle(
          `${interaction.user.displayName} ${action.title} ${newTarget.displayName} back`,
        )
        .setColor(0xe410d3)
        .setDescription(`*Anime: ${result.anime_name}*`)
        .setImage(result.url)
        .setFooter({ text: "Provided by nekos.best" })
        .setTimestamp();

      const row = new ActionRowBuilder().addComponents(
        ButtonBuilder.from(interaction.component).setDisabled(true),
      );

      await interaction.update({ components: [row] });
      await interaction.followUp({ embeds: [embed] });
    }
  },
};
