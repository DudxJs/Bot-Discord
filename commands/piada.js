const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('piada')
    .setDescription('Receba uma piada aleatória'),

  async execute(interaction) {
    try {
      const res = await fetch("https://official-joke-api.appspot.com/random_joke");
      const data = await res.json();

      const embed = new EmbedBuilder()
        .setTitle("😂 Piada")
        .setDescription(`**${data.setup}**\n\n||${data.punchline}||`)
        .setColor("Yellow");

      await interaction.reply({ embeds: [embed] });
    } catch {
      await interaction.reply("❌ Erro ao buscar piada.");
    }
  }
};
