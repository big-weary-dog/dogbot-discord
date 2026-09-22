import {
  Client,
  Events,
  GatewayIntentBits,
  MessageFlags,
  type ChatInputCommandInteraction,
} from 'discord.js';
import { commands } from './commands/index.js';
import { requireEnv } from './config.js';

const token = requireEnv('DISCORD_TOKEN');

// Slash commands only need the Guilds intent (no privileged intents to enable in the portal).
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once(Events.ClientReady, (readyClient) => {
  console.log(`🐶 Logged in as ${readyClient.user.tag}`);
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const command = commands.get(interaction.commandName);
  try {
    if (!command) {
      console.warn(`Unknown command /${interaction.commandName}. Try running \`npm run deploy\`.`);
      await interaction.reply({
        content: "I don't know that command anymore!",
        flags: MessageFlags.Ephemeral,
      });
      return;
    }
    await command.execute(interaction);
  } catch (error) {
    console.error(`Error while running /${interaction.commandName}:`, error);
    await replyWithError(interaction);
  }
});

client.on(Events.Error, (error) => {
  console.error('Discord client error:', error);
});

async function replyWithError(interaction: ChatInputCommandInteraction): Promise<void> {
  const content = '😵 Something went wrong running that command. Please try again!';
  try {
    if (interaction.deferred && !interaction.replied) {
      await interaction.editReply({ content, embeds: [] });
    } else if (interaction.replied) {
      await interaction.followUp({ content, flags: MessageFlags.Ephemeral });
    } else {
      await interaction.reply({ content, flags: MessageFlags.Ephemeral });
    }
  } catch (error) {
    // The interaction may have expired; there's nothing more we can tell the user.
    console.error('Could not send the error message:', error);
  }
}

// Disconnect cleanly on Ctrl+C or when a host stops the bot, so it goes offline right away.
for (const signal of ['SIGINT', 'SIGTERM'] as const) {
  process.once(signal, () => {
    void client.destroy().finally(() => process.exit(0));
  });
}

await client.login(token);
