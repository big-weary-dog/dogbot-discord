import { REST, Routes, type APIApplication } from 'discord.js';
import { allCommands } from './commands/index.js';
import { optionalEnv, requireEnv } from './config.js';

// Registers (or updates) the bot's slash commands with Discord.
// Run this after adding, removing or changing a command's name, description or options.
// `npm run deploy -- --clear` sends an empty list instead, removing the commands registered there.

const rest = new REST().setToken(requireEnv('DISCORD_TOKEN'));
const guildId = optionalEnv('DISCORD_GUILD_ID');

// The application ID can be looked up from the token, so it doesn't need its own setting.
const application = (await rest.get(Routes.currentApplication())) as APIApplication;
const clear = process.argv.includes('--clear');
const body = clear ? [] : allCommands.map((command) => command.data.toJSON());

const route = guildId
  ? Routes.applicationGuildCommands(application.id, guildId)
  : Routes.applicationCommands(application.id);
await rest.put(route, { body });

const where = guildId ? `in server ${guildId}` : 'globally';
if (clear) {
  console.log(`🧹 Removed all of ${application.name}'s commands ${where}.`);
} else if (guildId) {
  console.log(`✅ Registered ${body.length} commands ${where}. They work right away.`);
} else {
  console.log(`✅ Registered ${body.length} commands ${where}, for every server ${application.name} is in.`);
}
