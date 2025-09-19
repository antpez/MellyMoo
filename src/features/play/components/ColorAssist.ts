/**
 * Color Assist System
 * 
 * Provides comprehensive, accessible glyphs for Color Assist mode
 * Ensures consistency across all bubble types and themes
 */

import { Bubble, BubbleColor, BubbleType } from './Bubble';

export type ColorAssistGlyph = {
  symbol: string;
  description: string;
  category: 'color' | 'item' | 'special' | 'avoider';
  theme?: 'farm' | 'beach' | 'candy' | 'space' | 'universal';
};

// Comprehensive color palette with distinct, accessible shapes
// Only includes colors that have actual bubble assets
export const COLOR_GLYPHS: Record<BubbleColor, ColorAssistGlyph> = {
  blue: {
    symbol: '■',
    description: 'Blue Square',
    category: 'color',
    theme: 'universal',
  },
  green: {
    symbol: '●',
    description: 'Green Circle',
    category: 'color',
    theme: 'universal',
  },
  yellow: {
    symbol: '◆',
    description: 'Yellow Diamond',
    category: 'color',
    theme: 'universal',
  },
  pink: {
    symbol: '♥',
    description: 'Pink Heart',
    category: 'color',
    theme: 'universal',
  },
};

// Theme-specific item glyphs
export const ITEM_GLYPHS: Record<string, ColorAssistGlyph> = {
  // Farm items
  flower: {
    symbol: '✿',
    description: 'Flower',
    category: 'item',
    theme: 'farm',
  },
  carrot: {
    symbol: '🥕',
    description: 'Carrot',
    category: 'item',
    theme: 'farm',
  },
  apple: {
    symbol: '🍎',
    description: 'Apple',
    category: 'item',
    theme: 'farm',
  },
  
  // Beach items
  shell: {
    symbol: '🐚',
    description: 'Shell',
    category: 'item',
    theme: 'beach',
  },
  starfish: {
    symbol: '⭐',
    description: 'Starfish',
    category: 'item',
    theme: 'beach',
  },
  pail: {
    symbol: '🪣',
    description: 'Bucket',
    category: 'item',
    theme: 'beach',
  },
  
  // Candy items
  lollipop: {
    symbol: '🍭',
    description: 'Lollipop',
    category: 'item',
    theme: 'candy',
  },
  jellybean: {
    symbol: '🍬',
    description: 'Jellybean',
    category: 'item',
    theme: 'candy',
  },
  cupcake: {
    symbol: '🧁',
    description: 'Cupcake',
    category: 'item',
    theme: 'candy',
  },
  
  // Space items
  star: {
    symbol: '⭐',
    description: 'Star',
    category: 'item',
    theme: 'space',
  },
  planet: {
    symbol: '🪐',
    description: 'Planet',
    category: 'item',
    theme: 'space',
  },
  comet: {
    symbol: '☄️',
    description: 'Comet',
    category: 'item',
    theme: 'space',
  },
};

// Special effect glyphs
export const SPECIAL_GLYPHS: Record<string, ColorAssistGlyph> = {
  rainbow: {
    symbol: '🌈',
    description: 'Rainbow',
    category: 'special',
    theme: 'farm',
  },
  disco: {
    symbol: '💫',
    description: 'Disco Sparkles',
    category: 'special',
    theme: 'beach',
  },
  giggle: {
    symbol: '😄',
    description: 'Giggle Face',
    category: 'special',
    theme: 'candy',
  },
  freeze: {
    symbol: '❄️',
    description: 'Snowflake',
    category: 'special',
    theme: 'space',
  },
};

// Avoider glyphs (warning shapes)
export const AVOIDER_GLYPHS: Record<string, ColorAssistGlyph> = {
  mud: {
    symbol: '⚠️',
    description: 'Mud Warning',
    category: 'avoider',
    theme: 'farm',
  },
  thorns: {
    symbol: '🌵',
    description: 'Thorny Cactus',
    category: 'avoider',
    theme: 'beach',
  },
  slime: {
    symbol: '🟢',
    description: 'Slime',
    category: 'avoider',
    theme: 'candy',
  },
  ice: {
    symbol: '🧊',
    description: 'Ice Cube',
    category: 'avoider',
    theme: 'space',
  },
};

// Fallback glyphs for unknown items
export const FALLBACK_GLYPHS: Record<BubbleType, ColorAssistGlyph> = {
  color: {
    symbol: '●',
    description: 'Unknown Color',
    category: 'color',
    theme: 'universal',
  },
  item: {
    symbol: '🎁',
    description: 'Unknown Item',
    category: 'item',
    theme: 'universal',
  },
  special: {
    symbol: '✨',
    description: 'Unknown Special',
    category: 'special',
    theme: 'universal',
  },
  avoider: {
    symbol: '⚠️',
    description: 'Unknown Avoider',
    category: 'avoider',
    theme: 'universal',
  },
};

/**
 * Get the appropriate Color Assist glyph for a bubble
 */
export function getColorAssistGlyph(bubble: Bubble): ColorAssistGlyph {
  // Color bubbles - use color-specific glyphs
  if (bubble.type === 'color' && bubble.color) {
    return COLOR_GLYPHS[bubble.color] || FALLBACK_GLYPHS.color;
  }
  
  // Item bubbles - use item-specific glyphs
  if (bubble.type === 'item' && bubble.itemKey) {
    return ITEM_GLYPHS[bubble.itemKey] || FALLBACK_GLYPHS.item;
  }
  
  // Special bubbles - use special-specific glyphs
  if (bubble.type === 'special' && bubble.itemKey) {
    return SPECIAL_GLYPHS[bubble.itemKey] || FALLBACK_GLYPHS.special;
  }
  
  // Avoider bubbles - use avoider-specific glyphs
  if (bubble.type === 'avoider' && bubble.itemKey) {
    return AVOIDER_GLYPHS[bubble.itemKey] || FALLBACK_GLYPHS.avoider;
  }
  
  // Fallback based on bubble type
  return FALLBACK_GLYPHS[bubble.type];
}

/**
 * Get all available glyphs for a specific theme
 */
export function getThemeGlyphs(theme: 'farm' | 'beach' | 'candy' | 'space'): {
  colors: ColorAssistGlyph[];
  items: ColorAssistGlyph[];
  specials: ColorAssistGlyph[];
  avoiders: ColorAssistGlyph[];
} {
  return {
    colors: Object.values(COLOR_GLYPHS),
    items: Object.values(ITEM_GLYPHS).filter(glyph => 
      glyph.theme === theme || glyph.theme === 'universal'
    ),
    specials: Object.values(SPECIAL_GLYPHS).filter(glyph => 
      glyph.theme === theme || glyph.theme === 'universal'
    ),
    avoiders: Object.values(AVOIDER_GLYPHS).filter(glyph => 
      glyph.theme === theme || glyph.theme === 'universal'
    ),
  };
}

/**
 * Get all available glyphs across all themes
 */
export function getAllGlyphs(): {
  colors: ColorAssistGlyph[];
  items: ColorAssistGlyph[];
  specials: ColorAssistGlyph[];
  avoiders: ColorAssistGlyph[];
} {
  return {
    colors: Object.values(COLOR_GLYPHS),
    items: Object.values(ITEM_GLYPHS),
    specials: Object.values(SPECIAL_GLYPHS),
    avoiders: Object.values(AVOIDER_GLYPHS),
  };
}

/**
 * Validate that all theme items have corresponding glyphs
 */
export function validateThemeGlyphs(): {
  missing: string[];
  extra: string[];
} {
  const allGlyphs = getAllGlyphs();
  const allItemKeys = new Set([
    ...Object.keys(ITEM_GLYPHS),
    ...Object.keys(SPECIAL_GLYPHS),
    ...Object.keys(AVOIDER_GLYPHS),
  ]);
  
  // Check for missing glyphs (items referenced in level configs but no glyph)
  const levelConfigItems = new Set([
    // Farm items
    'flower', 'carrot', 'apple',
    // Beach items  
    'shell', 'starfish', 'pail',
    // Candy items
    'lollipop', 'jellybean', 'cupcake',
    // Space items
    'star', 'planet', 'comet',
    // Specials
    'rainbow', 'disco', 'giggle', 'freeze',
    // Avoiders
    'mud', 'thorns', 'slime', 'ice',
  ]);
  
  const missing = Array.from(levelConfigItems).filter(item => !allItemKeys.has(item));
  const extra = Array.from(allItemKeys).filter(item => !levelConfigItems.has(item));
  
  return { missing, extra };
}
