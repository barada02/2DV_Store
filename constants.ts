import { Product, TileType } from "./types";

export const TILE_SIZE = 48; // px
export const MAP_WIDTH = 15;
export const MAP_HEIGHT = 10;

// 0: Floor, 1: Wall, 2: Shelf, 3: Counter, 4: Door
// A simple 15x10 store layout
export const INITIAL_MAP: number[][] = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 2, 2, 0, 2, 2, 0, 0, 0, 2, 2, 0, 2, 2, 1],
  [1, 2, 2, 0, 2, 2, 0, 0, 0, 2, 2, 0, 2, 2, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 2, 2, 0, 3, 3, 3, 0, 2, 2, 0, 0, 0, 1],
  [1, 0, 2, 2, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 2, 2, 0, 2, 2, 0, 2, 2, 0, 2, 2, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 1, 1, 1, 1, 1, 4, 1, 1, 1, 1, 1, 1, 1, 1],
];

// Mapping coordinate keys "x,y" to Product IDs
export const PRODUCT_LOCATIONS: Record<string, string> = {
  "1,1": "apple", "2,1": "banana", "4,1": "bread", "5,1": "cheese",
  "9,1": "sword", "10,1": "shield", "12,1": "potion_red", "13,1": "potion_blue",
  "2,4": "book_spell", "3,4": "book_history", "9,4": "boots", "10,4": "helmet",
  "1,7": "gem_red", "2,7": "gem_blue", "4,7": "scroll", "5,7": "wand",
  "7,7": "herb", "8,7": "mushroom", "10,7": "meat", "11,7": "fish"
};

export const PRODUCTS: Record<string, Product> = {
  apple: { id: "apple", name: "Crimson Apple", emoji: "🍎", basePrice: 5 },
  banana: { id: "banana", name: "Curved Yellow Fruit", emoji: "🍌", basePrice: 3 },
  bread: { id: "bread", name: "Dwarven Bread", emoji: "🍞", basePrice: 8 },
  cheese: { id: "cheese", name: "Stinky Wheel", emoji: "🧀", basePrice: 12 },
  sword: { id: "sword", name: "Rusty Iron Sword", emoji: "🗡️", basePrice: 150 },
  shield: { id: "shield", name: "Wooden Buckler", emoji: "🛡️", basePrice: 100 },
  potion_red: { id: "potion_red", name: "Health Potion", emoji: "🧪", basePrice: 50 },
  potion_blue: { id: "potion_blue", name: "Mana Potion", emoji: "⚗️", basePrice: 60 },
  book_spell: { id: "book_spell", name: "Grimoire of Fire", emoji: "📕", basePrice: 500 },
  book_history: { id: "book_history", name: "History of the Realm", emoji: "📘", basePrice: 200 },
  boots: { id: "boots", name: "Leather Boots", emoji: "👢", basePrice: 80 },
  helmet: { id: "helmet", name: "Iron Helm", emoji: "🪖", basePrice: 120 },
  gem_red: { id: "gem_red", name: "Ruby Fragment", emoji: "💎", basePrice: 1000 },
  gem_blue: { id: "gem_blue", name: "Sapphire Shard", emoji: "💠", basePrice: 900 },
  scroll: { id: "scroll", name: "Mystery Scroll", emoji: "📜", basePrice: 75 },
  wand: { id: "wand", name: "Apprentice Wand", emoji: "🪄", basePrice: 300 },
  herb: { id: "herb", name: "Healing Herb", emoji: "🌿", basePrice: 15 },
  mushroom: { id: "mushroom", name: "Glowing Mushroom", emoji: "🍄", basePrice: 25 },
  meat: { id: "meat", name: "Dragon Steak", emoji: "🥩", basePrice: 60 },
  fish: { id: "fish", name: "Golden Carp", emoji: "🐟", basePrice: 45 },
};
