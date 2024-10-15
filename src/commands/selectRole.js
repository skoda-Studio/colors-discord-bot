const fs = require('fs');
const path = require('path');
const { ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');

module.exports = {
    name: 'selectrole',
    description: 'Select a role from the dropdown menu',
    async execute(interaction) {
        const colorRolesFile = path.resolve(__dirname, '../../colorRoles.json');

        if (!fs.existsSync(colorRolesFile)) {
            await interaction.reply({
                content: 'The color roles service has not been activated yet. Please contact the server administration for more information.',
                ephemeral: true
            });
            return;
        }

        const colorRoles = require(colorRolesFile);

        const rolesMenu = new StringSelectMenuBuilder()
            .setCustomId('selectRole')
            .setPlaceholder('Choose a role...')
            .addOptions(
                Object.entries(colorRoles).map(([roleId, roleName]) => ({
                    label: roleName,
                    value: roleId,
                }))
            );

        const row = new ActionRowBuilder().addComponents(rolesMenu);

        const message = await interaction.reply({
            content: 'Select your role from the menu below:',
            components: [row],
            ephemeral: false,
            fetchReply: true
        });

        const filter = i => i.customId === 'selectRole' && i.user.id === interaction.user.id;
        const collector = interaction.channel.createMessageComponentCollector({ filter, time: 60000 });

        collector.on('collect', async i => {
            await i.deferUpdate();

            const selectedRoleId = i.values[0];
            const role = interaction.guild.roles.cache.get(selectedRoleId);
            const member = interaction.member;

            if (!role) {
                await message.edit({ content: 'The selected role does not exist. Please select a different role.', components: [] });
                collector.stop();
                return;
            }

            try {
                if (member.roles.cache.has(role.id)) {
                    await member.roles.remove(role);
                    await message.edit({ content: `Role **${role.name}** has been removed from you.`, components: [] });
                } else {
                    await member.roles.add(role);
                    await message.edit({ content: `Congratulations! You have been given the role **${role.name}**.`, components: [] });
                }
            } catch (error) {
                console.error('Error modifying role:', error);
                await message.edit({ content: 'There was an error modifying the role. Please try again.', components: [] });
            }

            collector.stop();
        });

        collector.on('end', async collected => {
            if (collected.size === 0) {
                await message.edit({ content: 'The operation failed due to no response. Please try again.', components: [] });
            }
        });
    }
};
