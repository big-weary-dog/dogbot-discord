# DogBot 🐶

A Discord bot for games and fun commands, built with [discord.js](https://discord.js.org) and TypeScript.

## Commands

| Command | What it does |
| --- | --- |
| `/roll [sides]` | Rolls a die. It has 6 sides by default, and you can pick anything from 2 to 1000. |
| `/dog` | Shows a random dog picture from [dog.ceo](https://dog.ceo/dog-api/) |
| `/cat` | Shows a random cat picture from [TheCatAPI](https://thecatapi.com) |

## Setup

You'll need [Node.js](https://nodejs.org) 22.12 or newer.

### 1. Create the bot on Discord

1. Go to the [Discord Developer Portal](https://discord.com/developers/applications) and click **New Application**.
2. Open the **Bot** page, click **Reset Token** and copy the token. Treat it like a password.
   You don't need to turn on any of the "Privileged Gateway Intents".
3. Open **OAuth2 → URL Generator**:
   - Under **Scopes**, tick `bot` and `applications.commands`.
   - Under **Bot Permissions**, tick `Send Messages` and `Embed Links`.
   - Open the generated URL and add the bot to your server.

### 2. Configure

```sh
npm install
cp .env.example .env
```

Open `.env` and paste your token into `DISCORD_TOKEN`.

To see new commands in your test server right away, also set `DISCORD_GUILD_ID` to your server's ID.
To find the ID, turn on **Developer Mode** in Discord (User Settings → Advanced), then right-click
your server and choose **Copy Server ID**.

### 3. Register the commands and start the bot

```sh
npm run deploy   # tell Discord about the slash commands
npm run dev      # start the bot; it restarts automatically when you edit code
```

Type `/roll` in your server to try it! 🎲

Run `npm run deploy` again whenever you add, remove or change a command's name, description or options.
You don't need it for changes that only affect what a command does.

> **Tip:** If `DISCORD_GUILD_ID` is set, commands are registered in that server only. If you clear it
> later and deploy globally, that server will show each command twice until you remove its server
> commands.

## Scripts

| Script | What it does |
| --- | --- |
| `npm run dev` | Runs the bot from source and restarts it when files change |
| `npm run deploy` | Registers slash commands with Discord |
| `npm run build` | Compiles TypeScript into `dist/` |
| `npm start` | Runs the compiled bot, for hosting |
| `npm test` | Runs the tests |
| `npm run typecheck` | Checks types without building |
| `npm run check` | Runs the typecheck and the tests |

## Project layout

```
src/
  index.ts             Starts the bot and sends each slash command to its handler
  deploy-commands.ts   Registers the slash commands with Discord
  config.ts            Reads settings from the environment
  commands/
    index.ts           The list of all commands
    types.ts           The shape every command follows
    roll.ts, dog.ts, cat.ts
  lib/
    dice.ts            Dice rolling
    animals.ts         Fetches the dog and cat pictures
```

### Adding a command

1. Create `src/commands/<name>.ts` that exports a `Command` (copy `roll.ts` as a starting point).
2. Add it to the `allCommands` list in `src/commands/index.ts`.
3. Run `npm run deploy`.
