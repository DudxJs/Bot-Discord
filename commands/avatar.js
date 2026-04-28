const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('avatar')
    .setDescription('Ver avatar de um usuário')
    .addUserOption(option =>
      option.setName('usuario')
        .setDescription('Escolha o usuário')
    ),

  async execute(interaction) {
    const user = interaction.options.getUser('usuario') || interaction.user;

    const embed = new EmbedBuilder()
      .setTitle(`📸 Avatar de ${user.username}`)
      .setImage(user.displayAvatarURL({ size: 1024 }))
      .setColor("Random");

    await interaction.reply({ embeds: [embed] });
  }
};
