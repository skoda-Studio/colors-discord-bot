const fs = require('fs');
const config = require('../../config.json');

module.exports = {
    name: 'removecolors',
    description: 'Remove all color roles from the server.',
    async execute(interaction) {
        await interaction.deferReply();

        const requiredRoleId = config.roleID;
        const member = interaction.member;

        // Check if the user has the required role
        if (!member.roles.cache.has(requiredRoleId)) {
            return await interaction.editReply({ content: 'You do not have permission to use this command.', ephemeral: true });
        }

        try {
            const data = fs.readFileSync('./colorRoles.json', 'utf8');
            const roles = JSON.parse(data);

            for (const roleId of Object.keys(roles)) {
                const guildRole = interaction.guild.roles.cache.get(roleId);
                if (guildRole) {
                    await guildRole.delete();
                }
            }

            fs.unlinkSync('./colorRoles.json');
            await interaction.editReply({ content: 'Successfully removed all color roles recorded in colorRoles.json and deleted the file.', ephemeral: true });

        } catch (error) {
            console.error(`Error removing roles: ${error.message}`);
            await interaction.editReply({ content: 'An error occurred while removing the roles.', ephemeral: true });
        }
    },
};
