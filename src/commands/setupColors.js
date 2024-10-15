const { EmbedBuilder } = require('discord.js');
const config = require('../../config.json');
const fs = require('fs');

module.exports = {
    name: 'setupcolors',
    description: 'Set up colors for your server.',
    async execute(interaction) {
        const requiredRoleId = config.roleID;
        const member = interaction.member;

        if (!member.roles.cache.has(requiredRoleId)) {
            return await interaction.reply({ content: 'Sorry, you do not have permission to use this command.', ephemeral: true });
        }

        const filePath = './colorRoles.json';

        if (fs.existsSync(filePath)) {

            await interaction.deferReply();
            return await interaction.followUp({ content: 'The color roles already exist. No new roles will be created.', ephemeral: true });
        }

        await interaction.deferReply();

        const embed = new EmbedBuilder()
            .setColor('#0099ff')
            .setTitle('Skoda®Studio')
            .setDescription('Salary is being installed on the server')
            .setFooter({ text: 'Skoda®Studio' });

        await interaction.followUp({ embeds: [embed], ephemeral: true });

        const colors = [
            { name: 'Red', hex: '#FF5733' },
            { name: 'Green', hex: '#33FF57' },
            { name: 'Blue', hex: '#3357FF' },
            { name: 'Yellow', hex: '#F1C40F' },
            { name: 'Purple', hex: '#8E44AD' },
            { name: 'Orange', hex: '#E67E22' },
            { name: 'Pink', hex: '#E74C3C' },
            { name: 'Sky Blue', hex: '#3498DB' },
            { name: 'Turquoise', hex: '#2ECC71' },
            { name: 'Lavender', hex: '#9B59B6' },
            { name: 'Honey', hex: '#F39C12' },
            { name: 'Chestnut', hex: '#D35400' },
            { name: 'Crimson', hex: '#C0392B' },
            { name: 'Olive', hex: '#8E44AD' },
            { name: 'Gray', hex: '#2C3E50' },
            { name: 'Black', hex: '#34495E' },
            { name: 'White', hex: '#7F8C8D' },
            { name: 'Light Gray', hex: '#95A5A6' },
            { name: 'Silver', hex: '#BDC3C7' },
            { name: 'Chocolate', hex: '#7D3C98' },
            { name: 'Light Lavender', hex: '#A569BD' },
            { name: 'Coffee Bean', hex: '#D7DBDD' },
            { name: 'Light Olive', hex: '#F4D03F' }
        ];

        const rolesData = {};

        for (let i = 0; i < 25; i++) {
            const color = colors[i % colors.length];
            const roleName = `${color.name}`;
            try {
                const role = await interaction.guild.roles.create({
                    name: roleName,
                    color: color.hex,
                    reason: 'Color role created via setupColors command',
                });
                rolesData[role.id] = role.name;
            } catch (error) {
                console.error(`Error creating role ${roleName}: ${error.message}`);
            }
        }

        fs.writeFileSync(filePath, JSON.stringify(rolesData, null, 2));

        await interaction.followUp({ content: 'Successfully created 25 color roles!', ephemeral: true });
        await interaction.followUp({ content: 'Please note that using this command more than once may expose the reboot to permanent ban. It is recommended to use the command every 48 hours to prevent the reboot from being blocked.', ephemeral: true });
    },
};
