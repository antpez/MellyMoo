import { SpawnConfig } from '../spawner/BubbleSpawner';

export type Theme = 'farm' | 'beach' | 'candy' | 'space';

export interface LevelConfig {
  level: number;
  theme: Theme;
  name: string;
  description: string;
  spawnConfig: SpawnConfig;
  objectives: {
    primary: string;
    secondary?: string;
  };
  unlockRequirements?: {
    previousLevel?: number;
    minScore?: number;
  };
}

// Theme-specific bubble configurations
const THEME_CONFIGS = {
  farm: {
    colors: ['blue', 'green', 'pink', 'yellow'] as const,
    items: ['flower', 'carrot', 'apple'],
    specials: ['rainbow'],
    avoiders: ['mud'],
    background: '#E8F5E8',
    accentColor: '#8BC34A',
  },
  beach: {
    colors: ['blue', 'green', 'yellow', 'pink'] as const, // Using available colors
    items: ['shell', 'starfish', 'pail'],
    specials: ['disco'],
    avoiders: ['thorns'],
    background: '#87CEEB',
    accentColor: '#4FC3F7',
  },
  candy: {
    colors: ['pink', 'purple', 'yellow', 'pink'] as const, // Using available colors
    items: ['lollipop', 'jellybean', 'cupcake'],
    specials: ['giggle'],
    avoiders: ['slime'],
    background: '#FFB6C1',
    accentColor: '#E91E63',
  },
  space: {
    colors: ['purple', 'blue', 'pink', 'yellow'] as const, // Using available colors
    items: ['star', 'planet', 'comet'],
    specials: ['freeze'],
    avoiders: ['ice'],
    background: '#9370DB',
    accentColor: '#9C27B0',
  },
};

// Generate level configurations for all themes
export function generateLevelConfigs(screenWidth: number, screenHeight: number): LevelConfig[] {
  const configs: LevelConfig[] = [];
  
  const themes: Theme[] = ['farm', 'beach', 'candy', 'space'];
  
  themes.forEach((theme, themeIndex) => {
    const themeConfig = THEME_CONFIGS[theme];
    
    for (let levelInTheme = 1; levelInTheme <= 5; levelInTheme++) {
      const globalLevel = themeIndex * 5 + levelInTheme;
      const t = (levelInTheme - 1) / 4; // 0..1 progression within theme
      
      // Difficulty progression within theme
      const baseInterval = 800 - (300 * t); // 800ms → 500ms
      const baseSpeed = 160 + (80 * t);     // 160 → 240 px/s
      
      // Global difficulty progression across all themes
      const globalT = (globalLevel - 1) / 19; // 0..1 across all 20 levels
      const globalInterval = baseInterval - (100 * globalT); // Additional global reduction
      const globalSpeed = baseSpeed + (40 * globalT);        // Additional global increase
      
      // Size progression: large bubbles unlock at level 3, small at level 6
      const sizeChances = {
        small: globalLevel >= 6 ? 0.2 + (0.2 * t) : 0,
        medium: 1.0, // Will be normalized
        large: globalLevel >= 3 ? 0.15 + (0.15 * t) : 0,
      };
      
      // Normalize size chances
      const sum = sizeChances.small + sizeChances.large;
      sizeChances.medium = Math.max(0, 1 - sum);
      
      // Probability progression: introduce items, specials, and avoiders gradually
      const probabilities = {
        color: 1.0 - (0.3 * t) - (0.1 * globalT), // 1.0 → 0.6
        item: 0.0 + (0.15 * t) + (0.05 * globalT), // 0.0 → 0.2
        special: 0.0 + (0.1 * t) + (0.05 * globalT), // 0.0 → 0.15
        avoider: 0.0 + (0.05 * t) + (0.05 * globalT), // 0.0 → 0.1
      };
      
      // Normalize probabilities
      const probSum = probabilities.color + probabilities.item + probabilities.special + probabilities.avoider;
      Object.keys(probabilities).forEach(key => {
        probabilities[key as keyof typeof probabilities] /= probSum;
      });
      
      const spawnConfig: SpawnConfig = {
        interval: Math.round(globalInterval),
        speed: Math.round(globalSpeed),
        sizeChances,
        probabilities,
        colors: [...themeConfig.colors],
        items: [...themeConfig.items],
        specials: [...themeConfig.specials],
        avoiders: [...themeConfig.avoiders],
      };
      
      const levelConfig: LevelConfig = {
        level: globalLevel,
        theme,
        name: `${theme.charAt(0).toUpperCase() + theme.slice(1)} Level ${levelInTheme}`,
        description: getLevelDescription(theme, levelInTheme),
        spawnConfig,
        objectives: getLevelObjectives(theme, levelInTheme),
        unlockRequirements: globalLevel > 1 ? {
          previousLevel: globalLevel - 1,
        } : undefined,
      };
      
      configs.push(levelConfig);
    }
  });
  
  return configs;
}

function getLevelDescription(theme: Theme, levelInTheme: number): string {
  const descriptions = {
    farm: [
      "Welcome to the farm! Pop the colorful bubbles to help the animals.",
      "More bubbles are appearing! Can you keep up with the harvest?",
      "The farm is getting busy! Watch out for special rainbow bubbles.",
      "Advanced farming! Large bubbles need more effort to pop.",
      "Master farmer! You're ready for the next world adventure!"
    ],
    beach: [
      "Welcome to the beach! Pop bubbles to collect seashells and treasures.",
      "The ocean waves are bringing more bubbles! Can you catch them all?",
      "Beach party time! Look for the disco bubbles that make everyone dance.",
      "The tide is rising! Small bubbles are harder to catch but worth more.",
      "Beach master! You've collected all the ocean treasures!"
    ],
    candy: [
      "Welcome to Candy Land! Pop sweet bubbles to collect treats.",
      "The candy factory is working overtime! More bubbles are coming.",
      "Sweet surprises! Giggle bubbles will make you laugh with joy.",
      "Sugar rush! Small candy bubbles are extra sweet and fast.",
      "Candy champion! You've mastered the art of sweet bubble popping!"
    ],
    space: [
      "Welcome to space! Pop cosmic bubbles to explore the stars.",
      "The galaxy is full of bubbles! Can you reach for the stars?",
      "Cosmic adventure! Freeze bubbles will slow down time for you.",
      "Interstellar journey! Small bubbles move like shooting stars.",
      "Space explorer! You've conquered the cosmic bubble universe!"
    ]
  };
  
  return descriptions[theme][levelInTheme - 1];
}

function getLevelObjectives(theme: Theme, levelInTheme: number): { primary: string; secondary?: string } {
  const objectives = {
    farm: [
      { primary: "Pop 20 colorful bubbles", secondary: "Collect 3 farm items" },
      { primary: "Pop 30 bubbles", secondary: "Avoid mud bubbles" },
      { primary: "Pop 25 bubbles", secondary: "Find 2 rainbow bubbles" },
      { primary: "Pop 35 bubbles", secondary: "Pop 5 large bubbles" },
      { primary: "Pop 40 bubbles", secondary: "Complete the farm collection" }
    ],
    beach: [
      { primary: "Pop 20 ocean bubbles", secondary: "Collect 3 seashells" },
      { primary: "Pop 30 bubbles", secondary: "Avoid thorny bubbles" },
      { primary: "Pop 25 bubbles", secondary: "Find 2 disco bubbles" },
      { primary: "Pop 35 bubbles", secondary: "Pop 5 small bubbles" },
      { primary: "Pop 40 bubbles", secondary: "Complete the beach collection" }
    ],
    candy: [
      { primary: "Pop 20 sweet bubbles", secondary: "Collect 3 candy treats" },
      { primary: "Pop 30 bubbles", secondary: "Avoid slime bubbles" },
      { primary: "Pop 25 bubbles", secondary: "Find 2 giggle bubbles" },
      { primary: "Pop 35 bubbles", secondary: "Pop 5 small bubbles" },
      { primary: "Pop 40 bubbles", secondary: "Complete the candy collection" }
    ],
    space: [
      { primary: "Pop 20 cosmic bubbles", secondary: "Collect 3 space items" },
      { primary: "Pop 30 bubbles", secondary: "Avoid ice bubbles" },
      { primary: "Pop 25 bubbles", secondary: "Find 2 freeze bubbles" },
      { primary: "Pop 35 bubbles", secondary: "Pop 5 small bubbles" },
      { primary: "Pop 40 bubbles", secondary: "Complete the space collection" }
    ]
  };
  
  return objectives[theme][levelInTheme - 1];
}

// Helper function to get level config by level number
export function getLevelConfig(level: number, screenWidth: number, screenHeight: number): LevelConfig | null {
  const configs = generateLevelConfigs(screenWidth, screenHeight);
  return configs.find(config => config.level === level) || null;
}

// Helper function to get all configs for a specific theme
export function getThemeConfigs(theme: Theme, screenWidth: number, screenHeight: number): LevelConfig[] {
  const configs = generateLevelConfigs(screenWidth, screenHeight);
  return configs.filter(config => config.theme === theme);
}

// Helper function to get the next level config
export function getNextLevelConfig(currentLevel: number, screenWidth: number, screenHeight: number): LevelConfig | null {
  const configs = generateLevelConfigs(screenWidth, screenHeight);
  return configs.find(config => config.level === currentLevel + 1) || null;
}

// Helper function to check if a level is unlocked
export function isLevelUnlocked(level: number, completedLevels: number[]): boolean {
  if (level === 1) return true;
  return completedLevels.includes(level - 1);
}

// Export theme configurations for use in other parts of the app
export { THEME_CONFIGS };
