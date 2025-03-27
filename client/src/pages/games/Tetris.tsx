import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';

const BOARD_WIDTH = 10;
const BOARD_HEIGHT = 20;
const SHAPES = [
  [[1, 1, 1, 1]], // I
  [[1, 1], [1, 1]], // O
  [[1, 1, 1], [0, 1, 0]], // T
  [[1, 1, 1], [1, 0, 0]], // L
  [[1, 1, 1], [0, 0, 1]], // J
  [[0, 1, 1], [1, 1, 0]], // S
  [[1, 1, 0], [0, 1, 1]], // Z
];

export default function Tetris({ isMuted }: { isMuted: boolean }) {
  const [board, setBoard] = useState<number[][]>([]);
  const [currentPiece, setCurrentPiece] = useState<{ shape: number[][]; x: number; y: number } | null>(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  // Initialize board
  useEffect(() => {
    const newBoard = Array(BOARD_HEIGHT).fill(0).map(() => Array(BOARD_WIDTH).fill(0));
    setBoard(newBoard);
    spawnPiece();
  }, []);

  // Spawn a new piece
  const spawnPiece = () => {
    const randomShape = SHAPES[Math.floor(Math.random() * SHAPES.length)];
    const newPiece = {
      shape: randomShape,
      x: Math.floor(BOARD_WIDTH / 2) - Math.floor(randomShape[0].length / 2),
      y: 0
    };
    setCurrentPiece(newPiece);
    
    // Check if game over (new piece collides immediately)
    if (checkCollision(newPiece)) {
      setGameOver(true);
    }
  };

  // Check for collisions
  const checkCollision = (piece: { shape: number[][]; x: number; y: number }) => {
    for (let y = 0; y < piece.shape.length; y++) {
      for (let x = 0; x < piece.shape[y].length; x++) {
        if (piece.shape[y][x] !== 0) {
          const boardX = piece.x + x;
          const boardY = piece.y + y;
          
          if (
            boardX < 0 ||
            boardX >= BOARD_WIDTH ||
            boardY >= BOARD_HEIGHT ||
            (boardY >= 0 && board[boardY][boardX] !== 0)
          ) {
            return true;
          }
        }
      }
    }
    return false;
  };

  // Merge piece into board
  const mergePiece = () => {
    if (!currentPiece) return;
    
    const newBoard = [...board];
    for (let y = 0; y < currentPiece.shape.length; y++) {
      for (let x = 0; x < currentPiece.shape[y].length; x++) {
        if (currentPiece.shape[y][x] !== 0) {
          const boardY = currentPiece.y + y;
          const boardX = currentPiece.x + x;
          if (boardY >= 0) {
            newBoard[boardY][boardX] = 1;
          }
        }
      }
    }
    setBoard(newBoard);
    checkLines(newBoard);
    spawnPiece();
  };

  // Check for completed lines
  const checkLines = (boardToCheck: number[][]) => {
    let linesCleared = 0;
    const newBoard = [...boardToCheck];
    
    for (let y = BOARD_HEIGHT - 1; y >= 0; y--) {
      if (newBoard[y].every(cell => cell !== 0)) {
        newBoard.splice(y, 1);
        newBoard.unshift(Array(BOARD_WIDTH).fill(0));
        linesCleared++;
        y++; // Check the same row again
      }
    }
    
    if (linesCleared > 0) {
      setBoard(newBoard);
      setScore(prev => prev + linesCleared * 100);
    }
  };

  // Handle keyboard input
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (gameOver || isPaused || !currentPiece) return;

    let newPiece = { ...currentPiece };

    switch (e.key) {
      case 'ArrowLeft':
        newPiece.x--;
        if (!checkCollision(newPiece)) setCurrentPiece(newPiece);
        break;
      case 'ArrowRight':
        newPiece.x++;
        if (!checkCollision(newPiece)) setCurrentPiece(newPiece);
        break;
      case 'ArrowDown':
        newPiece.y++;
        if (!checkCollision(newPiece)) {
          setCurrentPiece(newPiece);
        } else {
          mergePiece();
        }
        break;
      case 'ArrowUp':
        // Rotate
        const rotated = currentPiece.shape[0].map((_, i) => 
          currentPiece.shape.map(row => row[i]).reverse()
        );
        newPiece.shape = rotated;
        if (!checkCollision(newPiece)) setCurrentPiece(newPiece);
        break;
      case 'p':
        setIsPaused(prev => !prev);
        break;
      default:
        break;
    }
  }, [currentPiece, gameOver, isPaused]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Game loop - move piece down automatically
  useEffect(() => {
    if (gameOver || isPaused || !currentPiece) return;

    const gameLoop = setInterval(() => {
      const newPiece = { ...currentPiece, y: currentPiece.y + 1 };
      if (!checkCollision(newPiece)) {
        setCurrentPiece(newPiece);
      } else {
        mergePiece();
      }
    }, 500);

    return () => clearInterval(gameLoop);
  }, [currentPiece, gameOver, isPaused]);

  const restartGame = () => {
    const newBoard = Array(BOARD_HEIGHT).fill(0).map(() => Array(BOARD_WIDTH).fill(0));
    setBoard(newBoard);
    setScore(0);
    setGameOver(false);
    setIsPaused(false);
    spawnPiece();
  };

  // Render the board with current piece
  const renderBoard = () => {
    const displayBoard = board.map(row => [...row]);
    
    if (currentPiece) {
      for (let y = 0; y < currentPiece.shape.length; y++) {
        for (let x = 0; x < currentPiece.shape[y].length; x++) {
          if (currentPiece.shape[y][x] !== 0) {
            const boardY = currentPiece.y + y;
            const boardX = currentPiece.x + x;
            if (boardY >= 0 && boardY < BOARD_HEIGHT && boardX >= 0 && boardX < BOARD_WIDTH) {
              displayBoard[boardY][boardX] = 2; // 2 represents current piece
            }
          }
        }
      }
    }
    
    return displayBoard;
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-full bg-gray-900">
      <div className="mb-4 text-white text-xl font-bold">Score: {score}</div>
      
      <div className="relative border-2 border-gray-700 bg-gray-800">
        {/* Game board */}
        <div className="grid grid-cols-10 gap-0">
          {renderBoard().map((row, y) => (
            row.map((cell, x) => (
              <div 
                key={`${y}-${x}`} 
                className={`w-6 h-6 border border-gray-900 ${
                  cell === 0 ? 'bg-gray-800' : 
                  cell === 1 ? 'bg-blue-500' : 'bg-blue-300'
                }`}
              />
            ))
          ))}
        </div>
        
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
        
        {/* Pause screen */}
        {isPaused && !gameOver && (
          <div className="absolute inset-0 bg-black bg-opacity-70 flex flex-col items-center justify-center">
            <h2 className="text-4xl font-bold text-white mb-4">Paused</h2>
            <motion.button
              className="bg-blue-500 text-white px-6 py-3 rounded-lg font-bold"
              onClick={() => setIsPaused(false)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Resume
            </motion.button>
          </div>
        )}
      </div>
      
      <div className="mt-4 text-white">
        Controls: Arrow keys to move, P to pause
      </div>
    </div>
  );
}