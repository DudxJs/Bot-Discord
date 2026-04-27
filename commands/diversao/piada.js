module.exports = {
  name: 'ping',
  description: 'Verifica a latência do bot',
  await message.channel.sendTyping();
    const embed = new EmbedBuilder()
      .setTitle("🏓 Pong!")
      .setDescription(`Latência da Mensagem: **${Date.now() - message.createdTimestamp}ms**\nLatência da API: **${Math.round(client.ws.ping)}ms**`)
      .setColor("#00FF00")
      .setTimestamp();

    return message.reply({ embeds: [embed] });
};
