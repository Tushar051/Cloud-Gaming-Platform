import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';

export default function PixelRacer({ isMuted }: { isMuted: boolean }) {
  const [score, setScore] = useState(0);
  const [playerX, setPlayerX] = useState(50);
  const [cars, setCars] = useState<Array<{ x: number; y: number; speed: number }>>([]);
  const [gameOver, setGameOver] = useState(false);

  // Handle keyboard input
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'ArrowLeft') setPlayerX(prev => Math.max(10, prev - 10));
    if (e.key === 'ArrowRight') setPlayerX(prev => Math.min(90, prev + 10));
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Game loop
  useEffect(() => {
    if (gameOver) return;

    const gameLoop = setInterval(() => {
      setScore(prev => prev + 1);
      
      // Generate new cars
      if (Math.random() < 0.05) {
        setCars(prev => [...prev, {
          x: Math.random() * 80 + 10,
          y: -10,
          speed: Math.random() * 3 + 2
        }]);
      }

      // Move cars
      setCars(prev => 
        prev.map(car => ({ ...car, y: car.y + car.speed }))
          .filter(car => car.y < 110)
      );

      // Check collisions
      const collision = cars.some(
        car => car.y > 80 && car.y < 90 && Math.abs(car.x - playerX) < 10
      );
      if (collision) setGameOver(true);
    }, 50);

    return () => clearInterval(gameLoop);
  }, [gameOver, cars, playerX]);

  const restartGame = () => {
    setGameOver(false);
    setScore(0);
    setCars([]);
    setPlayerX(50);
  };

  return (
    <div className="relative w-full h-full bg-gray-900 overflow-hidden">
      {/* Score */}
      <div className="absolute top-4 left-4 text-white text-xl font-bold">Score: {score}</div>
      
      {/* Road */}
      <div className="absolute top-0 left-1/4 w-1/2 h-full bg-gray-700 border-l-4 border-r-4 border-yellow-500">
        {/* Road markings */}
        <div className="absolute left-1/2 w-1 h-full bg-yellow-300 transform -translate-x-1/2" style={{ backgroundImage: 'repeating-linear-gradient(to bottom, transparent, transparent 30px, yellow 30px, yellow 60px)' }} />
      </div>
      
      {/* Player car */}
      <div 
        className="absolute bottom-10 w-8 h-16 bg-blue-500 transform -translate-x-1/2"
        style={{ left: `${playerX}%` }}
      />
      
      {/* Other cars */}
      {cars.map((car, i) => (
        <div
          key={i}
          className="absolute w-8 h-16 bg-red-500 transform -translate-x-1/2"
          style={{ left: `${car.x}%`, top: `${car.y}%` }}
        />
      ))}
      
      {/* Game over screen */}
      {gameOver && (
        <div className="absolute inset-0 bg-black bg-opacity-70 flex flex-col items-center justify-center">
          <h2 className="text-4xl font-bold text-white mb-4">Crash!</h2>
          <p className="text-2xl text-white mb-6">Score: {score}</p>
          <motion.button
            className="bg-blue-500 text-white px-6 py-3 rounded-lg font-bold"
            onClick={restartGame}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Race Again
          </motion.button>
        </div>
      )}
    </div>
  );
}