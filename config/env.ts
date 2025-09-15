// No remote envs needed; using local storage only.
export type Env = Record<string, never>;
export function getEnv(): Env { return {}; }
