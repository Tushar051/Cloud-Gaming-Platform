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

// Color palette for different shapes
const SHAPE_COLORS = [
  'bg-cyan-500',    // I - Cyan
  'bg-yellow-500',  // O - Yellow
  'bg-purple-500',  // T - Purple
  'bg-orange-500',  // L - Orange
  'bg-blue-500',    // J - Blue
  'bg-green-500',   // S - Green
  'bg-red-500'      // Z - Red
];

export default function Tetris({ isMuted }: { isMuted: boolean }) {
  const [board, setBoard] = useState<number[][]>(() => 
    Array(BOARD_HEIGHT).fill(0).map(() => Array(BOARD_WIDTH).fill(0))
  );
  const [currentPiece, setCurrentPiece] = useState<{ shape: number[][]; x: number; y: number; color: string } | null>(null);
  const [nextPiece, setNextPiece] = useState<{ shape: number[][]; color: string } | null>(null);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [highScore, setHighScore] = useState(() => {
    return parseInt(localStorage.getItem('tetrisHighScore') || '0');
  });

  // Defensive collision check with improved safety
  const checkCollision = useCallback((piece: { shape: number[][]; x: number; y: number }) => {
    // Ensure board and piece exist and are valid
    if (!board || !piece || !piece.shape) return true;

    for (let y = 0; y < piece.shape.length; y++) {
      for (let x = 0; x < piece.shape[y].length; x++) {
        if (piece.shape[y][x] !== 0) {
          const boardX = piece.x + x;
          const boardY = piece.y + y;
          
          // Enhanced boundary and collision checks
          if (
            boardX < 0 ||
            boardX >= BOARD_WIDTH ||
            boardY >= BOARD_HEIGHT ||
            (boardY >= 0 && 
             boardY < board.length && 
             boardX < board[boardY].length && 
             board[boardY][boardX] !== 0)
          ) {
            return true;
          }
        }
      }
    }
    return false;
  }, [board]);

  // Initialize board and first piece
  useEffect(() => {
    const initializeBoard = () => {
      const newBoard = Array(BOARD_HEIGHT).fill(0).map(() => Array(BOARD_WIDTH).fill(0));
      setBoard(newBoard);
      spawnPiece();
    };

    initializeBoard();
  }, []);

  // Level and speed management
  useEffect(() => {
    setLevel(Math.floor(score / 1000) + 1);
  }, [score]);

  // Spawn a new piece with improved randomization
  const spawnPiece = useCallback(() => {
    const randomIndex = Math.floor(Math.random() * SHAPES.length);
    const randomShape = SHAPES[randomIndex];
    const randomColor = SHAPE_COLORS[randomIndex];

    const newPiece = {
      shape: randomShape,
      x: Math.floor(BOARD_WIDTH / 2) - Math.floor(randomShape[0].length / 2),
      y: 0,
      color: randomColor
    };

    // Use next piece if it exists, otherwise use new piece
    if (nextPiece) {
      setCurrentPiece({
        ...nextPiece,
        x: Math.floor(BOARD_WIDTH / 2) - Math.floor(nextPiece.shape[0].length / 2),
        y: 0
      });
    } else {
      setCurrentPiece(newPiece);
    }

    // Generate next piece
    const nextRandomIndex = Math.floor(Math.random() * SHAPES.length);
    setNextPiece({
      shape: SHAPES[nextRandomIndex],
      color: SHAPE_COLORS[nextRandomIndex]
    });
    
    // Check for immediate game over
    if (checkCollision(newPiece)) {
      endGame();
    }
  }, [nextPiece, checkCollision]);

  // End game and update high score
  const endGame = useCallback(() => {
    setGameOver(true);
    if (score > highScore) {
      const newHighScore = score;
      setHighScore(newHighScore);
      localStorage.setItem('tetrisHighScore', newHighScore.toString());
    }
  }, [score, highScore]);

  // Merge piece into board
  const mergePiece = useCallback(() => {
    if (!currentPiece) return;
    
    const newBoard = board.map(row => [...row]);
    for (let y = 0; y < currentPiece.shape.length; y++) {
      for (let x = 0; x < currentPiece.shape[y].length; x++) {
        if (currentPiece.shape[y][x] !== 0) {
          const boardY = currentPiece.y + y;
          const boardX = currentPiece.x + x;
          if (boardY >= 0 && boardY < BOARD_HEIGHT && boardX >= 0 && boardX < BOARD_WIDTH) {
            newBoard[boardY][boardX] = 1;
          }
        }
      }
    }
    setBoard(newBoard);
    checkLines(newBoard);
    spawnPiece();
  }, [currentPiece, board, spawnPiece]);

  // Check for completed lines
  const checkLines = useCallback((boardToCheck: number[][]) => {
    let linesCleared = 0;
    const newBoard = boardToCheck.map(row => [...row]);
    
    for (let y = BOARD_HEIGHT - 1; y >= 0; y--) {
      if (newBoard[y].every(cell => cell !== 0)) {
        newBoard.splice(y, 1);
        newBoard.unshift(Array(BOARD_WIDTH).fill(0));
        linesCleared++;
        y++; // Check the same row again
      }
    }
    
    if (linesCleared > 0) {
      // Enhanced scoring system
      const scoreMultiplier = [100, 300, 500, 800];
      const baseScore = scoreMultiplier[Math.min(linesCleared - 1, 3)] * level;
      setScore(prev => prev + baseScore);
    }
  }, [level]);

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
        // Rotation logic
        const rotated = currentPiece.shape[0].map((_, i) => 
          currentPiece.shape.map(row => row[i]).reverse()
        );
        newPiece.shape = rotated;
        if (!checkCollision(newPiece)) setCurrentPiece(newPiece);
        break;
      case 'p':
      case 'P':
        setIsPaused(prev => !prev);
        break;
      case ' ':
        // Hard drop
        while (!checkCollision({ ...newPiece, y: newPiece.y + 1 })) {
          newPiece.y++;
        }
        setCurrentPiece(newPiece);
        mergePiece();
        break;
    }
  }, [currentPiece, gameOver, isPaused, checkCollision, mergePiece]);

  // Add keyboard event listener
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Game loop - automatic piece movement
  useEffect(() => {
    if (gameOver || isPaused || !currentPiece) return;

    // Dynamic game speed based on level
    const gameSpeed = Math.max(100, 500 - (level - 1) * 50);

    const gameLoop = setInterval(() => {
      const newPiece = { ...currentPiece, y: currentPiece.y + 1 };
      if (!checkCollision(newPiece)) {
        setCurrentPiece(newPiece);
      } else {
        mergePiece();
      }
    }, gameSpeed);

    return () => clearInterval(gameLoop);
  }, [currentPiece, gameOver, isPaused, level, checkCollision, mergePiece]);

  // Restart game
  const restartGame = () => {
    const newBoard = Array(BOARD_HEIGHT).fill(0).map(() => Array(BOARD_WIDTH).fill(0));
    setBoard(newBoard);
    setScore(0);
    setLevel(1);
    setGameOver(false);
    setIsPaused(false);
    spawnPiece();
  };

  // Render the board with current piece
  const renderBoard = useCallback(() => {
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
  }, [board, currentPiece]);

  return (
    <div className="flex flex-col items-center justify-center w-full h-full bg-gray-900">
      <div className="flex w-full max-w-4xl justify-between items-start mb-4">
        {/* Game Info */}
        <div className="text-white text-lg">
          <div>Score: {score}</div>
          <div>High Score: {highScore}</div>
          <div>Level: {level}</div>
        </div>

        {/* Next Piece Preview */}
        {nextPiece && (
          <div className="bg-gray-800 p-2 rounded">
            <div className="text-white mb-2">Next Piece:</div>
            <div className="grid grid-cols-4 gap-1">
              {nextPiece.shape.map((row, y) => (
                row.map((cell, x) => (
                  <div 
                    key={`next-${y}-${x}`}
                    className={`w-4 h-4 border border-gray-900 ${
                      cell !== 0 ? nextPiece.color : 'bg-gray-700'
                    }`}
                  />
                ))
              ))}
            </div>
          </div>
        )}
      </div>
      
      <div className="relative border-2 border-gray-700 bg-gray-800">
        {/* Game board */}
        <div className="grid grid-cols-10 gap-0">
          {renderBoard().map((row, y) => (
            row.map((cell, x) => {
              // Determine color based on cell type and current piece
              const colorClass = 
                cell === 0 ? 'bg-gray-800' : 
                cell === 1 ? 'bg-blue-500' : 
                currentPiece ? currentPiece.color : 'bg-blue-300';
              
              return (
                <div 
                  key={`${y}-${x}`} 
                  className={`w-6 h-6 border border-gray-900 ${colorClass}`}
                />
              );
            })
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
      
      <div className="mt-4 text-white text-center">
        Controls: 
        <br />
        Arrow keys to move, Up arrow to rotate, 
        Space bar for hard drop, P to pause
      </div>
    </div>
  );
}