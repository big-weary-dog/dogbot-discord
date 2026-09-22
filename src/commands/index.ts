import { cat } from './cat.js';
import { dog } from './dog.js';
import { roll } from './roll.js';
import type { Command } from './types.js';

/** Every slash command the bot supports. After adding one here, run `npm run deploy`. */
export const allCommands: readonly Command[] = [roll, dog, cat];

export const commands = new Map(allCommands.map((command) => [command.data.name, command]));
