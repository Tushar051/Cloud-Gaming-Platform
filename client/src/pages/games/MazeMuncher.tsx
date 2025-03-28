import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';


const maze = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 0, 0, 0, 1, 0, 0, 0, 0, 1],
  [1, 0, 1, 0, 1, 0, 1, 1, 0, 1],
  [1, 0, 1, 0, 0, 0, 1, 0, 0, 1],
  [1, 0, 1, 1, 1, 1, 1, 0, 1, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 1, 1, 0, 1, 1, 1, 1, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];

// Power-up types
type PowerUpType = 'speed' | 'invincibility' | 'ghost-slow';

export default function MazeMuncher({ isMuted }: { isMuted: boolean }) {
  const [playerPos, setPlayerPos] = useState({ x: 1, y: 1 });
  const [dots, setDots] = useState<Array<{ x: number; y: number }>>([]);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [powerUps, setPowerUps] = useState<Array<{ x: number; y: number; type: PowerUpType }>>([]);
  const [activePowerUp, setActivePowerUp] = useState<{ type: PowerUpType; timeLeft: number } | null>(null);
  const [ghosts, setGhosts] = useState<Array<{ x: number; y: number; dx: number; dy: number }>>([
    { x: 8, y: 8, dx: 1, dy: 0 },
    { x: 7, y: 7, dx: -1, dy: 0 }
  ]);
  const [gameSpeed, setGameSpeed] = useState(500);
  const [isGameOver, setIsGameOver] = useState(false);

  // Initialize dots and power-ups
  useEffect(() => {
    const initialDots = [];
    const initialPowerUps = [];

    for (let y = 0; y < maze.length; y++) {
      for (let x = 0; x < maze[0].length; x++) {
        if (maze[y][x] === 0 && !(x === 1 && y === 1)) {
          initialDots.push({ x, y });
          
          // Randomly place power-ups (5% chance)
          if (Math.random() < 0.05) {
            const powerUpType = ['speed', 'invincibility', 'ghost-slow'][Math.floor(Math.random() * 3)] as PowerUpType;
            initialPowerUps.push({ x, y, type: powerUpType });
          }
        }
      }
    }
    setDots(initialDots);
    setPowerUps(initialPowerUps);
  }, []);

  // Handle power-up effects
  useEffect(() => {
    let powerUpTimer: NodeJS.Timeout;
    if (activePowerUp) {
      powerUpTimer = setTimeout(() => {
        if (activePowerUp.timeLeft > 0) {
          setActivePowerUp(prev => prev ? { ...prev, timeLeft: prev.timeLeft - 1 } : null);
        } else {
          setActivePowerUp(null);
          // Reset game speed to normal
          setGameSpeed(500);
        }
      }, 1000);
    }
    return () => clearTimeout(powerUpTimer);
  }, [activePowerUp]);

  // Handle keyboard input
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (isGameOver) return;

    let newX = playerPos.x;
    let newY = playerPos.y;

    if (e.key === 'ArrowUp') newY--;
    if (e.key === 'ArrowDown') newY++;
    if (e.key === 'ArrowLeft') newX--;
    if (e.key === 'ArrowRight') newX++;

    // Check if new position is valid (not a wall)
    if (maze[newY]?.[newX] === 0) {
      setPlayerPos({ x: newX, y: newY });

      // Check if player collected a dot
      setDots(prev => {
        const dotIndex = prev.findIndex(dot => dot.x === newX && dot.y === newY);
        if (dotIndex !== -1) {
          setScore(s => s + 10);
          return prev.filter((_, i) => i !== dotIndex);
        }
        return prev;
      });

      // Check if player collected a power-up
      setPowerUps(prev => {
        const powerUpIndex = prev.findIndex(pu => pu.x === newX && pu.y === newY);
        if (powerUpIndex !== -1) {
          const powerUp = prev[powerUpIndex];
          
          // Apply power-up effects
          switch (powerUp.type) {
            case 'speed':
              setGameSpeed(300);
              setActivePowerUp({ type: 'speed', timeLeft: 10 });
              break;
            case 'invincibility':
              setActivePowerUp({ type: 'invincibility', timeLeft: 10 });
              break;
            case 'ghost-slow':
              setGameSpeed(800);
              setActivePowerUp({ type: 'ghost-slow', timeLeft: 10 });
              break;
          }

          return prev.filter((_, i) => i !== powerUpIndex);
        }
        return prev;
      });
    }
  }, [playerPos, isGameOver]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Ghost movement
  useEffect(() => {
    if (dots.length === 0 || isGameOver) return;

    const ghostInterval = setInterval(() => {
      setGhosts(prev => 
        prev.map(ghost => {
          // Reduced ghost speed if 'ghost-slow' power-up is active
          if (activePowerUp?.type === 'ghost-slow' && Math.random() > 0.5) return ghost;

          // Simple AI: try to move toward player
          let dx = 0, dy = 0;
          if (Math.random() < 0.5) {
            dx = ghost.x < playerPos.x ? 1 : ghost.x > playerPos.x ? -1 : 0;
          } else {
            dy = ghost.y < playerPos.y ? 1 : ghost.y > playerPos.y ? -1 : 0;
          }

          // Check if new position is valid
          if (maze[ghost.y + dy]?.[ghost.x + dx] === 0) {
            return { ...ghost, x: ghost.x + dx, y: ghost.y + dy, dx, dy };
          }
          return ghost;
        })
      );

      // Check collisions with ghosts
      const collision = ghosts.some(ghost => 
        ghost.x === playerPos.x && ghost.y === playerPos.y
      );

      if (collision && activePowerUp?.type !== 'invincibility') {
        setLives(prev => {
          const newLives = prev - 1;
          if (newLives <= 0) {
            setIsGameOver(true);
            alert(`Game Over! Score: ${score}`);
          }
          return newLives;
        });
      }
    }, gameSpeed);

    return () => clearInterval(ghostInterval);
  }, [dots.length, ghosts, playerPos, score, gameSpeed, activePowerUp, isGameOver]);

  const renderPowerUpIcon = (type: PowerUpType) => {
    switch (type) {
      case 'speed': return '⚡';
      case 'invincibility': return '🛡️';
      case 'ghost-slow': return '🐌';
    }
  };

  return (
    <div className="flex items-center justify-center w-full h-full bg-black">
      <div className="relative">
        {/* Maze */}
        <div className="grid gap-0">
          {maze.map((row, y) => (
            <div key={y} className="flex">
              {row.map((cell, x) => (
                <div 
                  key={x} 
                  className={`w-8 h-8 ${cell === 1 ? 'bg-blue-800' : 'bg-black'}`}
                />
              ))}
            </div>
          ))}
        </div>
        
        {/* Dots */}
        {dots.map((dot, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-yellow-300 rounded-full transform -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${dot.x * 32 + 16}px`, top: `${dot.y * 32 + 16}px` }}
          />
        ))}
        
        {/* Power-ups */}
        {powerUps.map((powerUp, i) => (
          <div
            key={i}
            className="absolute w-4 h-4 bg-green-300 rounded-full transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center"
            style={{ left: `${powerUp.x * 32 + 16}px`, top: `${powerUp.y * 32 + 16}px` }}
          >
            <span className="text-xs">{renderPowerUpIcon(powerUp.type)}</span>
          </div>
        ))}
        
        {/* Player */}
        <div
          className={`absolute w-6 h-6 rounded-full transform -translate-x-1/2 -translate-y-1/2 
            ${activePowerUp?.type === 'invincibility' ? 'bg-purple-500' : 'bg-yellow-400'}`}
          style={{ left: `${playerPos.x * 32 + 16}px`, top: `${playerPos.y * 32 + 16}px` }}
        />
        
        {/* Ghosts */}
        {ghosts.map((ghost, i) => (
          <div
            key={i}
            className={`absolute w-6 h-6 rounded-t-full transform -translate-x-1/2 -translate-y-1/2 
              ${activePowerUp?.type === 'ghost-slow' ? 'bg-blue-500' : 'bg-red-500'}`}
            style={{ left: `${ghost.x * 32 + 16}px`, top: `${ghost.y * 32 + 16}px` }}
          />
        ))}
        
        {/* Game Info */}
        <div className="absolute top-0 left-0 mt-2 ml-2 text-white font-bold flex space-x-4">
          <span>Score: {score}</span>
          <span>Lives: {lives}</span>
          {activePowerUp && (
            <span>
              {renderPowerUpIcon(activePowerUp.type)} {activePowerUp.timeLeft}s
            </span>
          )}
        </div>
        
        {/* Win condition */}
        {dots.length === 0 && (
          <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-4xl font-bold text-white mb-4">You Win!</h2>
              <p className="text-2xl text-white mb-6">Score: {score}</p>
              <motion.button
                className="bg-blue-500 text-white px-6 py-3 rounded-lg font-bold"
                onClick={() => window.location.reload()}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Play Again
              </motion.button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}