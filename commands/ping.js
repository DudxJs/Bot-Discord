const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Ver latência do bot'),

  async execute(interaction, client) {
    const embed = new EmbedBuilder()
      .setTitle("🏓 Pong!")
      .setDescription(`Ping: ${Math.round(client.ws.ping)}ms`)
      .setColor("Green");

    await interaction.reply({ embeds: [embed] });
  }
};
