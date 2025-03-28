import { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, Volume2, VolumeX } from 'lucide-react';

const BOARD_SIZE = 4;

export default function Game2048() {
  // Game state
  const [board, setBoard] = useState<number[][]>([]);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [won, setWon] = useState(false);
  
  // Sound and UI state
  const [isMuted, setIsMuted] = useState(false);
  const moveSoundRef = useRef<HTMLAudioElement>(null);
  const mergeSoundRef = useRef<HTMLAudioElement>(null);
  const winSoundRef = useRef<HTMLAudioElement>(null);

  // Initialize board and load best score
  useEffect(() => {
    const savedBestScore = localStorage.getItem('2048-best-score');
    if (savedBestScore) {
      setBestScore(parseInt(savedBestScore, 10));
    }
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
            // Play merge sound
            if (!isMuted && mergeSoundRef.current) {
              mergeSoundRef.current.currentTime = 0;
              mergeSoundRef.current.play();
            }

            if (newLine[i] === 2048) {
              // Play win sound
              if (!isMuted && winSoundRef.current) {
                winSoundRef.current.currentTime = 0;
                winSoundRef.current.play();
              }
              setWon(true);
            }
            newLine[i + 1] = 0;
          }
        }
        
        newLine = newLine.filter(cell => cell !== 0);
        while (newLine.length < BOARD_SIZE) {
          newLine.push(0);
        }
        
        return newLine;
      };

      let newLocalScore = localScore;

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
        // Play move sound
        if (!isMuted && moveSoundRef.current) {
          moveSoundRef.current.currentTime = 0;
          moveSoundRef.current.play();
        }

        addRandomTile(newBoard);
        const newScore = score + newLocalScore;
        setScore(newScore);
        
        // Update best score
        if (newScore > bestScore) {
          setBestScore(newScore);
          localStorage.setItem('2048-best-score', newScore.toString());
        }
        
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
  }, [gameOver, score, bestScore, isMuted]);

  // Touch support for mobile
  const handleTouchStart = useRef({
    x: 0,
    y: 0,
    handleTouchMove: (e: TouchEvent) => {},
    handleTouchEnd: (e: TouchEvent) => {}
  });

  useEffect(() => {
    const touchStart = (e: TouchEvent) => {
      handleTouchStart.current.x = e.touches[0].clientX;
      handleTouchStart.current.y = e.touches[0].clientY;
    };

    const touchMove = (e: TouchEvent) => {
      const deltaX = e.touches[0].clientX - handleTouchStart.current.x;
      const deltaY = e.touches[0].clientY - handleTouchStart.current.y;

      const absDeltaX = Math.abs(deltaX);
      const absDeltaY = Math.abs(deltaY);

      if (absDeltaX > absDeltaY) {
        // Horizontal movement
        if (deltaX > 50) moveTiles('right');
        else if (deltaX < -50) moveTiles('left');
      } else {
        // Vertical movement
        if (deltaY > 50) moveTiles('down');
        else if (deltaY < -50) moveTiles('up');
      }
    };

    window.addEventListener('touchstart', touchStart);
    window.addEventListener('touchmove', touchMove);

    return () => {
      window.removeEventListener('touchstart', touchStart);
      window.removeEventListener('touchmove', touchMove);
    };
  }, [moveTiles]);

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
      0: 'bg-gray-200',
      2: 'bg-yellow-100 text-gray-800',
      4: 'bg-yellow-200 text-gray-800',
      8: 'bg-orange-200 text-white',
      16: 'bg-orange-300 text-white',
      32: 'bg-red-300 text-white',
      64: 'bg-red-400 text-white',
      128: 'bg-yellow-300 text-white',
      256: 'bg-yellow-400 text-white',
      512: 'bg-orange-400 text-white',
      1024: 'bg-orange-500 text-white',
      2048: 'bg-red-500 text-white',
      4096: 'bg-red-600 text-white',
    };
    return colors[value as keyof typeof colors] || 'bg-black text-white';
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-full bg-gray-100 touch-none select-none">
      {/* Sound Effects */}
      <audio ref={moveSoundRef} src="/move.mp3" />
      <audio ref={mergeSoundRef} src="/merge.mp3" />
      <audio ref={winSoundRef} src="/win.mp3" />
      
      {/* Top Controls */}
      <div className="flex justify-between w-full max-w-md px-4 mb-4">
        <div className="flex space-x-4">
          <div className="text-lg font-bold text-gray-800">
            Score: <span className="text-blue-600">{score}</span>
          </div>
          <div className="text-lg font-bold text-gray-800">
            Best: <span className="text-green-600">{bestScore}</span>
          </div>
        </div>
        
        <div className="flex space-x-2">
          <motion.button
            className="bg-gray-800 text-white p-2 rounded"
            onClick={startNewGame}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <RefreshCw size={20} />
          </motion.button>
          
          <motion.button
            className="bg-gray-800 text-white p-2 rounded"
            onClick={() => setIsMuted(!isMuted)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
          </motion.button>
        </div>
      </div>
      
      {/* Game Board */}
      <div className="bg-gray-400 p-2 rounded-lg">
        <div className="grid grid-cols-4 gap-2">
          {board.map((row, y) => 
            row.map((cell, x) => (
              <div 
                key={`${y}-${x}`} 
                className={`w-20 h-20 flex items-center justify-center rounded-md transition-all duration-200 ease-in-out ${getTileColor(cell)}`}
              >
                {cell !== 0 && (
                  <span className={`text-2xl font-bold`}>
                    {cell}
                  </span>
                )}
              </div>
            ))
          )}
        </div>
      </div>
      
      <div className="mt-4 text-gray-600 text-center">
        Use arrow keys or swipe to move tiles
      </div>
      
      {/* Game over screen */}
      {gameOver && (
        <div className="absolute inset-0 bg-black bg-opacity-70 flex flex-col items-center justify-center">
          <h2 className="text-4xl font-bold text-white mb-4">Game Over!</h2>
          <p className="text-2xl text-white mb-2">Score: {score}</p>
          <p className="text-xl text-white mb-6">Best Score: {bestScore}</p>
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