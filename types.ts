export type Position = {
  x: number;
  y: number;
};

export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

export enum TileType {
  FLOOR = 0,
  WALL = 1,
  SHELF = 2,
  COUNTER = 3,
  DOOR = 4,
}

export interface Product {
  id: string;
  name: string;
  emoji: string;
  basePrice: number;
}

export interface GameState {
  playerPos: Position;
  direction: Direction;
  isInteracting: boolean;
  activeProduct: Product | null;
}
