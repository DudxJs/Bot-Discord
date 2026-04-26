require('dotenv').config();

const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const https = require('https');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

const prefix = "!";

// 🔗 Função para pegar API
function getJSON(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = "";

      res.on("data", chunk => data += chunk);
      res.on("end", () => {
        try {
          resolve(JSON.parse(data));
        } catch {
          reject("Erro ao ler JSON");
        }
      });
    }).on("error", err => reject(err));
  });
}

// 🚀 Bot pronto
client.once('clientReady', () => {
  console.log(`Bot online como ${client.user.tag}`);
});

// 💬 Comandos
client.on('messageCreate', async (message) => {
  if (message.author.bot) return;
  if (!message.content.startsWith(prefix)) return;

  const args = message.content.slice(prefix.length).trim().split(" ");
  const cmd = args.shift().toLowerCase();

  // 🏓 Ping
  if (cmd === "ping") {
    const embed = new EmbedBuilder()
      .setTitle("🏓 Pong!")
      .setDescription("O bot está online e funcionando!")
      .setColor("Green");

    return message.reply({ embeds: [embed] });
  }

  // 😂 Piada
  if (cmd === "piada") {
    try {
      const data = await getJSON("https://official-joke-api.appspot.com/random_joke");

      const embed = new EmbedBuilder()
        .setTitle("😂 Piada do dia")
        .setDescription(`**${data.setup}**\n\n||${data.punchline}||`)
        .setColor("Yellow");

      return message.reply({ embeds: [embed] });
    } catch {
      return message.reply("Erro ao buscar piada 😢");
    }
  }

  // 💡 Conselho
  if (cmd === "conselho") {
    try {
      const data = await getJSON("https://api.adviceslip.com/advice");

      const embed = new EmbedBuilder()
        .setTitle("💡 Conselho")
        .setDescription(data.slip.advice)
        .setColor("Blue");

      return message.reply({ embeds: [embed] });
    } catch {
      return message.reply("Erro ao buscar conselho 😢");
    }
  }

  // 🌍 IP
  if (cmd === "ip") {
    const ip = args[0];
    if (!ip) {
      return message.reply("Use: !ip 8.8.8.8");
    }

    try {
      const data = await getJSON(`http://ip-api.com/json/${ip}`);

      const embed = new EmbedBuilder()
        .setTitle("🌍 Informações do IP")
        .addFields(
          { name: "IP", value: ip, inline: true },
          { name: "País", value: data.country || "N/A", inline: true },
          { name: "Cidade", value: data.city || "N/A", inline: true },
          { name: "Provedor", value: data.isp || "N/A", inline: false }
        )
        .setColor("Purple");

      return message.reply({ embeds: [embed] });
    } catch {
      return message.reply("Erro ao buscar IP 😢");
    }
  }

  // 🖼️ Avatar
  if (cmd === "avatar") {
    const user = message.mentions.users.first() || message.author;

    const embed = new EmbedBuilder()
      .setTitle(`🖼️ Avatar de ${user.username}`)
      .setImage(user.displayAvatarURL({ dynamic: true, size: 512 }))
      .setColor("Random");

    return message.reply({ embeds: [embed] });
  }

  // 📋 Help (menu bonito)
  if (cmd === "help") {
    const embed = new EmbedBuilder()
      .setTitle("📋 Comandos do Bot")
      .setDescription("Aqui estão os comandos disponíveis:")
      .addFields(
        { name: "!ping", value: "Verifica se o bot está online", inline: true },
        { name: "!piada", value: "Mostra uma piada aleatória", inline: true },
        { name: "!conselho", value: "Receba um conselho", inline: true },
        { name: "!ip", value: "Info de IP (ex: !ip 8.8.8.8)", inline: false },
        { name: "!avatar", value: "Mostra seu avatar", inline: true }
      )
      .setColor("Aqua");

    return message.reply({ embeds: [embed] });
  }

});

// 🔐 Login seguro
client.login(process.env.TOKEN);
