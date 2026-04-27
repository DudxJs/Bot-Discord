require('dotenv').config();

const { 
  Client, 
  GatewayIntentBits, 
  EmbedBuilder, 
  ActionRowBuilder, 
  ButtonBuilder, 
  ButtonStyle, 
  ComponentType 
} = require('discord.js');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

const prefix = "!";

// 🚀 Bot pronto
client.once('ready', () => {
  console.log(`✅ Bot online como ${client.user.tag}`);
  // Adiciona um status customizado legalzinho
  client.user.setActivity('!help para ver os comandos', { type: 3 }); 
});

// 💬 Comandos
client.on('messageCreate', async (message) => {
  if (message.author.bot || !message.content.startsWith(prefix)) return;

  const args = message.content.slice(prefix.length).trim().split(" ");
  const cmd = args.shift().toLowerCase();

  // 🏓 Ping (Agora calculando a latência real)
  if (cmd === "ping") {
    await message.channel.sendTyping();
    const embed = new EmbedBuilder()
      .setTitle("🏓 Pong!")
      .setDescription(`Latência da Mensagem: **${Date.now() - message.createdTimestamp}ms**\nLatência da API: **${Math.round(client.ws.ping)}ms**`)
      .setColor("#00FF00")
      .setTimestamp();

    return message.reply({ embeds: [embed] });
  }

  // 😂 Piada (Com botão interativo de recarregar)
  if (cmd === "piada") {
    await message.channel.sendTyping();

    // Criamos uma função rápida para buscar a piada e reaproveitar no botão
    const fetchJoke = async () => {
      const res = await fetch("https://official-joke-api.appspot.com/random_joke");
      return await res.json();
    };

    try {
      let data = await fetchJoke();

      const embed = new EmbedBuilder()
        .setTitle("😂 Piada do dia")
        .setDescription(`**${data.setup}**\n\n||${data.punchline}||`)
        .setColor("#FFD700")
        .setFooter({ text: `Solicitado por ${message.author.username}`, iconURL: message.author.displayAvatarURL() })
        .setTimestamp();

      // Criação do Botão
      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId('nova_piada')
          .setLabel('Outra Piada')
          .setStyle(ButtonStyle.Primary)
          .setEmoji('🔄')
      );

      const response = await message.reply({ embeds: [embed], components: [row] });

      // Coletor para escutar o clique no botão (dura 1 minuto)
      const collector = response.createMessageComponentCollector({ componentType: ComponentType.Button, time: 60000 });

      collector.on('collect', async (interaction) => {
        // Bloqueia se outra pessoa tentar clicar no botão
        if (interaction.user.id !== message.author.id) {
          return interaction.reply({ content: "❌ Use o seu próprio comando `!piada`!", ephemeral: true });
        }

        // Busca nova piada e atualiza o embed original
        data = await fetchJoke();
        const novoEmbed = EmbedBuilder.from(embed).setDescription(`**${data.setup}**\n\n||${data.punchline}||`);

        await interaction.update({ embeds: [novoEmbed] });
      });

      // Desativa o botão quando o tempo acaba
      collector.on('end', () => {
        row.components[0].setDisabled(true);
        response.edit({ components: [row] }).catch(() => {}); // catch previne erro se a mensagem já tiver sido apagada
      });

    } catch (err) {
      return message.reply("❌ Erro ao buscar piada no momento.");
    }
  }

  // 💡 Conselho
  if (cmd === "conselho") {
    await message.channel.sendTyping();
    try {
      const res = await fetch("https://api.adviceslip.com/advice");
      const data = await res.json();

      const embed = new EmbedBuilder()
        .setTitle("💡 Um conselho para você")
        .setDescription(`*${data.slip.advice}*`)
        .setColor("#00BFFF")
        .setThumbnail("https://cdn-icons-png.flaticon.com/512/4185/4185800.png") // Ícone charmoso
        .setTimestamp();

      return message.reply({ embeds: [embed] });
    } catch {
      return message.reply("❌ Erro ao buscar conselho.");
    }
  }

  // 🌍 IP
  if (cmd === "ip") {
    const ip = args[0];
    if (!ip) {
      const errEmbed = new EmbedBuilder()
        .setColor("#FF0000")
        .setDescription("❌ **Uso incorreto!** Tente usar: `!ip 8.8.8.8`");
      return message.reply({ embeds: [errEmbed] });
    }

    await message.channel.sendTyping();
    try {
      const res = await fetch(`http://ip-api.com/json/${ip}`);
      const data = await res.json();

      if (data.status === "fail") {
         return message.reply("❌ IP inválido ou não encontrado.");
      }

      const embed = new EmbedBuilder()
        .setTitle("🌍 Informações de Rede")
        .setThumbnail("https://cdn-icons-png.flaticon.com/512/2838/2838421.png")
        .addFields(
          { name: "📡 IP", value: `\`${ip}\``, inline: true },
          { name: "🏳️ País", value: data.country || "Desconhecido", inline: true },
          { name: "🏙️ Cidade", value: data.city || "Desconhecida", inline: true },
          { name: "🏢 Provedor", value: data.isp || "Desconhecido", inline: false }
        )
        .setColor("#8A2BE2")
        .setFooter({ text: "Dados fornecidos por ip-api.com" });

      return message.reply({ embeds: [embed] });
    } catch {
      return message.reply("❌ Erro ao buscar informações do IP.");
    }
  }

  // 🖼️ Avatar
  if (cmd === "avatar") {
    const user = message.mentions.users.first() || message.author;

    const embed = new EmbedBuilder()
      .setTitle(`📸 Câmera capturou: ${user.username}`)
      .setImage(user.displayAvatarURL({ dynamic: true, size: 1024 }))
      .setColor("Random")
      .setFooter({ text: `Solicitado por ${message.author.username}` });

    return message.reply({ embeds: [embed] });
  }

  // 📋 Help (Visualmente Categorizado)
  if (cmd === "help") {
    const embed = new EmbedBuilder()
      .setTitle("🤖 Painel de Controle do Bot")
      .setDescription("Aqui estão todos os meus comandos disponíveis. Navegue por eles abaixo!")
      .addFields(
        { name: "🛠️ Utilidade", value: "`!ping` - Mostra a latência do bot\n`!ip <ip>` - Verifica dados de uma rede\n`!avatar [@user]` - Amplia a foto de perfil", inline: false },
        { name: "🎉 Diversão", value: "`!piada` - Conta uma piada interativa\n`!conselho` - Te dá uma dica de ouro", inline: false }
      )
      .setColor("#2F3136") // Cor tema dark do Discord
      .setThumbnail(client.user.displayAvatarURL())
      .setTimestamp();

    return message.reply({ embeds: [embed] });
  }

});

// 🔐 Login
client.login(process.env.TOKEN);
