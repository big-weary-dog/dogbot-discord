import { EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import { fetchCatImageUrl } from '../lib/animals.js';
import type { Command } from './types.js';

export const cat: Command = {
  data: new SlashCommandBuilder().setName('cat').setDescription('Show a random cat picture'),

  async execute(interaction) {
    // See dog.ts for why we defer before fetching.
    await interaction.deferReply();
    const imageUrl = await fetchCatImageUrl();
    const embed = new EmbedBuilder()
      .setTitle('🐱 Meow!')
      .setImage(imageUrl)
      .setColor(0x9b8ec4)
      .setFooter({ text: 'Photo via TheCatAPI' });
    await interaction.editReply({ embeds: [embed] });
  },
};
