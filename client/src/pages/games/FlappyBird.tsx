import { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { Volume2, VolumeX, RefreshCw } from 'lucide-react';

export default function FlappyBird() {
  // Game state
  const [birdY, setBirdY] = useState(50);
  const [velocity, setVelocity] = useState(0);
  const [pipes, setPipes] = useState<Array<{ x: number; topHeight: number }>>([]);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  
  // Sound and audio state
  const [isMuted, setIsMuted] = useState(false);
  const jumpSoundRef = useRef<HTMLAudioElement>(null);
  const hitSoundRef = useRef<HTMLAudioElement>(null);
  const scoreSoundRef = useRef<HTMLAudioElement>(null);

  // Difficulty settings
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const difficultySettings = {
    easy: { pipeSpeed: 0.8, gravity: 0.2, gapSize: 35 },
    medium: { pipeSpeed: 1, gravity: 0.3, gapSize: 30 },
    hard: { pipeSpeed: 1.2, gravity: 0.4, gapSize: 25 }
  };

  // Handle keyboard input
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.code === 'Space') {
      if (!gameStarted) {
        setGameStarted(true);
      }
      
      // Jump logic
      setVelocity(-5);
      
      // Play jump sound
      if (!isMuted && jumpSoundRef.current) {
        jumpSoundRef.current.currentTime = 0;
        jumpSoundRef.current.play();
      }
    }
  }, [gameStarted, isMuted]);

  // Add touch/mobile support
  const handleTouchStart = useCallback(() => {
    if (!gameStarted) {
      setGameStarted(true);
    }
    
    setVelocity(-5);
    
    // Play jump sound
    if (!isMuted && jumpSoundRef.current) {
      jumpSoundRef.current.currentTime = 0;
      jumpSoundRef.current.play();
    }
  }, [gameStarted, isMuted]);

  // Event listeners
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('touchstart', handleTouchStart);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('touchstart', handleTouchStart);
    };
  }, [handleKeyDown, handleTouchStart]);

  // Game loop
  useEffect(() => {
    if (!gameStarted || gameOver) return;

    const { pipeSpeed, gravity, gapSize } = difficultySettings[difficulty];

    const gameLoop = setInterval(() => {
      // Bird physics
      setVelocity(v => v + gravity);
      setBirdY(y => y + velocity);

      // Generate pipes
      if (pipes.length === 0 || pipes[pipes.length - 1].x < 50) {
        const topHeight = Math.random() * 30 + 20;
        setPipes(prev => [...prev, { x: 100, topHeight }]);
      }

      // Move pipes
      setPipes(prev => 
        prev.map(pipe => ({ ...pipe, x: pipe.x - pipeSpeed }))
          .filter(pipe => pipe.x > -10)
      );

      // Score point when passing a pipe
      setPipes(prev => {
        const newPipes = [...prev];
        const passedPipe = newPipes.find(pipe => pipe.x < 20 && pipe.x > 18);
        if (passedPipe) {
          const newScore = score + 1;
          setScore(newScore);
          
          // Play score sound
          if (!isMuted && scoreSoundRef.current) {
            scoreSoundRef.current.currentTime = 0;
            scoreSoundRef.current.play();
          }
          
          // Update high score
          setHighScore(prev => Math.max(prev, newScore));
        }
        return newPipes;
      });

      // Check collisions
      const hitTopOrBottom = birdY < 0 || birdY > 100;
      const hitPipe = pipes.some(pipe => {
        const inPipeRange = pipe.x < 25 && pipe.x > 0;
        const inPipeGap = birdY > pipe.topHeight && birdY < pipe.topHeight + gapSize;
        return inPipeRange && !inPipeGap;
      });
      
      if (hitTopOrBottom || hitPipe) {
        // Play hit sound
        if (!isMuted && hitSoundRef.current) {
          hitSoundRef.current.currentTime = 0;
          hitSoundRef.current.play();
        }
        
        setGameOver(true);
      }
    }, 20);

    return () => clearInterval(gameLoop);
  }, [gameStarted, gameOver, birdY, velocity, pipes, score, difficulty, isMuted]);

  const restartGame = () => {
    setBirdY(50);
    setVelocity(0);
    setPipes([]);
    setScore(0);
    setGameOver(false);
    setGameStarted(false);
  };

  return (
    <div 
      className="relative w-full h-full bg-sky-400 overflow-hidden touch-none select-none"
      onTouchStart={handleTouchStart}
    >
      {/* Sound Effects */}
      <audio ref={jumpSoundRef} src="/jump.mp3" />
      <audio ref={hitSoundRef} src="/hit.mp3" />
      <audio ref={scoreSoundRef} src="/score.mp3" />
      
      {/* Controls */}
      <div className="absolute top-4 left-4 flex items-center space-x-4">
        {/* Difficulty Selector */}
        <select 
          value={difficulty} 
          onChange={(e) => setDifficulty(e.target.value as 'easy' | 'medium' | 'hard')}
          className="bg-white/30 text-white rounded px-2 py-1"
          disabled={gameStarted && !gameOver}
        >
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>

        {/* Mute Toggle */}
        <button 
          onClick={() => setIsMuted(!isMuted)}
          className="text-white"
        >
          {isMuted ? <VolumeX /> : <Volume2 />}
        </button>
      </div>
      
      {/* Scores */}
      <div className="absolute top-4 right-4 text-white text-xl font-bold">
        <div>Score: {score}</div>
        <div>High Score: {highScore}</div>
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
              top: `${pipe.topHeight + difficultySettings[difficulty].gapSize}%`, 
              width: '40px', 
              height: `${100 - pipe.topHeight - difficultySettings[difficulty].gapSize}%` 
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
          <p className="text-xl text-white mb-6">Press Space or Tap to Start</p>
          <div className="text-white text-center mb-4">
            <p>Select Difficulty Before Starting</p>
            <select 
              value={difficulty} 
              onChange={(e) => setDifficulty(e.target.value as 'easy' | 'medium' | 'hard')}
              className="bg-white/30 text-white rounded px-2 py-1 mt-2"
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>
        </div>
      )}
      
      {/* Game over screen */}
      {gameOver && (
        <div className="absolute inset-0 bg-black bg-opacity-70 flex flex-col items-center justify-center">
          <h2 className="text-4xl font-bold text-white mb-4">Game Over!</h2>
          <p className="text-2xl text-white mb-2">Score: {score}</p>
          <p className="text-xl text-white mb-6">High Score: {highScore}</p>
          <motion.button
            className="bg-yellow-500 text-white px-6 py-3 rounded-lg font-bold flex items-center"
            onClick={restartGame}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <RefreshCw className="mr-2" /> Play Again
          </motion.button>
        </div>
      )}
    </div>
  );
}