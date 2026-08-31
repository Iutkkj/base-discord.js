require('dotenv').config()
const { ContainerBuilder } = require("discord.js");

function createContainer(title){
    const container = new ContainerBuilder()
    .addTextDisplayComponents(text => text.setContent(`## ${title}`))
    .addSeparatorComponents(separator => separator)
    .setAccentColor(process.env.color)

    return container
}

module.exports = { createContainer };