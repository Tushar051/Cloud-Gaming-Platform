import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';

export default function SpaceInvaders({ isMuted }: { isMuted: boolean }) {
  const [playerX, setPlayerX] = useState(50);
  const [bullets, setBullets] = useState<Array<{ x: number; y: number }>>([]);
  const [aliens, setAliens] = useState<Array<{ x: number; y: number }>>([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [level, setLevel] = useState(1);

  // Initialize aliens
  useEffect(() => {
    const newAliens = [];
    for (let y = 0; y < 3; y++) {
      for (let x = 0; x < 8; x++) {
        newAliens.push({ x: x * 10 + 15, y: y * 10 + 10 });
      }
    }
    setAliens(newAliens);
  }, [level]);

  // Handle keyboard input
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'ArrowLeft') setPlayerX(prev => Math.max(10, prev - 5));
    if (e.key === 'ArrowRight') setPlayerX(prev => Math.min(90, prev + 5));
    if (e.key === ' ') {
      setBullets(prev => [...prev, { x: playerX, y: 90 }]);
    }
  }, [playerX]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Game loop
  useEffect(() => {
    if (gameOver || aliens.length === 0) return;

    const gameLoop = setInterval(() => {
      // Move bullets
      setBullets(prev => 
        prev.map(bullet => ({ ...bullet, y: bullet.y - 5 }))
          .filter(bullet => bullet.y > 0)
      );

      // Move aliens
      setAliens(prev => {
        const shouldMoveDown = prev.some(alien => alien.x <= 5 || alien.x >= 95);
        return prev.map(alien => ({
          x: shouldMoveDown ? alien.x : alien.x + (level % 2 === 0 ? -1 : 1),
          y: shouldMoveDown ? alien.y + 2 : alien.y
        }));
      });

      // Check bullet-alien collisions
      setBullets(prev => {
        const newBullets = [...prev];
        setAliens(currentAliens => {
          return currentAliens.filter(alien => {
            const hit = newBullets.some((bullet, i) => {
              const distance = Math.sqrt(
                Math.pow(bullet.x - alien.x, 2) + Math.pow(bullet.y - alien.y, 2)
              );
              if (distance < 8) {
                newBullets.splice(i, 1);
                setScore(s => s + 100);
                return true;
              }
              return false;
            });
            return !hit;
          });
        });
        return newBullets;
      });

      // Check if aliens reached bottom
      if (aliens.some(alien => alien.y >= 85)) {
        setGameOver(true);
      }

      // Alien bullets (random attacks)
      if (Math.random() < 0.02) {
        const randomAlien = aliens[Math.floor(Math.random() * aliens.length)];
        setBullets(prev => [...prev, { x: randomAlien.x, y: randomAlien.y + 5 }]);
      }

      // Check player hit
      const playerHit = bullets.some(
        bullet => bullet.y >= 85 && Math.abs(bullet.x - playerX) < 5
      );
      if (playerHit) setGameOver(true);

      // Level complete
      if (aliens.length === 0) {
        setLevel(l => l + 1);
        setBullets([]);
      }
    }, 50);

    return () => clearInterval(gameLoop);
  }, [gameOver, aliens, playerX, level]);

  const restartGame = () => {
    setGameOver(false);
    setScore(0);
    setLevel(1);
    setBullets([]);
    setPlayerX(50);
  };

  return (
    <div className="relative w-full h-full bg-black overflow-hidden">
      {/* Score */}
      <div className="absolute top-4 left-4 text-white text-xl font-bold">
        Score: {score} | Level: {level}
      </div>
      
      {/* Player */}
      <div 
        className="absolute bottom-4 w-10 h-6 bg-green-500 transform -translate-x-1/2"
        style={{ left: `${playerX}%` }}
      />
      
      {/* Bullets */}
      {bullets.map((bullet, i) => (
        <div
          key={i}
          className="absolute w-2 h-6 bg-yellow-400 transform -translate-x-1/2"
          style={{ left: `${bullet.x}%`, top: `${bullet.y}%` }}
        />
      ))}
      
      {/* Aliens */}
      {aliens.map((alien, i) => (
        <div
          key={i}
          className="absolute w-8 h-8 bg-red-500 transform -translate-x-1/2 -translate-y-1/2"
          style={{ left: `${alien.x}%`, top: `${alien.y}%` }}
        >
          <div className="absolute w-6 h-2 bg-red-700 top-1 left-1"></div>
        </div>
      ))}
      
      {/* Game over screen */}
      {gameOver && (
        <div className="absolute inset-0 bg-black bg-opacity-70 flex flex-col items-center justify-center">
          <h2 className="text-4xl font-bold text-white mb-4">Game Over!</h2>
          <p className="text-2xl text-white mb-6">Score: {score}</p>
          <motion.button
            className="bg-green-500 text-white px-6 py-3 rounded-lg font-bold"
            onClick={restartGame}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Play Again
          </motion.button>
        </div>
      )}
      
      {/* Level complete */}
      {aliens.length === 0 && !gameOver && (
        <div className="absolute inset-0 bg-black bg-opacity-70 flex flex-col items-center justify-center">
          <h2 className="text-4xl font-bold text-white mb-4">Level Complete!</h2>
          <p className="text-2xl text-white mb-6">Score: {score}</p>
          <motion.button
            className="bg-green-500 text-white px-6 py-3 rounded-lg font-bold"
            onClick={() => setAliens([])} // This will trigger the useEffect to create new aliens
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Next Level
          </motion.button>
        </div>
      )}
    </div>
  );
}