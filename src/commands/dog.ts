import { EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import { fetchDogImageUrl } from '../lib/animals.js';
import type { Command } from './types.js';

export const dog: Command = {
  data: new SlashCommandBuilder().setName('dog').setDescription('Show a random dog picture'),

  async execute(interaction) {
    // Discord only waits 3 seconds for a reply, and fetching the picture can take longer.
    // Deferring shows "DogBot is thinking..." and gives us up to 15 minutes to edit in the answer.
    await interaction.deferReply();
    const imageUrl = await fetchDogImageUrl();
    const embed = new EmbedBuilder()
      .setTitle('🐶 Woof!')
      .setImage(imageUrl)
      .setColor(0xc8a27a)
      .setFooter({ text: 'Photo via dog.ceo' });
    await interaction.editReply({ embeds: [embed] });
  },
};
