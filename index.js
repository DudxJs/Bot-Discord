require('dotenv').config();

const { 
  Client, 
  GatewayIntentBits, 
  EmbedBuilder 
} = require('discord.js');

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

client.once('ready', () => {
  console.log(`✅ Bot online como ${client.user.tag}`);
});

// 🔥 Slash Commands
client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  // 🏓 Ping
  if (interaction.commandName === 'ping') {
    const embed = new EmbedBuilder()
      .setTitle("🏓 Pong!")
      .setDescription(`API: ${Math.round(client.ws.ping)}ms`)
      .setColor("Green");

    return interaction.reply({ embeds: [embed] });
  }

  // 😂 Piada
  if (interaction.commandName === 'piada') {
    const res = await fetch("https://official-joke-api.appspot.com/random_joke");
    const data = await res.json();

    const embed = new EmbedBuilder()
      .setTitle("😂 Piada")
      .setDescription(`**${data.setup}**\n\n||${data.punchline}||`)
      .setColor("Yellow");

    return interaction.reply({ embeds: [embed] });
  }

  // 💡 Conselho
  if (interaction.commandName === 'conselho') {
    const res = await fetch("https://api.adviceslip.com/advice");
    const data = await res.json();

    const embed = new EmbedBuilder()
      .setTitle("💡 Conselho")
      .setDescription(data.slip.advice)
      .setColor("Blue");

    return interaction.reply({ embeds: [embed] });
  }

  // 🌍 IP
  if (interaction.commandName === 'ip') {
    const ip = interaction.options.getString('ip');

    const res = await fetch(`http://ip-api.com/json/${ip}`);
    const data = await res.json();

    const embed = new EmbedBuilder()
      .setTitle("🌍 IP Info")
      .addFields(
        { name: "IP", value: ip, inline: true },
        { name: "País", value: data.country || "N/A", inline: true },
        { name: "Cidade", value: data.city || "N/A", inline: true }
      )
      .setColor("Purple");

    return interaction.reply({ embeds: [embed] });
  }

  // 🖼️ Avatar
  if (interaction.commandName === 'avatar') {
    const user = interaction.options.getUser('usuario') || interaction.user;

    const embed = new EmbedBuilder()
      .setTitle(`Avatar de ${user.username}`)
      .setImage(user.displayAvatarURL({ size: 1024 }))
      .setColor("Random");

    return interaction.reply({ embeds: [embed] });
  }

});

client.login(process.env.TOKEN);
