
export const COLORS = {
  EMERALD_DEEP: '#01261a',
  EMERALD_BRIGHT: '#0a5c36',
  GOLD_METALLIC: '#d4af37',
  GOLD_BRIGHT: '#f9e27d',
  GOLD_DEEP: '#c5a028',
  RED_CRIMSON: '#ff0000', // More saturated red
  ROYAL_PURPLE: '#6a0dad',
  MIDNIGHT_BLUE: '#003366',
  WHITE_GLOW: '#ffffff',
};

export const GIFT_PALETTE = [
  '#0a5c36', // Emerald
  '#ff0000', // Saturated Red
  '#6a0dad', // Royal Purple
  '#0044cc', // Saturated Blue
  '#ff007f', // Rose
];

export const TREE_CONFIG = {
  HEIGHT: 12,
  BASE_RADIUS: 4,
  FOLIAGE_COUNT: 45000,
  ORNAMENT_COUNT: 600, // Increased for more richness
  SCATTER_RADIUS: 15,
};

export enum TreeState {
  SCATTERED = 0,
  TREE_SHAPE = 1,
}
