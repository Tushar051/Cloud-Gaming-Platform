import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';

export default function FlappyBird({ isMuted }: { isMuted: boolean }) {
  const [birdY, setBirdY] = useState(50);
  const [velocity, setVelocity] = useState(0);
  const [pipes, setPipes] = useState<Array<{ x: number; topHeight: number }>>([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);

  // Handle keyboard input
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.code === 'Space') {
      if (!gameStarted) {
        setGameStarted(true);
      }
      setVelocity(-5);
    }
  }, [gameStarted]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Game loop
  useEffect(() => {
    if (!gameStarted || gameOver) return;

    const gameLoop = setInterval(() => {
      // Bird physics
      setVelocity(v => v + 0.3);
      setBirdY(y => y + velocity);

      // Generate pipes
      if (pipes.length === 0 || pipes[pipes.length - 1].x < 50) {
        const topHeight = Math.random() * 30 + 20;
        setPipes(prev => [...prev, { x: 100, topHeight }]);
      }

      // Move pipes
      setPipes(prev => 
        prev.map(pipe => ({ ...pipe, x: pipe.x - 1 }))
          .filter(pipe => pipe.x > -10)
      );

      // Score point when passing a pipe
      setPipes(prev => {
        const newPipes = [...prev];
        const passedPipe = newPipes.find(pipe => pipe.x < 20 && pipe.x > 18);
        if (passedPipe) {
          setScore(s => s + 1);
        }
        return newPipes;
      });

      // Check collisions
      const hitTopOrBottom = birdY < 0 || birdY > 100;
      const hitPipe = pipes.some(pipe => {
        const inPipeRange = pipe.x < 25 && pipe.x > 0;
        const inPipeGap = birdY > pipe.topHeight && birdY < pipe.topHeight + 30;
        return inPipeRange && !inPipeGap;
      });
      
      if (hitTopOrBottom || hitPipe) {
        setGameOver(true);
      }
    }, 20);

    return () => clearInterval(gameLoop);
  }, [gameStarted, gameOver, birdY, velocity, pipes]);

  const restartGame = () => {
    setBirdY(50);
    setVelocity(0);
    setPipes([]);
    setScore(0);
    setGameOver(false);
    setGameStarted(false);
  };

  return (
    <div className="relative w-full h-full bg-sky-400 overflow-hidden">
      {/* Score */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 text-white text-xl font-bold">
        Score: {score}
      </div>
      
      {/* Bird */}
      <div 
        className="absolute w-8 h-8 bg-yellow-400 rounded-full transform -translate-x-1/2 -translate-y-1/2"
        style={{ left: '20%', top: `${birdY}%` }}
      >
        <div className="absolute w-2 h-2 bg-white rounded-full top-2 left-2"></div>
      </div>
      
      {/* Pipes */}
      {pipes.map((pipe, i) => (
        <div key={i}>
          {/* Top pipe */}
          <div
            className="absolute bg-green-500 border-r-4 border-l-4 border-green-700"
            style={{ 
              left: `${pipe.x}%`, 
              top: 0, 
              width: '40px', 
              height: `${pipe.topHeight}%` 
            }}
          />
          {/* Bottom pipe */}
          <div
            className="absolute bg-green-500 border-r-4 border-l-4 border-green-700"
            style={{ 
              left: `${pipe.x}%`, 
              top: `${pipe.topHeight + 30}%`, 
              width: '40px', 
              height: `${100 - pipe.topHeight - 30}%` 
            }}
          />
        </div>
      ))}
      
      {/* Ground */}
      <div className="absolute bottom-0 w-full h-8 bg-yellow-700"></div>
      
      {/* Start screen */}
      {!gameStarted && !gameOver && (
        <div className="absolute inset-0 bg-black bg-opacity-30 flex flex-col items-center justify-center">
          <h2 className="text-4xl font-bold text-white mb-4">Flappy Bird</h2>
          <p className="text-xl text-white mb-6">Press Space to start</p>
        </div>
      )}
      
      {/* Game over screen */}
      {gameOver && (
        <div className="absolute inset-0 bg-black bg-opacity-70 flex flex-col items-center justify-center">
          <h2 className="text-4xl font-bold text-white mb-4">Game Over!</h2>
          <p className="text-2xl text-white mb-6">Score: {score}</p>
          <motion.button
            className="bg-yellow-500 text-white px-6 py-3 rounded-lg font-bold"
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