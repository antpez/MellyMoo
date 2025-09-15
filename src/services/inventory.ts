import AsyncStorage from '@react-native-async-storage/async-storage';

export type ItemKind = 'sticker' | 'costume' | 'decor';

export type InventoryItem = {
  id: string;        // generated
  key: string;       // stable content key, e.g., 'duck_hat_astronaut'
  kind: ItemKind;
  title?: string;
  payload?: Record<string, unknown>;
};

const STORAGE_KEY = 'melly.inventory.v1';

function makeId() {
  return 'itm_' + Math.random().toString(36).slice(2, 10);
}

async function readAll(): Promise<InventoryItem[]> {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try { return JSON.parse(raw) as InventoryItem[]; } catch { return []; }
}

async function writeAll(items: InventoryItem[]) {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export async function getOwned(): Promise<InventoryItem[]> {
  return await readAll();
}

export async function isOwned(key: string): Promise<boolean> {
  const items = await readAll();
  return items.some((i) => i.key === key);
}

export async function addOwned(input: Omit<InventoryItem, 'id'>): Promise<InventoryItem> {
  const items = await readAll();
  if (items.some((i) => i.key === input.key)) {
    return items.find((i) => i.key === input.key)!;
  }
  const item: InventoryItem = { id: makeId(), ...input };
  items.push(item);
  await writeAll(items);
  return item;
}
