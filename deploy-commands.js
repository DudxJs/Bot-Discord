require('dotenv').config();

const { REST, Routes, SlashCommandBuilder } = require('discord.js');

const commands = [

  new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Verifica a latência do bot'),

  new SlashCommandBuilder()
    .setName('piada')
    .setDescription('Receba uma piada aleatória'),

  new SlashCommandBuilder()
    .setName('conselho')
    .setDescription('Receba um conselho'),

  new SlashCommandBuilder()
    .setName('ip')
    .setDescription('Ver informações de um IP')
    .addStringOption(option =>
      option.setName('ip')
        .setDescription('Digite o IP')
        .setRequired(true)
    ),

  new SlashCommandBuilder()
    .setName('avatar')
    .setDescription('Ver avatar de um usuário')
    .addUserOption(option =>
      option.setName('usuario')
        .setDescription('Escolha o usuário')
    )

].map(cmd => cmd.toJSON());

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

(async () => {
  try {
    console.log('🔄 Registrando comandos...');

    await rest.put(
      Routes.applicationCommands(process.env.CLIENT_ID),
      { body: commands }
    );

    console.log('✅ Comandos registrados!');
  } catch (err) {
    console.error(err);
  }
})();
