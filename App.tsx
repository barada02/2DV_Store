import React, { useState, useEffect, useCallback, useRef } from 'react';
import { TileMap } from './components/TileMap';
import { PlayerSprite } from './components/PlayerSprite';
import { InteractionModal } from './components/InteractionModal';
import { INITIAL_MAP, MAP_HEIGHT, MAP_WIDTH, PRODUCT_LOCATIONS, PRODUCTS } from './constants';
import { Direction, Position, TileType, GameState } from './types';

// Helper to check if a tile is walkable
const isWalkable = (x: number, y: number): boolean => {
  if (x < 0 || x >= MAP_WIDTH || y < 0 || y >= MAP_HEIGHT) return false;
  const tile = INITIAL_MAP[y][x];
  return tile === TileType.FLOOR || tile === TileType.DOOR;
};

// Helper to get interaction target based on position and direction
const getInteractionTarget = (pos: Position, dir: Direction): string | null => {
  let targetX = pos.x;
  let targetY = pos.y;

  switch (dir) {
    case 'UP': targetY -= 1; break;
    case 'DOWN': targetY += 1; break;
    case 'LEFT': targetX -= 1; break;
    case 'RIGHT': targetX += 1; break;
  }

  // Check bounds
  if (targetX < 0 || targetX >= MAP_WIDTH || targetY < 0 || targetY >= MAP_HEIGHT) return null;

  // Check if tile is a shelf/product holder
  const tile = INITIAL_MAP[targetY][targetX];
  if (tile === TileType.SHELF || tile === TileType.COUNTER) {
    return `${targetX},${targetY}`;
  }
  return null;
};

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>({
    playerPos: { x: 6, y: 9 }, // Start near the door (bottom center)
    direction: 'UP',
    isInteracting: false,
    activeProduct: null,
  });

  // Ref to access current state in event listeners without re-binding
  const gameStateRef = useRef(gameState);
  useEffect(() => {
    gameStateRef.current = gameState;
  }, [gameState]);

  const [lastMoveTime, setLastMoveTime] = useState(0);
  const [isMoving, setIsMoving] = useState(false);
  const [keysPressed, setKeysPressed] = useState<Set<string>>(new Set());
  const [nearbyProduct, setNearbyProduct] = useState<string | null>(null);

  // Focus helper for keyboard events
  useEffect(() => {
    window.focus();
  }, []);

  // Keyboard Event Handlers
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const currentGameState = gameStateRef.current;

      if (currentGameState.isInteracting) {
        if (e.key === 'Escape') {
            closeModal();
        }
        return;
      }

      // Normalize key to lowercase to support CapsLock/Shift + WASD
      const key = e.key.toLowerCase();

      setKeysPressed(prev => {
        const newSet = new Set(prev);
        newSet.add(key);
        return newSet;
      });

      // Interaction Key
      if (key === 't') {
        const targetKey = getInteractionTarget(currentGameState.playerPos, currentGameState.direction);
        if (targetKey && PRODUCT_LOCATIONS[targetKey]) {
             const productId = PRODUCT_LOCATIONS[targetKey];
             if (PRODUCTS[productId]) {
                 setGameState(prev => ({
                    ...prev,
                    isInteracting: true,
                    activeProduct: PRODUCTS[productId]
                 }));
             }
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      setKeysPressed(prev => {
        const newSet = new Set(prev);
        newSet.delete(key);
        return newSet;
      });
      // We don't set isMoving(false) here immediately to prevent stutter if swapping keys,
      // the loop handles the "stop" state if no keys remain.
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []); // Empty dependency array: bind listeners once

  // Game Loop for Movement
  useEffect(() => {
    if (gameState.isInteracting) return;

    let animationFrameId: number;

    const gameLoop = (time: number) => {
      // Limit movement speed (e.g., move every 150ms)
      if (time - lastMoveTime > 150) {
        let dx = 0;
        let dy = 0;
        let newDir: Direction | null = null;

        // Check for both Arrow keys and WASD
        // Note: keys are stored in lowercase in the Set
        if (keysPressed.has('arrowup') || keysPressed.has('w')) { dy = -1; newDir = 'UP'; }
        else if (keysPressed.has('arrowdown') || keysPressed.has('s')) { dy = 1; newDir = 'DOWN'; }
        else if (keysPressed.has('arrowleft') || keysPressed.has('a')) { dx = -1; newDir = 'LEFT'; }
        else if (keysPressed.has('arrowright') || keysPressed.has('d')) { dx = 1; newDir = 'RIGHT'; }

        if (newDir) {
            const nextX = gameState.playerPos.x + dx;
            const nextY = gameState.playerPos.y + dy;

            setGameState(prev => {
                const canMove = isWalkable(nextX, nextY);
                return {
                    ...prev,
                    direction: newDir!,
                    playerPos: canMove ? { x: nextX, y: nextY } : prev.playerPos
                };
            });
            setLastMoveTime(time);
            setIsMoving(true);
        } else {
            setIsMoving(false);
        }
      }
      animationFrameId = requestAnimationFrame(gameLoop);
    };

    animationFrameId = requestAnimationFrame(gameLoop);
    return () => cancelAnimationFrame(animationFrameId);
  }, [keysPressed, lastMoveTime, gameState.isInteracting, gameState.playerPos]);

  // Check for nearby interaction targets whenever position or direction changes
  useEffect(() => {
    const targetKey = getInteractionTarget(gameState.playerPos, gameState.direction);
    if (targetKey && PRODUCT_LOCATIONS[targetKey]) {
        const productId = PRODUCT_LOCATIONS[targetKey];
        const product = PRODUCTS[productId];
        if (product) {
            setNearbyProduct(product.name);
            return;
        }
    }
    setNearbyProduct(null);
  }, [gameState.playerPos, gameState.direction]);

  const closeModal = () => {
    setGameState(prev => ({
      ...prev,
      isInteracting: false,
      activeProduct: null
    }));
  };

  // Click interaction handler for tiles
  const handleTileClick = (x: number, y: number) => {
      if (gameState.isInteracting) return;
      
      const key = `${x},${y}`;
      const productId = PRODUCT_LOCATIONS[key];
      
      if (productId && PRODUCTS[productId]) {
        setGameState(prev => ({
          ...prev,
          isInteracting: true,
          activeProduct: PRODUCTS[productId]
        }));
      }
  };

  return (
    <div className="relative flex flex-col items-center gap-6 font-sans">
      
      {/* HUD / Header */}
      <div className="bg-slate-800 text-white p-4 rounded-xl shadow-lg border-2 border-slate-600 w-full max-w-2xl flex justify-between items-center">
        <div>
            <h1 className="text-xl font-bold text-amber-400 tracking-wider">PIXELMART AI</h1>
            <p className="text-xs text-slate-400">Powered by Gemini 2.5</p>
        </div>
        <div className="flex gap-4 text-sm">
            <div className="flex flex-col items-end">
                <span className="text-slate-400">Gold</span>
                <span className="font-mono text-yellow-400 text-lg">1,250</span>
            </div>
        </div>
      </div>

      {/* Game Viewport */}
      <div className="relative p-1 bg-slate-900 rounded-lg shadow-2xl">
        <TileMap 
            mapData={INITIAL_MAP} 
            onTileClick={handleTileClick}
        />
        
        <PlayerSprite 
            position={gameState.playerPos} 
            direction={gameState.direction}
            isMoving={isMoving}
        />

        {/* Interaction Tooltip */}
        {nearbyProduct && !gameState.isInteracting && (
            <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-white/90 text-slate-900 px-3 py-1 rounded-full text-xs font-bold animate-bounce shadow-lg border border-slate-200 z-30 whitespace-nowrap">
                Press 'T' to inspect {nearbyProduct}
            </div>
        )}
      </div>

      {/* Controls Hint */}
      <div className="text-slate-500 text-sm font-mono flex gap-6">
        <div className="flex items-center gap-2">
            <span className="bg-slate-700 px-2 py-1 rounded text-white text-xs">WASD / ARROWS</span>
            <span>Move</span>
        </div>
        <div className="flex items-center gap-2">
            <span className="bg-slate-700 px-2 py-1 rounded text-white text-xs">T / CLICK</span>
            <span>Inspect</span>
        </div>
      </div>

      {/* Interaction Modal Overlay */}
      {gameState.isInteracting && gameState.activeProduct && (
        <InteractionModal 
            product={gameState.activeProduct} 
            onClose={closeModal} 
        />
      )}
    </div>
  );
};

export default App;