import React from 'react';
import { Position, Direction } from '../types';
import { TILE_SIZE } from '../constants';

interface PlayerSpriteProps {
  position: Position;
  direction: Direction;
  isMoving: boolean;
}

export const PlayerSprite: React.FC<PlayerSpriteProps> = ({ position, direction, isMoving }) => {
  // Simple CSS transform for position
  const style: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: TILE_SIZE,
    height: TILE_SIZE,
    transform: `translate(${position.x * TILE_SIZE}px, ${position.y * TILE_SIZE}px)`,
    transition: 'transform 0.2s linear', // Smooth movement
    zIndex: 20,
  };

  // Directional visuals (simple emoji rotation/flip for now, or distinct sprites)
  const getRotation = () => {
    switch (direction) {
      case 'UP': return 'rotate-180'; // Back of head
      case 'DOWN': return 'rotate-0';
      case 'LEFT': return '-scale-x-100';
      case 'RIGHT': return 'scale-x-100';
    }
  };

  return (
    <div style={style} className="flex items-center justify-center pointer-events-none">
      <div className={`relative w-10 h-10 ${isMoving ? 'animate-bounce' : ''}`}>
        {/* Shadow */}
        <div className="absolute bottom-0 left-1 w-8 h-2 bg-black opacity-30 rounded-full blur-[1px]" />
        
        {/* Character Body (Simple shapes for pixel art feel) */}
        <div className={`w-full h-full transition-transform duration-100 ${getRotation()}`}>
            {/* Head */}
            <div className="absolute top-0 left-2 w-6 h-6 bg-blue-400 rounded-sm border-2 border-blue-900 z-10">
                {/* Eyes (only show if facing down or side) */}
                {direction !== 'UP' && (
                    <div className="flex gap-2 absolute top-2 left-1">
                        <div className="w-1 h-1 bg-black rounded-full" />
                        <div className="w-1 h-1 bg-black rounded-full" />
                    </div>
                )}
            </div>
            {/* Body */}
            <div className="absolute bottom-1 left-1 w-8 h-5 bg-blue-600 rounded-sm border-2 border-blue-900" />
            
            {/* Cap */}
             <div className="absolute -top-1 left-1 w-8 h-3 bg-red-500 rounded-t-sm border-2 border-red-800 z-20" />
        </div>
      </div>
    </div>
  );
};
