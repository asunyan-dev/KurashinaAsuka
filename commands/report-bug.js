const {
  SlashCommandBuilder,
  InteractionContextType,
  EmbedBuilder,
  MessageFlags,
  ModalBuilder,
  ComponentType,
  TextInputStyle,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("report-bug")
    .setDescription("Report a bug to the dev")
    .setContexts(
      InteractionContextType.Guild,
      InteractionContextType.PrivateChannel,
    ),

  async execute(interaction) {
    const modal = new ModalBuilder()
      .setCustomId("report_bug")
      .setTitle("Bug Report")
      .addLabelComponents({
        type: ComponentType.Label,
        label: "Your message",
        description:
          "Describe the bug as much as possible. It will be sent to the developer.",
        component: {
          type: ComponentType.TextInput,
          custom_id: "message",
          style: TextInputStyle.Paragraph,
          placeholder: "Describe the bug here...",
          required: true,
        },
      });

    await interaction.showModal(modal);
  },
};
