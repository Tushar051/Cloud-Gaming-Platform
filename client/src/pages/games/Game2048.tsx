import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';

const BOARD_SIZE = 4;

export default function Game2048({ isMuted }: { isMuted: boolean }) {
  const [board, setBoard] = useState<number[][]>([]);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [won, setWon] = useState(false);

  // Initialize board
  useEffect(() => {
    startNewGame();
  }, []);

  const startNewGame = () => {
    const newBoard = Array(BOARD_SIZE).fill(0).map(() => Array(BOARD_SIZE).fill(0));
    addRandomTile(newBoard);
    addRandomTile(newBoard);
    setBoard(newBoard);
    setScore(0);
    setGameOver(false);
    setWon(false);
  };

  const addRandomTile = (board: number[][]) => {
    const emptyCells = [];
    for (let y = 0; y < BOARD_SIZE; y++) {
      for (let x = 0; x < BOARD_SIZE; x++) {
        if (board[y][x] === 0) {
          emptyCells.push({ y, x });
        }
      }
    }
    
    if (emptyCells.length > 0) {
      const { y, x } = emptyCells[Math.floor(Math.random() * emptyCells.length)];
      board[y][x] = Math.random() < 0.9 ? 2 : 4;
    }
  };

  const moveTiles = useCallback((direction: 'up' | 'down' | 'left' | 'right') => {
    if (gameOver) return;

    setBoard(prevBoard => {
      const newBoard = prevBoard.map(row => [...row]);
      let moved = false;
      let localScore = 0;

      // Process based on direction
      const processLine = (line: number[]) => {
        let newLine = line.filter(cell => cell !== 0);
        
        // Merge tiles
        for (let i = 0; i < newLine.length - 1; i++) {
          if (newLine[i] === newLine[i + 1]) {
            newLine[i] *= 2;
            localScore += newLine[i];
            if (newLine[i] === 2048) setWon(true);
            newLine[i + 1] = 0;
          }
        }
        
        newLine = newLine.filter(cell => cell !== 0);
        while (newLine.length < BOARD_SIZE) {
          newLine.push(0);
        }
        
        return newLine;
      };

      if (direction === 'left') {
        for (let y = 0; y < BOARD_SIZE; y++) {
          const originalLine = [...newBoard[y]];
          const processedLine = processLine(newBoard[y]);
          newBoard[y] = processedLine;
          if (originalLine.toString() !== processedLine.toString()) moved = true;
        }
      } else if (direction === 'right') {
        for (let y = 0; y < BOARD_SIZE; y++) {
          const originalLine = [...newBoard[y]];
          const processedLine = processLine([...newBoard[y]].reverse()).reverse();
          newBoard[y] = processedLine;
          if (originalLine.toString() !== processedLine.toString()) moved = true;
        }
      } else if (direction === 'up') {
        for (let x = 0; x < BOARD_SIZE; x++) {
          let column = [];
          for (let y = 0; y < BOARD_SIZE; y++) column.push(newBoard[y][x]);
          
          const originalColumn = [...column];
          const processedColumn = processLine(column);
          
          for (let y = 0; y < BOARD_SIZE; y++) newBoard[y][x] = processedColumn[y];
          if (originalColumn.toString() !== processedColumn.toString()) moved = true;
        }
      } else if (direction === 'down') {
        for (let x = 0; x < BOARD_SIZE; x++) {
          let column = [];
          for (let y = 0; y < BOARD_SIZE; y++) column.push(newBoard[y][x]);
          
          const originalColumn = [...column];
          const processedColumn = processLine([...column].reverse()).reverse();
          
          for (let y = 0; y < BOARD_SIZE; y++) newBoard[y][x] = processedColumn[y];
          if (originalColumn.toString() !== processedColumn.toString()) moved = true;
        }
      }

      if (moved) {
        addRandomTile(newBoard);
        setScore(prev => prev + localScore);
        
        // Check if game over
        let hasMoves = false;
        for (let y = 0; y < BOARD_SIZE; y++) {
          for (let x = 0; x < BOARD_SIZE; x++) {
            if (newBoard[y][x] === 0) hasMoves = true;
            if (y < BOARD_SIZE - 1 && newBoard[y][x] === newBoard[y + 1][x]) hasMoves = true;
            if (x < BOARD_SIZE - 1 && newBoard[y][x] === newBoard[y][x + 1]) hasMoves = true;
          }
        }
        if (!hasMoves) setGameOver(true);
      }

      return newBoard;
    });
  }, [gameOver]);

  // Handle keyboard input
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowUp':
        moveTiles('up');
        break;
      case 'ArrowDown':
        moveTiles('down');
        break;
      case 'ArrowLeft':
        moveTiles('left');
        break;
      case 'ArrowRight':
        moveTiles('right');
        break;
      default:
        break;
    }
  }, [moveTiles]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const getTileColor = (value: number) => {
    const colors = {
      0: 'bg-gray-300',
      2: 'bg-yellow-100',
      4: 'bg-yellow-200',
      8: 'bg-orange-200',
      16: 'bg-orange-300',
      32: 'bg-red-300',
      64: 'bg-red-400',
      128: 'bg-yellow-300',
      256: 'bg-yellow-400',
      512: 'bg-orange-400',
      1024: 'bg-orange-500',
      2048: 'bg-red-500',
      4096: 'bg-red-600',
    };
    return colors[value as keyof typeof colors] || 'bg-black';
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-full bg-gray-100">
      <div className="flex justify-between w-64 mb-4">
        <div className="text-2xl font-bold text-gray-800">Score: {score}</div>
        <motion.button
          className="bg-gray-800 text-white px-4 py-1 rounded"
          onClick={startNewGame}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          New Game
        </motion.button>
      </div>
      
      <div className="bg-gray-400 p-2 rounded-lg">
        <div className="grid grid-cols-4 gap-2">
          {board.map((row, y) => 
            row.map((cell, x) => (
              <div 
                key={`${y}-${x}`} 
                className={`w-16 h-16 flex items-center justify-center rounded-md ${getTileColor(cell)}`}
              >
                {cell !== 0 && (
                  <span className={`text-xl font-bold ${
                    cell <= 4 ? 'text-gray-800' : 'text-white'
                  }`}>
                    {cell}
                  </span>
                )}
              </div>
            ))
          )}
        </div>
      </div>
      
      <div className="mt-4 text-gray-600">
        Use arrow keys to move tiles
      </div>
      
      {/* Game over screen */}
      {gameOver && (
        <div className="absolute inset-0 bg-black bg-opacity-70 flex flex-col items-center justify-center">
          <h2 className="text-4xl font-bold text-white mb-4">Game Over!</h2>
          <p className="text-2xl text-white mb-6">Score: {score}</p>
          <motion.button
            className="bg-blue-500 text-white px-6 py-3 rounded-lg font-bold"
            onClick={startNewGame}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Play Again
          </motion.button>
        </div>
      )}
      
      {/* Win screen */}
      {won && !gameOver && (
        <div className="absolute inset-0 bg-black bg-opacity-70 flex flex-col items-center justify-center">
          <h2 className="text-4xl font-bold text-white mb-4">You Win!</h2>
          <p className="text-2xl text-white mb-6">Score: {score}</p>
          <div className="flex gap-4">
            <motion.button
              className="bg-blue-500 text-white px-6 py-3 rounded-lg font-bold"
              onClick={() => setWon(false)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Continue
            </motion.button>
            <motion.button
              className="bg-green-500 text-white px-6 py-3 rounded-lg font-bold"
              onClick={startNewGame}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              New Game
            </motion.button>
          </div>
        </div>
      )}
    </div>
  );
}