import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export type LevelProgress = {
  level: number;
  completed: boolean;
  stars: number;
  bestScore: number;
  completedAt: number;
};

export type ProgressionState = {
  // Current level
  currentLevel: number;
  
  // Level progress tracking
  completedLevels: number[];
  levelProgress: Record<number, LevelProgress>;
  
  // Actions
  setCurrentLevel: (level: number) => void;
  completeLevel: (level: number, stars: number, score: number) => void;
  getNextLevel: () => number | null;
  isLevelUnlocked: (level: number) => boolean;
  getLevelProgress: (level: number) => LevelProgress | null;
  resetProgression: () => void;
};

const initialState = {
  currentLevel: 1,
  completedLevels: [],
  levelProgress: {},
};

export const useProgressionStore = create<ProgressionState>()(
  persist(
    (set, get) => ({
      ...initialState,

      setCurrentLevel: (level: number) => {
        // Only allow setting to unlocked levels
        if (get().isLevelUnlocked(level)) {
          set({ currentLevel: level });
        }
      },

      completeLevel: (level: number, stars: number, score: number) => {
        const state = get();
        const now = Date.now();
        
        // Create or update level progress
        const levelProgress: LevelProgress = {
          level,
          completed: true,
          stars: Math.max(stars, state.levelProgress[level]?.stars || 0), // Keep best stars
          bestScore: Math.max(score, state.levelProgress[level]?.bestScore || 0), // Keep best score
          completedAt: state.levelProgress[level]?.completedAt || now,
        };

        // Add to completed levels if not already there
        const newCompletedLevels = state.completedLevels.includes(level)
          ? state.completedLevels
          : [...state.completedLevels, level];

        set({
          completedLevels: newCompletedLevels,
          levelProgress: {
            ...state.levelProgress,
            [level]: levelProgress,
          },
        });
      },

      getNextLevel: () => {
        const state = get();
        const nextLevel = state.currentLevel + 1;
        
        // Check if next level exists (max 20 levels)
        if (nextLevel <= 20) {
          return nextLevel;
        }
        
        return null; // No more levels
      },

      isLevelUnlocked: (level: number) => {
        const state = get();
        
        // Level 1 is always unlocked
        if (level === 1) return true;
        
        // Level is unlocked if previous level is completed
        return state.completedLevels.includes(level - 1);
      },

      getLevelProgress: (level: number) => {
        const state = get();
        return state.levelProgress[level] || null;
      },

      resetProgression: () => {
        set(initialState);
      },
    }),
    {
      name: 'progression-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
