import React from 'react';
import { TileType } from '../types';
import { INITIAL_MAP, TILE_SIZE, PRODUCTS, PRODUCT_LOCATIONS } from '../constants';

interface TileMapProps {
  mapData: number[][];
  onTileClick?: (x: number, y: number) => void;
}

const getTileStyle = (type: number): string => {
  switch (type) {
    case TileType.WALL:
      return 'bg-slate-700 border-b-4 border-slate-900 shadow-inner';
    case TileType.SHELF:
      return 'bg-amber-800 border-b-4 border-amber-900 shadow-md relative cursor-pointer hover:brightness-110';
    case TileType.COUNTER:
      return 'bg-amber-200 border-b-4 border-amber-400 cursor-pointer hover:brightness-105';
    case TileType.DOOR:
      return 'bg-slate-800 border-4 border-slate-600';
    case TileType.FLOOR:
    default:
      return 'bg-amber-50'; // Wood-ish floor or generic tile
  }
};

export const TileMap: React.FC<TileMapProps> = ({ mapData, onTileClick }) => {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${mapData[0].length}, ${TILE_SIZE}px)`,
        gridTemplateRows: `repeat(${mapData.length}, ${TILE_SIZE}px)`,
      }}
      className="relative shadow-2xl border-8 border-slate-800 rounded-lg overflow-hidden select-none"
    >
      {mapData.map((row, y) =>
        row.map((cell, x) => {
          const productKey = `${x},${y}`;
          const productId = PRODUCT_LOCATIONS[productKey];
          const product = productId ? PRODUCTS[productId] : null;

          return (
            <div
              key={`${x}-${y}`}
              onClick={() => onTileClick?.(x, y)}
              className={`w-full h-full flex items-center justify-center ${getTileStyle(cell)} transition-all duration-150`}
            >
              {/* Floor Texture Detail */}
              {cell === TileType.FLOOR && (
                 <div className="w-1 h-1 bg-amber-200 rounded-full opacity-50" />
              )}
              
              {/* Wall Detail */}
              {cell === TileType.WALL && (
                 <div className="w-full h-2 bg-slate-600 absolute top-0" />
              )}

              {/* Product on Shelf */}
              {cell === TileType.SHELF && product && (
                <span className="text-2xl z-10 filter drop-shadow-sm animate-pulse-slow">
                  {product.emoji}
                </span>
              )}
            </div>
          );
        })
      )}
    </div>
  );
};