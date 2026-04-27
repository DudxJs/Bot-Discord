module.exports = {
  name: 'ping',
  description: 'Verifica a latência do bot',
  async execute(message, args, client) {
    const ping = Date.now() - message.createdTimestamp;
    message.reply(`🏓 Pong! Latência: ${ping}ms`);
  }
};
