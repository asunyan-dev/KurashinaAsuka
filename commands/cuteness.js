const {
  SlashCommandBuilder,
  EmbedBuilder,
  InteractionContextType,
  MessageFlags,
} = require("discord.js");
const ms = require("ms");
const { setCooldown, getCooldown } = require("../functions/cooldowns");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("cuteness")
    .setDescription("Check your daily cuteness level")
    .setContexts(
      InteractionContextType.Guild,
      InteractionContextType.PrivateChannel,
    ),

  async execute(interaction) {
    const cooldown = getCooldown(interaction.user.id, "cuteness");

    if (Date.now() < cooldown) {
      const errorEmbed = new EmbedBuilder()
        .setTitle("❌ There's a problem...")
        .setDescription(
          `You're on cooldown!! You can use this command again <t:${Math.floor(cooldown / 1000)}:R>!`,
        )
        .setColor("Red")
        .setTimestamp();

      return interaction.reply({
        embeds: [errorEmbed],
        flags: MessageFlags.Ephemeral,
      });
    }

    let cutenessLevel = Math.floor(100 * (1 - Math.pow(Math.random(), 2)));

    let phrase;

    if (cutenessLevel <= 20) {
      phrase = "😞 You're not very cute today... But tomorrow is another day!";
    } else if (cutenessLevel <= 50) {
      phrase =
        "😕 Could be cuter, to be honest... I'm sure you'll be super cute tomorrow!";
    } else if (cutenessLevel <= 80) {
      phrase =
        "☺️ You look pretty cute today! But I bet tomorrow it's gonna be better!";
    } else if (cutenessLevel <= 95) {
      phrase = "🥰 You're super cute today!!! Keep it up >.<";
    } else {
      phrase = "😍 You're so cute today wow!!! I'm melting!";
    }

    const embed = new EmbedBuilder()
      .setTitle("🎀 Your daily cuteness level")
      .setDescription(`**Cuteness level:** ${cutenessLevel}%\n\n${phrase}`)
      .setThumbnail(interaction.user.displayAvatarURL({ size: 512 }))
      .setColor(0xe410d3)
      .setTimestamp();

    setCooldown(interaction.user.id, "cuteness", ms("1 day"));

    return interaction.reply({ embeds: [embed] });
  },
};
