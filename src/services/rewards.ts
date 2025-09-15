import { addOwned, InventoryItem } from '@/src/services/inventory';

export type Reward = {
  type: 'sticker' | 'costume' | 'decor';
  key: string;
  title?: string;
};

// Simple deterministic table for demo
const demoRewards: Reward[] = [
  { type: 'sticker', key: 'sticker_duck_01', title: 'Duck Sticker' },
  { type: 'sticker', key: 'sticker_star_01', title: 'Star Sticker' },
  { type: 'decor', key: 'decor_flower_01', title: 'Flower Decor' },
  { type: 'costume', key: 'costume_hat_astro', title: 'Astro Hat' },
];

let idx = 0;

export async function rollReward(): Promise<Reward> {
  const reward = demoRewards[idx % demoRewards.length];
  idx++;
  return reward;
}

export async function grantReward(reward: Reward): Promise<InventoryItem> {
  return await addOwned({ key: reward.key, kind: reward.type, title: reward.title });
}
