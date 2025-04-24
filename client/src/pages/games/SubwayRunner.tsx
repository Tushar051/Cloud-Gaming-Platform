import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';

// Types for better type safety
type Obstacle = { 
  id: number; 
  lane: number; 
  position: number; 
  type: 'normal' | 'power-up' | 'enemy';
};


type GameDifficulty = 'easy' | 'medium' | 'hard';

export default function SubwayRunner({ isMuted }: { isMuted: boolean }) {
  // Enhanced state management
  const [gameState, setGameState] = useState({
    score: 0,
    highScore: parseInt(localStorage.getItem('subwayRunnerHighScore') || '0'),
    lives: 3,
    gameOver: false,
    difficulty: 'easy' as GameDifficulty,
    powerUps: {
      shield: false,
      speedBoost: false
    }
  });

  const [playerPosition, setPlayerPosition] = useState(1);
  const [obstacles, setObstacles] = useState<Obstacle[]>([]);
  const [gameSpeed, setGameSpeed] = useState(100);

  // Difficulty-based configurations
  const difficultyConfig = useMemo(() => ({
    easy: { obstacleSpawnRate: 0.1, lives: 3, baseSpeed: 100 },
    medium: { obstacleSpawnRate: 0.2, lives: 2, baseSpeed: 80 },
    hard: { obstacleSpawnRate: 0.3, lives: 1, baseSpeed: 60 }
  }), []);

  // Keyboard and touch controls
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (gameState.gameOver) return;

    switch (e.key) {
      case 'ArrowLeft':
        setPlayerPosition(prev => Math.max(0, prev - 1));
        break;
      case 'ArrowRight':
        setPlayerPosition(prev => Math.min(2, prev + 1));
        break;
      case 'ArrowUp':
        // Potential future jump mechanic
        break;
    }
  }, [gameState.gameOver]);

  // Touch controls for mobile
  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (gameState.gameOver) return;
    
    const containerWidth = (e.currentTarget as HTMLElement).clientWidth;
    const touchX = e.touches[0].clientX;
    const laneWidth = containerWidth / 3;

    if (touchX < laneWidth) setPlayerPosition(0);
    else if (touchX < laneWidth * 2) setPlayerPosition(1);
    else setPlayerPosition(2);
  }, [gameState.gameOver]);

  // Game initialization and event listeners
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('touchmove', handleTouchMove);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, [handleKeyDown, handleTouchMove]);

  // Advanced game loop
  useEffect(() => {
    if (gameState.gameOver) return;

    const gameLoop = setInterval(() => {
      const currentConfig = difficultyConfig[gameState.difficulty];

      // Increment score and adjust difficulty
      setGameState(prev => ({
        ...prev,
        score: prev.score + 1,
        difficulty: 
          prev.score > 500 ? 'hard' : 
          prev.score > 200 ? 'medium' : 'easy'
      }));

      // Dynamically adjust game speed based on difficulty
      setGameSpeed(currentConfig.baseSpeed);

      // Obstacle generation with varied types
      if (Math.random() < currentConfig.obstacleSpawnRate) {
        const obstacleTypes: Obstacle['type'][] = ['normal', 'normal', 'normal', 'power-up', 'enemy'];
        setObstacles(prev => [...prev, { 
          id: Date.now(),
          lane: Math.floor(Math.random() * 3), 
          position: 100,
          type: obstacleTypes[Math.floor(Math.random() * obstacleTypes.length)]
        }]);
      }

      // Move and filter obstacles
      setObstacles(prev => 
        prev.map(obs => ({ ...obs, position: obs.position - 5 }))
          .filter(obs => obs.position > -10)
      );

      // Collision detection with power-up and enemy mechanics
      const collision = obstacles.find(
        obs => obs.position < 20 && obs.position > 0 && obs.lane === playerPosition
      );

      if (collision) {
        if (collision.type === 'power-up') {
          // Collect power-up
          setGameState(prev => ({
            ...prev,
            powerUps: {
              shield: Math.random() < 0.5,
              speedBoost: Math.random() < 0.5
            }
          }));
          // Remove collected power-up
          setObstacles(prev => prev.filter(obs => obs.id !== collision.id));
        } else if (collision.type === 'enemy') {
          // Lose a life or end game
          setGameState(prev => {
            const newLives = prev.powerUps.shield ? prev.lives : prev.lives - 1;
            return {
              ...prev,
              lives: newLives,
              gameOver: newLives <= 0,
              powerUps: { shield: false, speedBoost: false }
            };
          });
        }
      }
    }, gameSpeed);

    return () => clearInterval(gameLoop);
  }, [gameState.gameOver, obstacles, playerPosition, gameState.difficulty]);

  // Restart game with optional difficulty selection
  const restartGame = (difficulty?: GameDifficulty) => {
    const newHighScore = Math.max(gameState.score, gameState.highScore);
    localStorage.setItem('subwayRunnerHighScore', newHighScore.toString());

    setGameState({
      score: 0,
      highScore: newHighScore,
      lives: difficultyConfig[difficulty || 'easy'].lives,
      gameOver: false,
      difficulty: difficulty || 'easy',
      powerUps: { shield: false, speedBoost: false }
    });
    setObstacles([]);
    setPlayerPosition(1);
  };

  return (
    <div 
      className="relative w-full h-full bg-gray-800 overflow-hidden touch-none"
      style={{ userSelect: 'none' }}
    >
      {/* Game UI */}
      <div className="absolute top-4 left-4 text-white text-xl font-bold">
        Score: {gameState.score} | High Score: {gameState.highScore}
      </div>
      <div className="absolute top-4 right-4 text-white text-xl font-bold">
        Lives: {gameState.lives} | Difficulty: {gameState.difficulty}
      </div>

      {/* Power-up indicators */}
      {gameState.powerUps.shield && (
        <div className="absolute top-16 left-4 text-green-500">Shield Active</div>
      )}
      {gameState.powerUps.speedBoost && (
        <div className="absolute top-16 right-4 text-yellow-500">Speed Boost</div>
      )}
      
      {/* Player */}
      <div 
        className={`
          absolute bottom-20 w-16 h-16 rounded-full transition-all duration-100
          ${gameState.powerUps.shield ? 'bg-green-500' : 'bg-blue-500'}
          ${
            playerPosition === 0 ? 'left-1/4' : 
            playerPosition === 1 ? 'left-1/2' : 'left-3/4'
          } transform -translate-x-1/2
        `}
      />
      
      {/* Obstacles */}
      {obstacles.map((obs) => (
        <div
          key={obs.id}
          className={`
            absolute w-16 h-16 rounded-lg
            ${
              obs.type === 'normal' ? 'bg-red-500' : 
              obs.type === 'power-up' ? 'bg-green-500' : 'bg-purple-500'
            }
            ${
              obs.lane === 0 ? 'left-1/4' : 
              obs.lane === 1 ? 'left-1/2' : 'left-3/4'
            } transform -translate-x-1/2
          `}
          style={{ bottom: '80px', left: `${obs.position}%` }}
        />
      ))}
      
      {/* Track lines */}
      <div className="absolute bottom-16 left-1/4 w-1 h-full bg-white opacity-30" />
      <div className="absolute bottom-16 left-2/4 w-1 h-full bg-white opacity-30" />
      <div className="absolute bottom-16 left-3/4 w-1 h-full bg-white opacity-30" />
      
      {/* Game over screen */}
      {gameState.gameOver && (
        <div className="absolute inset-0 bg-black bg-opacity-70 flex flex-col items-center justify-center">
          <h2 className="text-4xl font-bold text-white mb-4">Game Over!</h2>
          <p className="text-2xl text-white mb-6">Score: {gameState.score}</p>
          <div className="flex space-x-4">
            {(['easy', 'medium', 'hard'] as GameDifficulty[]).map(diff => (
              <motion.button
                key={diff}
                className={`
                  text-white px-6 py-3 rounded-lg font-bold capitalize
                  ${diff === 'easy' ? 'bg-green-500' : 
                    diff === 'medium' ? 'bg-yellow-500' : 'bg-red-500'}
                `}
                onClick={() => restartGame(diff)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {diff} Mode
              </motion.button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}