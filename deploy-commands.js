// deploy-commands.js
require('dotenv').config();
const { REST, Routes, SlashCommandBuilder } = require('discord.js');

const commands = [
  new SlashCommandBuilder().setName('ping').setDescription('Mostra a latência do bot'),
  new SlashCommandBuilder().setName('piada').setDescription('Conta uma piada interativa'),
  new SlashCommandBuilder().setName('conselho').setDescription('Te dá uma dica de ouro'),
  new SlashCommandBuilder().setName('avatar').setDescription('Mostra o avatar de um usuário')
    .addUserOption(option => option.setName('user').setDescription('O usuário para ver o avatar')),
  new SlashCommandBuilder().setName('ip').setDescription('Verifica dados de uma rede')
    .addStringOption(option => option.setName('ip').setDescription('O IP para consultar').setRequired(true)),
  new SlashCommandBuilder().setName('help').setDescription('Lista todos os comandos'),
].map(command => command.toJSON());

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

(async () => {
  try {
    console.log('🔄 Iniciando registro de comandos...');
    await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), { body: commands });
    console.log('✅ Comandos registrados com sucesso!');
  } catch (error) {
    console.error(error);
  }
})();
