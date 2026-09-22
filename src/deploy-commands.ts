import { REST, Routes, type APIApplication } from 'discord.js';
import { allCommands } from './commands/index.js';
import { optionalEnv, requireEnv } from './config.js';

// Registers (or updates) the bot's slash commands with Discord.
// Run this after adding, removing or changing a command's name, description or options.

const rest = new REST().setToken(requireEnv('DISCORD_TOKEN'));
const guildId = optionalEnv('DISCORD_GUILD_ID');

// The application ID can be looked up from the token, so it doesn't need its own setting.
const application = (await rest.get(Routes.currentApplication())) as APIApplication;
const body = allCommands.map((command) => command.data.toJSON());

if (guildId) {
  await rest.put(Routes.applicationGuildCommands(application.id, guildId), { body });
  console.log(`✅ Registered ${body.length} commands in server ${guildId}. They work right away.`);
} else {
  await rest.put(Routes.applicationCommands(application.id), { body });
  console.log(`✅ Registered ${body.length} global commands for every server ${application.name} is in.`);
}
