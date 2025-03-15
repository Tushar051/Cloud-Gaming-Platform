import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface SnakeProps {
  isMuted: boolean;
}

// Direction type
type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

// Position interface
interface Position {
  x: number;
  y: number;
}

export default function Snake({ isMuted }: SnakeProps) {
  // Canvas size and grid cell size
  const canvasWidth = 600;
  const canvasHeight = 400;
  const cellSize = 20;
  const gridWidth = canvasWidth / cellSize;
  const gridHeight = canvasHeight / cellSize;
  
  // Game states
  const [snake, setSnake] = useState<Position[]>([
    { x: 5, y: 5 },
    { x: 4, y: 5 },
    { x: 3, y: 5 }
  ]);
  const [food, setFood] = useState<Position>({ x: 10, y: 10 });
  const [direction, setDirection] = useState<Direction>('RIGHT');
  const [speed, setSpeed] = useState<number>(120);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isStarted, setIsStarted] = useState<boolean>(false);

  // Refs
  const gameLoopRef = useRef<number | null>(null);
  const lastDirectionRef = useRef<Direction>('RIGHT');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Audio elements
  const eatSound = useRef<HTMLAudioElement | null>(null);
  const gameOverSound = useRef<HTMLAudioElement | null>(null);
  
  // Initialize the game
  useEffect(() => {
    // Skip audio loading to improve performance
    
    // Set up canvas immediately to avoid loading delays
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = canvasWidth;
      canvas.height = canvasHeight;
      
      // Draw initial state immediately
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#1a1a2e';
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);
        
        // Draw initial snake
        ctx.fillStyle = '#4cc9f0';
        snake.forEach((segment) => {
          ctx.fillRect(
            segment.x * cellSize + 1,
            segment.y * cellSize + 1,
            cellSize - 2,
            cellSize - 2
          );
        });
        
        // Draw initial food
        ctx.fillStyle = '#ff6b6b';
        ctx.beginPath();
        ctx.arc(
          food.x * cellSize + cellSize / 2,
          food.y * cellSize + cellSize / 2,
          cellSize / 2 - 2,
          0,
          2 * Math.PI
        );
        ctx.fill();
      }
    }
    
    // Auto-start the game immediately for better user experience
    setIsStarted(true);
    
    // Handle keyboard controls
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isGameOver && isStarted) {
        switch (e.key) {
          case 'ArrowUp':
            if (lastDirectionRef.current !== 'DOWN') {
              setDirection('UP');
            }
            break;
          case 'ArrowDown':
            if (lastDirectionRef.current !== 'UP') {
              setDirection('DOWN');
            }
            break;
          case 'ArrowLeft':
            if (lastDirectionRef.current !== 'RIGHT') {
              setDirection('LEFT');
            }
            break;
          case 'ArrowRight':
            if (lastDirectionRef.current !== 'LEFT') {
              setDirection('RIGHT');
            }
            break;
          case ' ':
            setIsPaused(prev => !prev);
            break;
        }
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, [isGameOver, isStarted]);
  
  // Generate random food position
  const generateFood = (): Position => {
    const x = Math.floor(Math.random() * gridWidth);
    const y = Math.floor(Math.random() * gridHeight);
    
    // Ensure food doesn't spawn on snake
    if (snake.some(segment => segment.x === x && segment.y === y)) {
      return generateFood();
    }
    
    return { x, y };
  };
  
  // Check for collisions
  const checkCollisions = (head: Position): boolean => {
    // Check for wall collisions
    if (
      head.x < 0 || 
      head.x >= gridWidth || 
      head.y < 0 || 
      head.y >= gridHeight
    ) {
      return true;
    }
    
    // Check for self collision (exclude the last element which is the tail)
    for (let i = 0; i < snake.length - 1; i++) {
      if (snake[i].x === head.x && snake[i].y === head.y) {
        return true;
      }
    }
    
    return false;
  };
  
  // Optimized game loop with better performance
  const gameLoop = () => {
    if (isPaused || isGameOver || !isStarted) {
      gameLoopRef.current = requestAnimationFrame(gameLoop);
      return;
    }
    
    // Use a more efficient clone method
    const newSnake = Array.from(snake);
    let newHead: Position;
    
    // Update lastDirectionRef
    lastDirectionRef.current = direction;
    
    // Calculate new head position based on direction
    switch (direction) {
      case 'UP':
        newHead = { x: newSnake[0].x, y: newSnake[0].y - 1 };
        break;
      case 'DOWN':
        newHead = { x: newSnake[0].x, y: newSnake[0].y + 1 };
        break;
      case 'LEFT':
        newHead = { x: newSnake[0].x - 1, y: newSnake[0].y };
        break;
      case 'RIGHT':
      default:
        newHead = { x: newSnake[0].x + 1, y: newSnake[0].y };
        break;
    }
    
    // Check for collisions
    if (checkCollisions(newHead)) {
      // No audio needed for faster loading
      setIsGameOver(true);
      gameLoopRef.current = requestAnimationFrame(gameLoop);
      return;
    }
    
    // Check if snake eats food
    if (newHead.x === food.x && newHead.y === food.y) {
      // Skip sound for better performance
      
      // Increase score
      setScore(prevScore => prevScore + 10);
      
      // Generate new food
      setFood(generateFood());
      
      // Increase speed slightly but with a limit for playability
      if (speed > 70) {
        setSpeed(prev => prev - 1);
      }
    } else {
      // Remove tail if no food eaten
      newSnake.pop();
    }
    
    // Add new head to snake
    newSnake.unshift(newHead);
    setSnake(newSnake);
    
    // Draw everything
    draw();
    
    // Continue the game loop - using optimized timing
    const delay = Math.max(30, speed); // Ensure minimum of 30ms for performance
    
    setTimeout(() => {
      if (!isPaused && !isGameOver) {
        gameLoopRef.current = requestAnimationFrame(gameLoop);
      }
    }, delay);
  };
  
  // Optimized drawing function for better performance
  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear canvas and draw background
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    
    // Skip grid lines in favor of better performance
    // Only draw every other grid line to reduce rendering cost
    if (canvasWidth <= 800) { // Only draw grid on smaller screens
      ctx.strokeStyle = '#2a2a3e';
      ctx.lineWidth = 0.5;
      
      for (let i = 0; i <= gridWidth; i += 2) {
        ctx.beginPath();
        ctx.moveTo(i * cellSize, 0);
        ctx.lineTo(i * cellSize, canvasHeight);
        ctx.stroke();
      }
      
      for (let i = 0; i <= gridHeight; i += 2) {
        ctx.beginPath();
        ctx.moveTo(0, i * cellSize);
        ctx.lineTo(canvasWidth, i * cellSize);
        ctx.stroke();
      }
    }
    
    // Draw food more efficiently
    ctx.fillStyle = '#ff6b6b';
    ctx.beginPath();
    ctx.arc(
      food.x * cellSize + cellSize / 2,
      food.y * cellSize + cellSize / 2,
      cellSize / 2 - 2,
      0,
      2 * Math.PI
    );
    ctx.fill();
    
    // Draw snake - optimize for performance
    // Draw head
    ctx.fillStyle = '#4cc9f0';
    const head = snake[0];
    ctx.fillRect(
      head.x * cellSize + 1,
      head.y * cellSize + 1,
      cellSize - 2,
      cellSize - 2
    );
    
    // Draw eyes on head
    ctx.fillStyle = '#ffffff';
    
    // Eye positions depend on direction - simplified
    let eyeX1, eyeY1, eyeX2, eyeY2;
    
    switch (direction) {
      case 'UP':
        eyeX1 = head.x * cellSize + cellSize / 3;
        eyeY1 = head.y * cellSize + cellSize / 3;
        eyeX2 = head.x * cellSize + 2 * cellSize / 3;
        eyeY2 = head.y * cellSize + cellSize / 3;
        break;
      case 'DOWN':
        eyeX1 = head.x * cellSize + cellSize / 3;
        eyeY1 = head.y * cellSize + 2 * cellSize / 3;
        eyeX2 = head.x * cellSize + 2 * cellSize / 3;
        eyeY2 = head.y * cellSize + 2 * cellSize / 3;
        break;
      case 'LEFT':
        eyeX1 = head.x * cellSize + cellSize / 3;
        eyeY1 = head.y * cellSize + cellSize / 3;
        eyeX2 = head.x * cellSize + cellSize / 3;
        eyeY2 = head.y * cellSize + 2 * cellSize / 3;
        break;
      default: // RIGHT
        eyeX1 = head.x * cellSize + 2 * cellSize / 3;
        eyeY1 = head.y * cellSize + cellSize / 3;
        eyeX2 = head.x * cellSize + 2 * cellSize / 3;
        eyeY2 = head.y * cellSize + 2 * cellSize / 3;
    }
    
    ctx.beginPath();
    ctx.arc(eyeX1, eyeY1, 2, 0, 2 * Math.PI);
    ctx.fill();
    
    ctx.beginPath();
    ctx.arc(eyeX2, eyeY2, 2, 0, 2 * Math.PI);
    ctx.fill();
    
    // Draw body segments - use simplified coloring
    const bodyColor = '#6495ED';
    ctx.fillStyle = bodyColor;
    
    // Skip the head (index 0) since we already drew it
    for (let i = 1; i < snake.length; i++) {
      const segment = snake[i];
      ctx.fillRect(
        segment.x * cellSize + 1,
        segment.y * cellSize + 1,
        cellSize - 2,
        cellSize - 2
      );
    }
    
    // Draw score with efficient text rendering
    ctx.fillStyle = '#ffffff';
    ctx.font = '20px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(`Score: ${score}`, 10, 30);
    
    // Draw game state messages
    if (isGameOver) {
      // Game over overlay
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.fillRect(0, 0, canvasWidth, canvasHeight);
      
      ctx.fillStyle = '#ffffff';
      ctx.font = '36px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('Game Over!', canvasWidth / 2, canvasHeight / 2 - 40);
      
      ctx.font = '24px Arial';
      ctx.fillText(`Final Score: ${score}`, canvasWidth / 2, canvasHeight / 2);
      
      ctx.font = '18px Arial';
      ctx.fillText('Press Spacebar to Play Again', canvasWidth / 2, canvasHeight / 2 + 40);
    } else if (isPaused) {
      // Pause overlay
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.fillRect(0, 0, canvasWidth, canvasHeight);
      
      ctx.fillStyle = '#ffffff';
      ctx.font = '36px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('Paused', canvasWidth / 2, canvasHeight / 2);
      
      ctx.font = '18px Arial';
      ctx.fillText('Press Spacebar to Resume', canvasWidth / 2, canvasHeight / 2 + 40);
    } else if (!isStarted) {
      // Start screen
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.fillRect(0, 0, canvasWidth, canvasHeight);
      
      ctx.fillStyle = '#ffffff';
      ctx.font = '36px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('Snake Game', canvasWidth / 2, canvasHeight / 2 - 60);
      
      ctx.font = '18px Arial';
      ctx.fillText('Use Arrow Keys to Move', canvasWidth / 2, canvasHeight / 2);
      ctx.fillText('Spacebar to Pause/Resume', canvasWidth / 2, canvasHeight / 2 + 30);
    }
  };
  
  // Start the game
  useEffect(() => {
    if (isStarted && !isGameOver) {
      gameLoopRef.current = requestAnimationFrame(gameLoop);
    }
    
    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, [isStarted, isPaused, isGameOver, speed]);
  
  // Handle space bar press for restart
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === ' ') {
        if (isGameOver) {
          // Reset the game
          setSnake([
            { x: 5, y: 5 },
            { x: 4, y: 5 },
            { x: 3, y: 5 }
          ]);
          setFood(generateFood());
          setDirection('RIGHT');
          setSpeed(120);
          setIsGameOver(false);
          setScore(0);
          setIsPaused(false);
          setIsStarted(true);
        } else if (!isStarted) {
          setIsStarted(true);
        }
      }
    };
    
    window.addEventListener('keydown', handleKeyPress);
    
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [isGameOver, isStarted]);
  
  // Draw initial canvas
  useEffect(() => {
    draw();
  }, [snake, food, isGameOver, isPaused, isStarted]);
  
  return (
    <div className="flex flex-col items-center justify-center h-full bg-gray-900">
      <div className="mb-4 text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Snake Classic</h2>
        {!isStarted && (
          <p className="text-gray-300 mb-4">Press Spacebar to Start</p>
        )}
      </div>
      
      <div className="relative">
        <canvas 
          ref={canvasRef} 
          className="border-4 border-primary rounded-lg shadow-lg"
        />
        
        {/* On-screen controls for mobile */}
        <div className="mt-4 grid grid-cols-3 gap-2 w-full max-w-xs mx-auto md:hidden">
          <div></div> {/* Empty cell for grid alignment */}
          <motion.button
            className="bg-gray-800 text-white p-3 rounded-full shadow"
            whileTap={{ scale: 0.9 }}
            onClick={() => {
              if (lastDirectionRef.current !== 'DOWN' && isStarted && !isGameOver) {
                setDirection('UP');
              }
              if (!isStarted) {
                setIsStarted(true);
              }
            }}
          >
            <i className="fas fa-arrow-up"></i>
          </motion.button>
          <div></div> {/* Empty cell for grid alignment */}
          
          <motion.button
            className="bg-gray-800 text-white p-3 rounded-full shadow"
            whileTap={{ scale: 0.9 }}
            onClick={() => {
              if (lastDirectionRef.current !== 'RIGHT' && isStarted && !isGameOver) {
                setDirection('LEFT');
              }
              if (!isStarted) {
                setIsStarted(true);
              }
            }}
          >
            <i className="fas fa-arrow-left"></i>
          </motion.button>
          
          <motion.button
            className="bg-gray-800 text-white p-3 rounded-full shadow"
            whileTap={{ scale: 0.9 }}
            onClick={() => {
              if (isGameOver) {
                // Reset the game
                setSnake([
                  { x: 5, y: 5 },
                  { x: 4, y: 5 },
                  { x: 3, y: 5 }
                ]);
                setFood(generateFood());
                setDirection('RIGHT');
                setSpeed(120);
                setIsGameOver(false);
                setScore(0);
                setIsPaused(false);
                setIsStarted(true);
              } else {
                setIsPaused(prev => !prev);
                if (!isStarted) {
                  setIsStarted(true);
                }
              }
            }}
          >
            <i className={`fas ${isPaused ? 'fa-play' : 'fa-pause'}`}></i>
          </motion.button>
          
          <motion.button
            className="bg-gray-800 text-white p-3 rounded-full shadow"
            whileTap={{ scale: 0.9 }}
            onClick={() => {
              if (lastDirectionRef.current !== 'LEFT' && isStarted && !isGameOver) {
                setDirection('RIGHT');
              }
              if (!isStarted) {
                setIsStarted(true);
              }
            }}
          >
            <i className="fas fa-arrow-right"></i>
          </motion.button>
          
          <div></div> {/* Empty cell for grid alignment */}
          <motion.button
            className="bg-gray-800 text-white p-3 rounded-full shadow"
            whileTap={{ scale: 0.9 }}
            onClick={() => {
              if (lastDirectionRef.current !== 'UP' && isStarted && !isGameOver) {
                setDirection('DOWN');
              }
              if (!isStarted) {
                setIsStarted(true);
              }
            }}
          >
            <i className="fas fa-arrow-down"></i>
          </motion.button>
          <div></div> {/* Empty cell for grid alignment */}
        </div>
      </div>
      
      <div className="mt-4 text-gray-300 text-sm md:hidden">
        <p>Tap the controls to move the snake</p>
      </div>
    </div>
  );
}