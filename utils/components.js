require('dotenv').config()
const { ContainerBuilder } = require("discord.js");

function createContainer(title){
    const container = new ContainerBuilder()
    .addTextDisplayComponents(text => text.setContent(`## ${title}`))
    .addSeparatorComponents(separator => separator)
    if (process.env.color) {
        const rawColor = process.env.color;
        const cleanHex = rawColor.replace('#', '');
        const color = parseInt(cleanHex, 16);
        container.setAccentColor(color)
    }

    return container
}

module.exports = { createContainer };
