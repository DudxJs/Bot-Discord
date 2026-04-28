const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('conselho')
    .setDescription('Receba um conselho'),

  async execute(interaction) {
    try {
      const res = await fetch("https://api.adviceslip.com/advice");
      const data = await res.json();

      const embed = new EmbedBuilder()
        .setTitle("💡 Conselho")
        .setDescription(data.slip.advice)
        .setColor("Blue");

      await interaction.reply({ embeds: [embed] });
    } catch {
      await interaction.reply("❌ Erro ao buscar conselho.");
    }
  }
};
