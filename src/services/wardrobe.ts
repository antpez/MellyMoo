import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

type WardrobeState = {
  equippedCostumeKey?: string;
  equipCostume: (key: string) => void;
  clearCostume: () => void;
};

export const useWardrobeStore = create<WardrobeState>()(
  persist(
    (set) => ({
      equippedCostumeKey: undefined,
      equipCostume: (key: string) => set({ equippedCostumeKey: key }),
      clearCostume: () => set({ equippedCostumeKey: undefined }),
    }),
    {
      name: 'wardrobe-store',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ equippedCostumeKey: state.equippedCostumeKey }),
    }
  )
);


