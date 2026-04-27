
require('dotenv').config();
const { Client, GatewayIntentBits, Collection } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]
});

// Criamos uma "Coleção" para armazenar os comandos
client.commands = new Collection();

// Carregando os comandos da pasta
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
  const commandsPath = path.join(foldersPath, folder);
  const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
  
  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    
    // Registra o comando na coleção
    if ('name' in command && 'execute' in command) {
      client.commands.set(command.name, command);
      console.log(`✅ Comando carregado: ${command.name}`);
    }
  }
}

client.once('ready', () => {
  console.log(`🚀 Bot online como ${client.user.tag}`);
});

// Executando os comandos quando uma mensagem chegar
client.on('messageCreate', async (message) => {
  if (message.author.bot || !message.content.startsWith("!")) return;

  const args = message.content.slice(1).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();

  const command = client.commands.get(commandName);
  if (!command) return;

  try {
    await command.execute(message, args, client);
  } catch (error) {
    console.error(error);
    message.reply('❌ Houve um erro ao tentar executar esse comando!');
  }
});

client.login(process.env.TOKEN);
