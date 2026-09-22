import type {
  ChatInputCommandInteraction,
  RESTPostAPIChatInputApplicationCommandsJSONBody,
} from 'discord.js';

export interface Command {
  /** The command's name, description and options, sent to Discord by `npm run deploy`. */
  data: {
    readonly name: string;
    toJSON(): RESTPostAPIChatInputApplicationCommandsJSONBody;
  };
  /** Runs when someone uses the command. */
  execute(interaction: ChatInputCommandInteraction): Promise<void>;
}
