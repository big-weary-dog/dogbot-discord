import type { ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { allCommands, commands } from './index.js';

/** A stand-in for Discord's interaction object with just the parts our commands use. */
function fakeInteraction(options: { sides?: number } = {}) {
  const interaction = {
    options: { getInteger: vi.fn((name: string) => (name === 'sides' ? (options.sides ?? null) : null)) },
    reply: vi.fn(async (_reply: unknown) => undefined),
    deferReply: vi.fn(async () => undefined),
    editReply: vi.fn(async (_reply: unknown) => undefined),
  };
  return { interaction, asDiscord: interaction as unknown as ChatInputCommandInteraction };
}

function run(name: string, asDiscord: ChatInputCommandInteraction) {
  const command = commands.get(name);
  if (!command) throw new Error(`No /${name} command`);
  return command.execute(asDiscord);
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('command registry', () => {
  it('has /roll, /dog and /cat with unique names', () => {
    expect([...commands.keys()].sort()).toEqual(['cat', 'dog', 'roll']);
    expect(commands.size).toBe(allCommands.length);
  });

  it('builds valid command definitions for Discord', () => {
    for (const command of allCommands) {
      const json = command.data.toJSON();
      expect(json.name).toBe(command.data.name);
      expect(json.description.length).toBeGreaterThan(0);
    }
  });
});

describe('/roll', () => {
  it('rolls a d6 by default', async () => {
    const { interaction, asDiscord } = fakeInteraction();
    await run('roll', asDiscord);
    expect(interaction.reply).toHaveBeenCalledWith(expect.stringMatching(/^🎲 You rolled \*\*[1-6]\*\* \(d6\)$/));
  });

  it('uses the sides option', async () => {
    const { interaction, asDiscord } = fakeInteraction({ sides: 20 });
    await run('roll', asDiscord);
    const reply = String(interaction.reply.mock.calls[0]?.[0]);
    const rolled = Number(/\*\*(\d+)\*\*/.exec(reply)?.[1]);
    expect(reply).toContain('(d20)');
    expect(rolled).toBeGreaterThanOrEqual(1);
    expect(rolled).toBeLessThanOrEqual(20);
  });

  it('limits the sides option to 2-1000', () => {
    const [sides] = commands.get('roll')?.data.toJSON().options ?? [];
    expect(sides).toMatchObject({ name: 'sides', required: false, min_value: 2, max_value: 1000 });
  });
});

describe.each([
  { name: 'dog', title: '🐶 Woof!', body: { message: 'https://images.dog.ceo/breeds/pug/1.jpg', status: 'success' }, url: 'https://images.dog.ceo/breeds/pug/1.jpg' },
  { name: 'cat', title: '🐱 Meow!', body: [{ id: 'abc', url: 'https://cdn2.thecatapi.com/images/abc.jpg' }], url: 'https://cdn2.thecatapi.com/images/abc.jpg' },
])('/$name', ({ name, title, body, url }) => {
  it('defers, then replies with an embedded picture', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => Response.json(body)));
    const { interaction, asDiscord } = fakeInteraction();

    await run(name, asDiscord);

    expect(interaction.deferReply).toHaveBeenCalledOnce();
    expect(interaction.deferReply.mock.invocationCallOrder[0]).toBeLessThan(
      interaction.editReply.mock.invocationCallOrder[0] ?? 0,
    );
    const reply = interaction.editReply.mock.calls[0]?.[0] as { embeds: EmbedBuilder[] };
    const embed = reply.embeds[0]?.toJSON();
    expect(embed?.title).toBe(title);
    expect(embed?.image?.url).toBe(url);
  });

  it('lets errors reach the shared error handler after deferring', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => new Response(null, { status: 503 })));
    const { interaction, asDiscord } = fakeInteraction();

    await expect(run(name, asDiscord)).rejects.toThrow('HTTP 503');
    expect(interaction.deferReply).toHaveBeenCalledOnce();
    expect(interaction.editReply).not.toHaveBeenCalled();
  });
});
