const { Client, GatewayIntentBits } = require('discord.js');
const { token, allowedServerID } = require('./config.json');  

const client = new Client({ 
    intents: [
        GatewayIntentBits.Guilds, 
        GatewayIntentBits.GuildMessages, 
        GatewayIntentBits.GuildMessageTyping
        
    ] 
});

client.config = { allowedServerID };

// --------------------------------------------------------------------------
// Command Registration
// --------------------------------------------------------------------------
client.commands = new Map();

const setupColors = require('./src/commands/setupColors');
client.commands.set(setupColors.name, setupColors);

const removeColors = require('./src/commands/removeColors');
client.commands.set(removeColors.name, removeColors);

const selectRole = require('./src/commands/selectRole');
client.commands.set(selectRole.name, selectRole);

const helpCommand = require('./src/commands/help');
client.commands.set(helpCommand.name, helpCommand);

// --------------------------------------------------------------------------
// Register Commands Function
// --------------------------------------------------------------------------
client.registerCommands = async (guildId) => {
    const commands = [...client.commands.values()].map(command => ({
        name: command.name,
        description: command.description,
        options: command.options,
    }));

    try {
        await client.application.commands.set(commands, guildId);
        //console.log('Commands registered successfully.');
    } catch (error) {
        console.error('Error while registering commands:', error);
    }
};

// --------------------------------------------------------------------------
// Import Events
// --------------------------------------------------------------------------
const readyEvent = require('./src/events/ready');

// --------------------------------------------------------------------------
// Event Handling
// --------------------------------------------------------------------------
// Ensure the bot is ready
client.once('ready', () => readyEvent(client));
client.login(token).catch(console.error);

// Handle interaction events
client.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand()) return;

    const command = client.commands.get(interaction.commandName);
    if (command) {
        await command.execute(interaction);
    }
});

// --------------------------------------------------------------------------
// Log in with the token
// --------------------------------------------------------------------------
client.login(token).catch(console.error);

