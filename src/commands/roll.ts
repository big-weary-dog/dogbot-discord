import { SlashCommandBuilder } from 'discord.js';
import { rollDie } from '../lib/dice.js';
import type { Command } from './types.js';

const DEFAULT_SIDES = 6;
const MAX_SIDES = 1000;

export const roll: Command = {
  data: new SlashCommandBuilder()
    .setName('roll')
    .setDescription('Roll a die')
    .addIntegerOption((option) =>
      option
        .setName('sides')
        .setDescription(`How many sides the die has (default ${DEFAULT_SIDES})`)
        .setMinValue(2)
        .setMaxValue(MAX_SIDES),
    ),

  async execute(interaction) {
    const sides = interaction.options.getInteger('sides') ?? DEFAULT_SIDES;
    const result = rollDie(sides);
    await interaction.reply(`🎲 You rolled **${result}** (d${sides})`);
  },
};
