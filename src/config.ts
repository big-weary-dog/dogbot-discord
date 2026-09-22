/** Reads a required environment variable, failing with a helpful message if it's missing. */
export function requireEnv(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(`Missing ${name}. Copy .env.example to .env and fill it in.`);
  }
  return value;
}

/** Reads an optional environment variable, treating an empty value as unset. */
export function optionalEnv(name: string): string | undefined {
  return process.env[name]?.trim() || undefined;
}
