import { Bubble } from '@/src/features/play/components/Bubble';
import { create } from 'zustand';

// Helper function to parse objectives from level config
export function parseObjectives(objectives: { primary: string; secondary?: string }): ObjectiveProgress {
  const parseObjective = (description: string) => {
    // Extract number from descriptions like "Pop 20 colorful bubbles"
    const match = description.match(/(\d+)/);
    const target = match ? parseInt(match[1]) : 0;
    
    return {
      description,
      target,
      current: 0,
      completed: false,
    };
  };

  return {
    primary: parseObjective(objectives.primary),
    secondary: objectives.secondary ? parseObjective(objectives.secondary) : undefined,
  };
}

export type ObjectiveProgress = {
  primary: {
    description: string;
    target: number;
    current: number;
    completed: boolean;
  };
  secondary?: {
    description: string;
    target: number;
    current: number;
    completed: boolean;
  };
};

export type GameplayState = {
  // Game state
  isPlaying: boolean;
  isPaused: boolean;
  score: number;
  stars: number;
  stickersFound: number;
  timeRemaining: number;
  maxTime: number;
  
  // Bubbles
  bubbles: Bubble[];
  
  // Objectives
  objectives: ObjectiveProgress | null;
  levelCompleted: boolean;
  
  // Actions
  startGame: () => void;
  pauseGame: () => void;
  resumeGame: () => void;
  endGame: () => void;
  addBubble: (bubble: Bubble) => void;
  removeBubble: (id: string) => void;
  updateBubbles: (bubbles: Bubble[]) => void;
  popBubble: (id: string) => void;
  addScore: (points: number) => void;
  addSticker: () => void;
  setTimeRemaining: (time: number) => void;
  setObjectives: (objectives: ObjectiveProgress) => void;
  updateObjectiveProgress: (type: 'primary' | 'secondary', increment: number) => void;
  checkLevelCompletion: () => boolean;
  resetGame: () => void;
};

const initialState = {
  isPlaying: false,
  isPaused: false,
  score: 0,
  stars: 0,
  stickersFound: 0,
  timeRemaining: 60, // 60 seconds default
  maxTime: 60,
  bubbles: [],
  objectives: null,
  levelCompleted: false,
};

export const useGameplayStore = create<GameplayState>((set, get) => ({
  ...initialState,

  startGame: () => set({ 
    isPlaying: true, 
    isPaused: false,
    score: 0,
    stars: 0,
    stickersFound: 0,
    timeRemaining: get().maxTime,
    bubbles: [],
    levelCompleted: false,
  }),

  pauseGame: () => set({ isPaused: true }),

  resumeGame: () => set({ isPaused: false }),

  endGame: () => {
    const state = get();
    // Calculate stars based on score
    let stars = 0;
    if (state.score >= 1000) stars = 3;
    else if (state.score >= 500) stars = 2;
    else if (state.score >= 200) stars = 1;

    set({ 
      isPlaying: false, 
      isPaused: false,
      stars,
    });
  },

  addBubble: (bubble: Bubble) => set((state) => ({
    bubbles: [...state.bubbles, bubble],
  })),

  removeBubble: (id: string) => set((state) => ({
    bubbles: state.bubbles.filter(b => b.id !== id),
  })),

  updateBubbles: (bubbles: Bubble[]) => set({ bubbles }),

  popBubble: (id: string) => set((state) => {
    const bubble = state.bubbles.find(b => b.id === id);
    if (!bubble) return state;

    // Calculate score
    let scoreIncrease = 0;
    if (bubble.type === 'color') scoreIncrease = 10;
    else if (bubble.type === 'item') scoreIncrease = 15;
    else if (bubble.type === 'special') scoreIncrease = 25;
    else if (bubble.type === 'avoider') scoreIncrease = -5; // Penalty

    // Remove the bubble from the array immediately
    const newBubbles = state.bubbles.filter(b => b.id !== id);

    return {
      bubbles: newBubbles,
      score: state.score + scoreIncrease,
    };
  }),

  addScore: (points: number) => set((state) => ({
    score: state.score + points,
  })),

  addSticker: () => set((state) => ({
    stickersFound: state.stickersFound + 1,
  })),

  setTimeRemaining: (time: number) => set({ timeRemaining: time }),

  setObjectives: (objectives: ObjectiveProgress) => set({ objectives }),

  updateObjectiveProgress: (type: 'primary' | 'secondary', increment: number) => set((state) => {
    if (!state.objectives) return state;
    
    const newObjectives = { ...state.objectives };
    if (type === 'primary') {
      newObjectives.primary.current = Math.min(
        newObjectives.primary.current + increment,
        newObjectives.primary.target
      );
      newObjectives.primary.completed = newObjectives.primary.current >= newObjectives.primary.target;
    } else if (type === 'secondary' && newObjectives.secondary) {
      newObjectives.secondary.current = Math.min(
        newObjectives.secondary.current + increment,
        newObjectives.secondary.target
      );
      newObjectives.secondary.completed = newObjectives.secondary.current >= newObjectives.secondary.target;
    }
    
    return { objectives: newObjectives };
  }),

  checkLevelCompletion: () => {
    const state = get();
    if (!state.objectives) return false;
    
    const primaryCompleted = state.objectives.primary.completed;
    const secondaryCompleted = !state.objectives.secondary || state.objectives.secondary.completed;
    
    return primaryCompleted && secondaryCompleted;
  },

  resetGame: () => set(initialState),
}));
