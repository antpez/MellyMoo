import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

// Re-export progression store
export { useProgressionStore } from './progression.slice';

export type AccessibilityState = {
  reduceMotion: boolean;
  colorAssist: boolean;
  longPressMode: boolean;
  setReduceMotion: (v: boolean) => void;
  setColorAssist: (v: boolean) => void;
  setLongPressMode: (v: boolean) => void;
};

export type GameplayState = {
  musicVolume: number; // 0-100
  sfxVolume: number; // 0-100
  hapticsEnabled: boolean;
  setMusicVolume: (v: number) => void;
  setSfxVolume: (v: number) => void;
  setHapticsEnabled: (v: boolean) => void;
};

export type AppState = AccessibilityState & GameplayState & {
  telemetryOptIn: boolean;
  setTelemetryOptIn: (v: boolean) => void;
};

export const useAppState = create<AppState>()(
  persist(
    (set) => ({
      // Accessibility defaults - all off by default
      reduceMotion: false,
      colorAssist: false,
      longPressMode: false,
      setReduceMotion: (v) => set({ reduceMotion: v }),
      setColorAssist: (v) => set({ colorAssist: v }),
      setLongPressMode: (v) => set({ longPressMode: v }),
      // Gameplay/audio defaults
      musicVolume: 70,
      sfxVolume: 100,
      hapticsEnabled: true,
      setMusicVolume: (v) => set({ musicVolume: Math.max(0, Math.min(100, v)) }),
      setSfxVolume: (v) => set({ sfxVolume: Math.max(0, Math.min(100, v)) }),
      setHapticsEnabled: (v) => set({ hapticsEnabled: v }),
      // Telemetry
      telemetryOptIn: false,
      setTelemetryOptIn: (v) => set({ telemetryOptIn: v }),
    }),
    {
      name: 'melly.settings.v1',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        // persist only settings-related fields
        reduceMotion: state.reduceMotion,
        colorAssist: state.colorAssist,
        longPressMode: state.longPressMode,
        musicVolume: state.musicVolume,
        sfxVolume: state.sfxVolume,
        hapticsEnabled: state.hapticsEnabled,
        telemetryOptIn: state.telemetryOptIn,
      }),
    }
  )
);
