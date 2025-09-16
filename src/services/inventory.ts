import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ItemKind = 'sticker' | 'costume' | 'decor';

export type InventoryItem = {
  id: string;        // generated
  key: string;       // stable content key, e.g., 'duck_hat_astronaut'
  kind: ItemKind;
  title?: string;
  theme?: string;    // theme for stickers (farm, beach, candy, space)
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

// Zustand store for easier state management
export const useInventoryStore = create<{
  items: InventoryItem[];
  loadItems: () => Promise<void>;
  addItem: (item: Omit<InventoryItem, 'id'>) => Promise<void>;
  getOwnedItems: (kind?: ItemKind) => InventoryItem[];
  isOwned: (key: string) => boolean;
}>()(
  persist(
    (set, get) => ({
      items: [],
      
      loadItems: async () => {
        const items = await readAll();
        set({ items });
      },
      
      addItem: async (itemData) => {
        const item = await addOwned(itemData);
        set((state) => ({ items: [...state.items, item] }));
      },
      
      getOwnedItems: (kind) => {
        const items = get().items;
        return kind ? items.filter(item => item.kind === kind) : items;
      },
      
      isOwned: (key) => {
        return get().items.some(item => item.key === key);
      },
    }),
    {
      name: 'inventory-storage',
      storage: {
        getItem: async (name) => {
          const value = await AsyncStorage.getItem(name);
          return value ? JSON.parse(value) : null;
        },
        setItem: async (name, value) => {
          await AsyncStorage.setItem(name, JSON.stringify(value));
        },
        removeItem: async (name) => {
          await AsyncStorage.removeItem(name);
        },
      },
    }
  )
);
