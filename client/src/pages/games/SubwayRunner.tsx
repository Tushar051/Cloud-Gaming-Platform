import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';

export default function SubwayRunner({ isMuted }: { isMuted: boolean }) {
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [playerPosition, setPlayerPosition] = useState(1); // 0=left, 1=center, 2=right
  const [obstacles, setObstacles] = useState<Array<{ lane: number; position: number }>>([]);

  // Handle keyboard input
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'ArrowLeft') setPlayerPosition(prev => Math.max(0, prev - 1));
    if (e.key === 'ArrowRight') setPlayerPosition(prev => Math.min(2, prev + 1));
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
      
      // Generate new obstacles
      if (Math.random() < 0.1) {
        setObstacles(prev => [...prev, { lane: Math.floor(Math.random() * 3), position: 100 }]);
      }

      // Move obstacles
      setObstacles(prev => 
        prev.map(obs => ({ ...obs, position: obs.position - 5 }))
          .filter(obs => obs.position > -10)
      );

      // Check collisions
      const collision = obstacles.some(
        obs => obs.position < 20 && obs.position > 0 && obs.lane === playerPosition
      );
      if (collision) setGameOver(true);
    }, 100);

    return () => clearInterval(gameLoop);
  }, [gameOver, obstacles, playerPosition]);

  const restartGame = () => {
    setGameOver(false);
    setScore(0);
    setObstacles([]);
    setPlayerPosition(1);
  };

  return (
    <div className="relative w-full h-full bg-gray-800 overflow-hidden">
      {/* Score */}
      <div className="absolute top-4 left-4 text-white text-xl font-bold">Score: {score}</div>
      
      {/* Player */}
      <div 
        className={`absolute bottom-20 w-16 h-16 bg-blue-500 rounded-full transition-all duration-100 ${
          playerPosition === 0 ? 'left-1/4' : playerPosition === 1 ? 'left-1/2' : 'left-3/4'
        } transform -translate-x-1/2`}
      />
      
      {/* Obstacles */}
      {obstacles.map((obs, i) => (
        <div
          key={i}
          className={`absolute w-16 h-16 bg-red-500 rounded-lg ${
            obs.lane === 0 ? 'left-1/4' : obs.lane === 1 ? 'left-1/2' : 'left-3/4'
          } transform -translate-x-1/2`}
          style={{ bottom: '80px', left: `${obs.position}%` }}
        />
      ))}
      
      {/* Track lines */}
      <div className="absolute bottom-16 left-1/4 w-1 h-full bg-white opacity-30" />
      <div className="absolute bottom-16 left-2/4 w-1 h-full bg-white opacity-30" />
      <div className="absolute bottom-16 left-3/4 w-1 h-full bg-white opacity-30" />
      
      {/* Game over screen */}
      {gameOver && (
        <div className="absolute inset-0 bg-black bg-opacity-70 flex flex-col items-center justify-center">
          <h2 className="text-4xl font-bold text-white mb-4">Game Over!</h2>
          <p className="text-2xl text-white mb-6">Score: {score}</p>
          <motion.button
            className="bg-blue-500 text-white px-6 py-3 rounded-lg font-bold"
            onClick={restartGame}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Play Again
          </motion.button>
        </div>
      )}
    </div>
  );
}