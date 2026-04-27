module.exports = {
  name: 'piada',
  description: 'piada aleatória',
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
};
