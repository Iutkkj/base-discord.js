require('dotenv').config()
const { Client, GatewayIntentBits, Collection } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');
const { getFiles } = require('./utils/getFiles');

const client = new Client({
   intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ] 
});

client.commands = new Collection();
client.buttons = new Collection();
client.menus = new Collection();
client.modals = new Collection();

function loadHandlers(folderName, collection) {
  const folderPath = path.join(__dirname, 'Components', folderName);
  if (!fs.existsSync(folderPath)) return;

  const files = getFiles(folderPath);
  for (const filePath of files) {
    const handler = require(filePath);
    if ('customId' in handler && 'execute' in handler) {
      collection.set(handler.customId, handler);
      console.log(`✅ - ${folderName} carregado: ${handler.customId}`);
    }
  }
}

loadHandlers('Buttons', client.buttons);
loadHandlers('Menus', client.menus);
loadHandlers('Modals', client.modals);

const commandsPath = path.join(__dirname, 'Commands');
const commandFiles = getFiles(commandsPath);

for (const filePath of commandFiles) {
  const command = require(filePath);

  if ('data' in command && 'execute' in command){
    client.commands.set(command.data.name, command);
    console.log(`✅ - Command loaded: ${command.data.name}`);
  } else {
    console.log(`🔴 - Alerta: ${file} precisa do "data" ou o "execute"!`);
  }
}

client.once('clientReady', () => {
  console.log(`🤖 - Estou online em ${client.user.tag}`);
})

client.on('interactionCreate', async (interaction) => {
  try {
    if (interaction.isChatInputCommand()) {
      const command = client.commands.get(interaction.commandName);
      if (!command) return;
      await command.execute(interaction);

    } else if (interaction.isButton()) {
      const button = client.buttons.get(interaction.customId);
      if (!button) return;
      await button.execute(interaction);

    } else if (interaction.isStringSelectMenu() || interaction.isUserSelectMenu() || interaction.isChannelSelectMenu() || interaction.isRoleSelectMenu()) {
      const menu = client.menus.get(interaction.customId);
      if (!menu) return;
      await menu.execute(interaction);

    } else if (interaction.isModalSubmit()) {
      const modal = client.modals.get(interaction.customId);
      if (!modal) return;
      await modal.execute(interaction);
    }
  } catch (error) {
    console.error(error);
    const reply = { content: '❌ **- Ocorreu um erro ao executar isso.**', ephemeral: true };
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp(reply);
    } else {
      await interaction.reply(reply);
    }
  }
});

client.login(process.env.token);