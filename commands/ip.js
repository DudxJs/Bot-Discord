const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ip')
    .setDescription('Ver informações de um IP')
    .addStringOption(option =>
      option.setName('ip')
        .setDescription('Digite o IP')
        .setRequired(true)
    ),

  async execute(interaction) {
    const ip = interaction.options.getString('ip');

    try {
      const res = await fetch(`http://ip-api.com/json/${ip}`);
      const data = await res.json();

      if (data.status === "fail") {
        return interaction.reply("❌ IP inválido.");
      }

      const embed = new EmbedBuilder()
        .setTitle("🌍 Informações do IP")
        .addFields(
          { name: "IP", value: ip, inline: true },
          { name: "País", value: data.country || "N/A", inline: true },
          { name: "Cidade", value: data.city || "N/A", inline: true },
          { name: "ISP", value: data.isp || "N/A" }
        )
        .setColor("Purple");

      await interaction.reply({ embeds: [embed] });
    } catch {
      await interaction.reply("❌ Erro ao buscar IP.");
    }
  }
};
