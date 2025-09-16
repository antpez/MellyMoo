import { addOwned, InventoryItem } from '@/src/services/inventory';

export type Reward = {
  type: 'sticker' | 'costume' | 'decor';
  key: string;
  title?: string;
  theme?: string;
};

// Themed sticker rewards for collection
const demoRewards: Reward[] = [
  // Farm stickers
  { type: 'sticker', key: 'duck', title: 'Duck', theme: 'farm' },
  { type: 'sticker', key: 'carrot', title: 'Carrot', theme: 'farm' },
  { type: 'sticker', key: 'apple', title: 'Apple', theme: 'farm' },
  { type: 'sticker', key: 'flower', title: 'Flower', theme: 'farm' },
  { type: 'sticker', key: 'barn', title: 'Barn', theme: 'farm' },
  { type: 'sticker', key: 'cow', title: 'Cow', theme: 'farm' },
  
  // Beach stickers
  { type: 'sticker', key: 'shell', title: 'Shell', theme: 'beach' },
  { type: 'sticker', key: 'starfish', title: 'Starfish', theme: 'beach' },
  { type: 'sticker', key: 'pail', title: 'Pail', theme: 'beach' },
  { type: 'sticker', key: 'crab', title: 'Crab', theme: 'beach' },
  { type: 'sticker', key: 'lighthouse', title: 'Lighthouse', theme: 'beach' },
  { type: 'sticker', key: 'seagull', title: 'Seagull', theme: 'beach' },
  
  // Candy stickers
  { type: 'sticker', key: 'lollipop', title: 'Lollipop', theme: 'candy' },
  { type: 'sticker', key: 'jellybean', title: 'Jellybean', theme: 'candy' },
  { type: 'sticker', key: 'cupcake', title: 'Cupcake', theme: 'candy' },
  { type: 'sticker', key: 'gumdrop', title: 'Gumdrop', theme: 'candy' },
  { type: 'sticker', key: 'candy_cane', title: 'Candy Cane', theme: 'candy' },
  { type: 'sticker', key: 'chocolate', title: 'Chocolate', theme: 'candy' },
  
  // Space stickers
  { type: 'sticker', key: 'star', title: 'Star', theme: 'space' },
  { type: 'sticker', key: 'planet', title: 'Planet', theme: 'space' },
  { type: 'sticker', key: 'comet', title: 'Comet', theme: 'space' },
  { type: 'sticker', key: 'rocket', title: 'Rocket', theme: 'space' },
  { type: 'sticker', key: 'alien', title: 'Alien', theme: 'space' },
  { type: 'sticker', key: 'moon', title: 'Moon', theme: 'space' },
  
  // Farm decorations
  { type: 'decor', key: 'tree', title: 'Tree', theme: 'farm' },
  { type: 'decor', key: 'flower', title: 'Flower', theme: 'farm' },
  { type: 'decor', key: 'fence', title: 'Fence', theme: 'farm' },
  { type: 'decor', key: 'barn', title: 'Barn', theme: 'farm' },
  { type: 'decor', key: 'pond', title: 'Pond', theme: 'farm' },
  { type: 'decor', key: 'rock', title: 'Rock', theme: 'farm' },
  { type: 'decor', key: 'bush', title: 'Bush', theme: 'farm' },
  { type: 'decor', key: 'windmill', title: 'Windmill', theme: 'farm' },
  
  // Other items
  { type: 'costume', key: 'costume_hat_astro', title: 'Astro Hat' },
];

let idx = 0;

export async function rollReward(): Promise<Reward> {
  const reward = demoRewards[idx % demoRewards.length];
  idx++;
  return reward;
}

export async function grantReward(reward: Reward): Promise<InventoryItem> {
  return await addOwned({ 
    key: reward.key, 
    kind: reward.type, 
    title: reward.title,
    theme: reward.theme 
  });
}
