import React, { useState, useEffect, useRef } from 'react';

interface SnakeProps {
  isMuted: boolean;
}

type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

interface Position {
  x: number;
  y: number;
}

export default function Snake({ isMuted }: SnakeProps) {
  const canvasWidth = 600;
  const canvasHeight = 400;
  const cellSize = 20;
  const gridWidth = canvasWidth / cellSize;
  const gridHeight = canvasHeight / cellSize;

  const [snake, setSnake] = useState<Position[]>([
    { x: 5, y: 5 },
    { x: 4, y: 5 },
    { x: 3, y: 5 },
  ]);
  const [food, setFood] = useState<Position>({ x: 10, y: 10 });
  const [direction, setDirection] = useState<Direction>('RIGHT');
  const [speed, setSpeed] = useState<number>(120);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);

  const gameLoopRef = useRef<number | null>(null);
  const lastDirectionRef = useRef<Direction>('RIGHT');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Generate random food position
  const generateFood = (): Position => {
    const x = Math.floor(Math.random() * gridWidth);
    const y = Math.floor(Math.random() * gridHeight);
    if (snake.some(segment => segment.x === x && segment.y === y)) {
      return generateFood();
    }
    return { x, y };
  };

  // Check for collisions
  const checkCollisions = (head: Position): boolean => {
    if (head.x < 0 || head.x >= gridWidth || head.y < 0 || head.y >= gridHeight) {
      return true;
    }
    for (let i = 0; i < snake.length - 1; i++) {
      if (snake[i].x === head.x && snake[i].y === head.y) {
        return true;
      }
    }
    return false;
  };

  // Game loop
  const gameLoop = () => {
    if (isPaused || isGameOver) {
      gameLoopRef.current = requestAnimationFrame(gameLoop);
      return;
    }

    const newSnake = [...snake];
    let newHead: Position;

    lastDirectionRef.current = direction;

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

    if (checkCollisions(newHead)) {
      setIsGameOver(true);
      gameLoopRef.current = requestAnimationFrame(gameLoop);
      return;
    }

    if (newHead.x === food.x && newHead.y === food.y) {
      setScore(prev => prev + 10);
      setFood(generateFood());
      if (speed > 70) setSpeed(prev => prev - 1);
    } else {
      newSnake.pop();
    }

    newSnake.unshift(newHead);
    setSnake(newSnake);
    draw();

    setTimeout(() => {
      if (!isPaused && !isGameOver) {
        gameLoopRef.current = requestAnimationFrame(gameLoop);
      }
    }, speed);
  };

  // Draw the game
  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    // Draw snake
    ctx.fillStyle = '#4cc9f0';
    snake.forEach((segment, index) => {
      ctx.fillRect(
        segment.x * cellSize + 1,
        segment.y * cellSize + 1,
        cellSize - 2,
        cellSize - 2
      );
      if (index === 0) {
        // Draw eyes on head
        ctx.fillStyle = '#ffffff';
        let eyeX1, eyeY1, eyeX2, eyeY2;
        switch (direction) {
          case 'UP':
            eyeX1 = segment.x * cellSize + cellSize / 3;
            eyeY1 = segment.y * cellSize + cellSize / 3;
            eyeX2 = segment.x * cellSize + (2 * cellSize) / 3;
            eyeY2 = segment.y * cellSize + cellSize / 3;
            break;
          case 'DOWN':
            eyeX1 = segment.x * cellSize + cellSize / 3;
            eyeY1 = segment.y * cellSize + (2 * cellSize) / 3;
            eyeX2 = segment.x * cellSize + (2 * cellSize) / 3;
            eyeY2 = segment.y * cellSize + (2 * cellSize) / 3;
            break;
          case 'LEFT':
            eyeX1 = segment.x * cellSize + cellSize / 3;
            eyeY1 = segment.y * cellSize + cellSize / 3;
            eyeX2 = segment.x * cellSize + cellSize / 3;
            eyeY2 = segment.y * cellSize + (2 * cellSize) / 3;
            break;
          case 'RIGHT':
          default:
            eyeX1 = segment.x * cellSize + (2 * cellSize) / 3;
            eyeY1 = segment.y * cellSize + cellSize / 3;
            eyeX2 = segment.x * cellSize + (2 * cellSize) / 3;
            eyeY2 = segment.y * cellSize + (2 * cellSize) / 3;
        }
        ctx.beginPath();
        ctx.arc(eyeX1, eyeY1, 2, 0, 2 * Math.PI);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(eyeX2, eyeY2, 2, 0, 2 * Math.PI);
        ctx.fill();
      }
    });

    // Draw food
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

    // Draw score
    ctx.fillStyle = '#ffffff';
    ctx.font = '20px Arial';
    ctx.fillText(`Score: ${score}`, 10, 30);

    // Draw game over or paused message
    if (isGameOver) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.fillRect(0, 0, canvasWidth, canvasHeight);
      ctx.fillStyle = '#ffffff';
      ctx.font = '36px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('Game Over!', canvasWidth / 2, canvasHeight / 2 - 40);
      ctx.font = '24px Arial';
      ctx.fillText(`Final Score: ${score}`, canvasWidth / 2, canvasHeight / 2);
      ctx.font = '18px Arial';
      ctx.fillText('Press R to Restart', canvasWidth / 2, canvasHeight / 2 + 40);
    } else if (isPaused) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.fillRect(0, 0, canvasWidth, canvasHeight);
      ctx.fillStyle = '#ffffff';
      ctx.font = '36px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('Paused', canvasWidth / 2, canvasHeight / 2);
      ctx.font = '18px Arial';
      ctx.fillText('Press P to Resume', canvasWidth / 2, canvasHeight / 2 + 40);
    }
  };

  // Handle keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isGameOver) {
        switch (e.key.toLowerCase()) {
          case 'w':
            if (lastDirectionRef.current !== 'DOWN') setDirection('UP');
            break;
          case 's':
            if (lastDirectionRef.current !== 'UP') setDirection('DOWN');
            break;
          case 'a':
            if (lastDirectionRef.current !== 'RIGHT') setDirection('LEFT');
            break;
          case 'd':
            if (lastDirectionRef.current !== 'LEFT') setDirection('RIGHT');
            break;
          case 'p':
            setIsPaused(prev => !prev);
            break;
          case 'r':
            if (isGameOver) {
              setSnake([
                { x: 5, y: 5 },
                { x: 4, y: 5 },
                { x: 3, y: 5 },
              ]);
              setFood(generateFood());
              setDirection('RIGHT');
              setSpeed(120);
              setIsGameOver(false);
              setScore(0);
              setIsPaused(false);
            }
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isGameOver]);

  // Start the game loop immediately
  useEffect(() => {
    gameLoopRef.current = requestAnimationFrame(gameLoop);
    return () => {
      if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
    };
  }, [isPaused, isGameOver, speed]);

  // Initial draw
  useEffect(() => {
    draw();
  }, [snake, food, isGameOver, isPaused]);

  return (
    <div className="flex flex-col items-center justify-center h-full bg-gray-900">
      <div className="mb-4 text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Snake Classic</h2>
      </div>
      <div className="relative">
        <canvas ref={canvasRef} className="border-4 border-primary rounded-lg shadow-lg" />
      </div>
    </div>
  );
}