const {
  SlashCommandBuilder,
  InteractionContextType,
  EmbedBuilder,
  MessageFlags,
} = require("discord.js");
const { fetchUrl } = require("../functions/fetchUrl");
const { LANGUAGES, LANG_CHOICES } = require("../constants/languages");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("translate")
    .setDescription("Translate text to a selected language")
    .setContexts(
      InteractionContextType.Guild,
      InteractionContextType.PrivateChannel,
    )
    .addStringOption((option) =>
      option
        .setName("text")
        .setDescription("The text to translate")
        .setRequired(true),
    )
    .addStringOption((option) =>
      option
        .setName("lang")
        .setDescription("The language to translate to")
        .setRequired(true)
        .addChoices(LANG_CHOICES),
    ),

  async execute(interaction) {
    const text = interaction.options.getString("text", true);
    const lang = interaction.options.getString("lang", true);

    let errorEmbed = new EmbedBuilder()
      .setTitle("❌ There's a problem... >_<")
      .setColor("Red")
      .setTimestamp();

    if (!(lang in LANGUAGES)) {
      errorEmbed.setDescription(
        "The language you've chosen couldn't be found. Please try again later.",
      );
      console.log(`Missing language: ${lang}`);
      return interaction.reply({
        embeds: [errorEmbed],
        flags: MessageFlags.Ephemeral,
      });
    }

    const lang_code = LANGUAGES[lang];

    const res = await fetchUrl(
      `https://api.popcat.xyz/v2/translate?to=${lang_code}&text=${encodeURIComponent(text)}`,
    );

    if (!res.ok || !res.data) {
      errorEmbed.setDescription(
        "There was an error with the API, please try again later.",
      );
      return interaction.reply({
        embeds: [errorEmbed],
        flags: MessageFlags.Ephemeral,
      });
    }

    if (res.data.error) {
      errorEmbed.setDescription(res.data.message.error);
      return interaction.reply({
        embeds: [errorEmbed],
        flags: MessageFlags.Ephemeral,
      });
    }

    const embed = new EmbedBuilder()
      .setTitle("Translation")
      .setColor(0xe410d3)
      .setDescription(
        `**Original text:**\n${text}\n\n**To ${lang}:**\n${res.data.message.translated}`,
      )
      .setFooter({ text: "Provided by PopCat API" })
      .setTimestamp();

    return interaction.reply({ embeds: [embed] });
  },
};
