const {
  SlashCommandBuilder,
  InteractionContextType,
  EmbedBuilder,
  MessageFlags,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");
const { ACTIONS, ACTION_CHOICES } = require("../constants/actions");
const { fetchUrl } = require("../functions/fetchUrl");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("interact")
    .setDescription("Interact with others")
    .setContexts(
      InteractionContextType.Guild,
      InteractionContextType.PrivateChannel,
    )
    .addStringOption((option) =>
      option
        .setName("action")
        .setDescription("The action to do")
        .setRequired(true)
        .addChoices(ACTION_CHOICES),
    )
    .addUserOption((option) =>
      option.setName("user").setDescription("Target user").setRequired(true),
    ),

  async execute(interaction) {
    const chosenAction = interaction.options.getString("action", true);
    const target = interaction.options.getUser("user", true);

    let errorEmbed = new EmbedBuilder()
      .setTitle("❌ There's a problem... >_<")
      .setColor("Red")
      .setTimestamp();

    if (target.id === interaction.user.id) {
      errorEmbed.setDescription("You can't interact with yourself!!!");
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

    const embed = new EmbedBuilder()
      .setTitle(
        `${interaction.user.displayName} ${action.title} ${target.displayName}`,
      )
      .setColor(0xe410d3)
      .setDescription(`*Anime: ${result.anime_name}*`)
      .setImage(result.url)
      .setFooter({ text: "Provided by nekos.best" })
      .setTimestamp();

    const button = new ButtonBuilder()
      .setCustomId(`interact_back:${chosenAction}:${target.id}`)
      .setLabel(action.button)
      .setStyle(ButtonStyle.Secondary);

    const row = new ActionRowBuilder().addComponents(button);

    await interaction.reply({ embeds: [embed], components: [row] });
  },
};
