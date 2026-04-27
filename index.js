// index.js
require('dotenv').config();
const { Client, GatewayIntentBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType } = require('discord.js');

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once('ready', () => {
  console.log(`✅ Bot online como ${client.user.tag}`);
});

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const { commandName } = interaction;

  // 🏓 Ping
  if (commandName === 'ping') {
    await interaction.reply({ content: `Pong! 🏓 Latência: ${Math.round(client.ws.ping)}ms`, ephemeral: true });
  }

  // 😂 Piada
  if (commandName === 'piada') {
    const fetchJoke = async () => {
      const res = await fetch("https://official-joke-api.appspot.com/random_joke");
      return await res.json();
    };

    let data = await fetchJoke();
    const embed = new EmbedBuilder()
      .setTitle("😂 Piada do dia")
      .setDescription(`**${data.setup}**\n\n||${data.punchline}||`)
      .setColor("#FFD700");

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setCustomId('nova_piada').setLabel('Outra Piada').setStyle(ButtonStyle.Primary).setEmoji('🔄')
    );

    const response = await interaction.reply({ embeds: [embed], components: [row], fetchReply: true });

    const collector = response.createMessageComponentCollector({ componentType: ComponentType.Button, time: 60000 });
    collector.on('collect', async (i) => {
      if (i.user.id !== interaction.user.id) return i.reply({ content: "❌ Só quem pediu pode clicar!", ephemeral: true });
      data = await fetchJoke();
      await i.update({ embeds: [EmbedBuilder.from(embed).setDescription(`**${data.setup}**\n\n||${data.punchline}||`)] });
    });
  }

  // 💡 Conselho
  if (commandName === 'conselho') {
    const res = await fetch("https://api.adviceslip.com/advice");
    const data = await res.json();
    await interaction.reply({ embeds: [new EmbedBuilder().setTitle("💡 Conselho").setDescription(data.slip.advice).setColor("#00BFFF")] });
  }

  // 🌍 IP
  if (commandName === 'ip') {
    const ip = interaction.options.getString('ip');
    await interaction.deferReply();
    try {
      const res = await fetch(`http://ip-api.com/json/${ip}`);
      const data = await res.json();
      if (data.status === "fail") return interaction.editReply("❌ IP inválido.");
      
      const embed = new EmbedBuilder()
        .setTitle("🌍 Informações")
        .addFields({ name: "IP", value: ip }, { name: "País", value: data.country || "N/A" });
      await interaction.editReply({ embeds: [embed] });
    } catch {
      await interaction.editReply("❌ Erro.");
    }
  }

  // 🖼️ Avatar
  if (commandName === 'avatar') {
    const user = interaction.options.getUser('user') || interaction.user;
    await interaction.reply({ embeds: [new EmbedBuilder().setTitle(user.username).setImage(user.displayAvatarURL({ size: 1024 }))] });
  }

  // 📋 Help
  if (commandName === 'help') {
    await interaction.reply("Aqui estão meus comandos: `/ping`, `/piada`, `/conselho`, `/ip`, `/avatar`");
  }
});

client.login(process.env.TOKEN);
