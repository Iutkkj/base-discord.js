require('dotenv').config();
const fs = require('node:fs');
const path = require('node:path');
const { REST, Routes } = require('discord.js');

const commands = [];

const { getFiles } = require('./utils/getFiles');
const commandsPath = path.join(__dirname, 'Commands');
const commandFiles = getFiles(commandsPath);

for (const filePath of commandFiles) {
  const command = require(filePath);

  if ('data' in command && 'execute' in command) {
    commands.push(command.data.toJSON());
    console.log(`✅ - Command loaded: ${command.data.name}`);
  } else {
    console.log(`🔴 - Alerta: ${path.basename(filePath)} precisa do "data" ou o "execute"!`);
  }
}

const rest = new REST({ version: '10' }).setToken(process.env.token);

(async () => {
  try {
    console.log(`⏳ - Registrando ${commands.length} comando(s) na guild atual...`);

    const guildData = await rest.put(
      Routes.applicationGuildCommands(process.env.clientId, process.env.guildId),
      { body: commands }
    );
    console.log(`✅ - ${guildData.length} comando(s) registrado(s) na guild!`);

    console.log(`🧹 - Limpando comandos globais...`);

    const globalData = await rest.put(
      Routes.applicationCommands(process.env.clientId),
      { body: [] }
    );
    console.log(`✅ - Comandos globais limpos.`);

  } catch (error) {
    console.error(`❌ - Erro ao registrar:`, error);
  }
})();