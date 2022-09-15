import { Client, Collection, GatewayIntentBits, REST, Routes } from 'discord.js';
import log from './log.js';
import fs from 'fs';
import path from 'path';

var client = new Client({ intents: [ GatewayIntentBits.Guilds ] });
var commands = [];

// Get commands
client.commands = new Collection();

// Read all files in the commands directory
const commandFiles = fs
    .readdirSync(path.join(process.cwd(), 'src', 'util', 'bot-commands'))
    .filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    let command = await import(`./bot-commands/${file}`);
    command = command.default;
	// Set a new item in the Collection
	// With the key as the command name and the value as the exported module
	client.commands.set(command.data.name, command);
    commands.push(command.data.toJSON());
}

client.on('interactionCreate', async interaction => {
	if (!interaction.isChatInputCommand()) return;

	const command = interaction.client.commands.get(interaction.commandName);

	if (!command) return;

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});

client.once('ready', () => {
    log.info(`🤖 Logged in as ${client.user.tag}`);

    const rest = new REST({
        version: "10",
    }).setToken(client.token);

    (async () => {
        try {
            // register the commands
            await rest.put(Routes.applicationCommands(client.user.id), { body: commands, });
            log.info(`🤖 Registered ${commands.length} commands`);
        } catch (error) {
            if (error) console.error(error);
        }
    })();

});

function login() {
    client.login(process.env.DISCORD_TOKEN);
}

export { client, login };