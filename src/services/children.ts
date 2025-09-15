import AsyncStorage from '@react-native-async-storage/async-storage';

export type ChildProfile = {
  id: string;
  user_id?: string;
  name: string;
  avatar_key?: string | null;
  reduce_motion: boolean;
  color_assist: boolean;
  long_press_mode: boolean;
  music_volume: number;
  sfx_volume: number;
  haptics_enabled: boolean;
  settings: Record<string, unknown>;
};

const STORAGE_KEY = 'melly.children.v1';

async function readAll(): Promise<ChildProfile[]> {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try { return JSON.parse(raw) as ChildProfile[]; } catch { return []; }
}

async function writeAll(items: ChildProfile[]) {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

function makeId() {
  return 'child_' + Math.random().toString(36).slice(2, 10);
}

export async function listChildren() {
  return await readAll();
}

export async function createChild(input: { name: string; avatar_key?: string | null }) {
  const items = await readAll();
  const child: ChildProfile = {
    id: makeId(),
    name: input.name,
    avatar_key: input.avatar_key ?? null,
    reduce_motion: false,
    color_assist: true,
    long_press_mode: false,
    music_volume: 70,
    sfx_volume: 100,
    haptics_enabled: true,
    settings: {},
  };
  items.push(child);
  await writeAll(items);
  return child;
}

export async function updateChild(id: string, patch: Partial<ChildProfile>) {
  const items = await readAll();
  const idx = items.findIndex((x) => x.id === id);
  if (idx === -1) throw new Error('Child not found');
  items[idx] = { ...items[idx], ...patch };
  await writeAll(items);
  return items[idx];
}

export async function deleteChild(id: string) {
  const items = await readAll();
  const next = items.filter((x) => x.id !== id);
  await writeAll(next);
}
