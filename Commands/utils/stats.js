const { SlashCommandBuilder, MessageFlags } = require("discord.js");
const { createContainer } = require("../../utils/components");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('stats')
        .setDescription('Verifique minhas estatisticas.'),
    
    async execute(interaction){
        const container = createContainer('Minhas informações')
            .addTextDisplayComponents(text =>
                text.setContent('capkkj')
            )

        await interaction.reply({ 
            components: [container],
            flags: MessageFlags.IsComponentsV2
        });
    }
}