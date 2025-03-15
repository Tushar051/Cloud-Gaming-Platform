import { useState, useEffect } from 'react';
import { useRoute, Link } from 'wouter';
import { motion } from 'framer-motion';
import Snake from './Snake';

// GameLayout handles the routing for individual games
export default function GameLayout() {
  const [_, params] = useRoute('/games/:gameId*');
  const gameId = params?.['gameId*'] || '';

  // Control panel state
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  // Handle fullscreen toggle
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  // Handle mute toggle
  const toggleMute = () => {
    setIsMuted(!isMuted);
    // Add logic to mute/unmute game sounds
  };

  // Clean up fullscreen when component unmounts
  useEffect(() => {
    return () => {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      }
    };
  }, []);

  // Render the appropriate game based on the URL
  const renderGame = () => {
    // Game playable component for games that aren't fully implemented yet
    const GamePlayable = ({ title, gameId }: { title: string; gameId: string }) => (
      <div className="flex flex-col items-center justify-center h-full bg-gradient-to-b from-gray-900 to-black p-8">
        <h2 className="text-3xl font-bold text-primary mb-6">{title}</h2>
        <div className="bg-black/50 p-6 rounded-lg border border-primary/30 shadow-lg max-w-2xl w-full mb-8">
          <div className="text-center mb-6">
            <p className="text-xl text-white mb-4">This game is coming soon!</p>
            <p className="text-gray-300">In the meantime, try our fully functional Snake game.</p>
          </div>
          
          <div className="text-center mt-8">
            <Link href="/games/snake">
              <motion.button
                className="bg-primary text-white px-6 py-3 rounded-lg font-bold"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Play Snake Game
              </motion.button>
            </Link>
          </div>
        </div>
      </div>
    );
    
    // Return game based on ID - Snake is the only fully implemented game
    switch (gameId) {
      case 'subway-runner':
      case 'pixel-racer':
      case 'maze-muncher':
      case 'space-invaders':
      case 'flappy-bird':
      case 'tetris':
      case '2048':
        return <GamePlayable title={gameId.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')} gameId={gameId} />;
        
      case 'snake':
        return <Snake isMuted={isMuted} />;
        
      default:
        return (
          <div className="flex flex-col items-center justify-center h-full">
            <h2 className="text-2xl font-bold text-white mb-4">Game not found</h2>
            <Link href="/games">
              <motion.button
                className="bg-primary text-white px-6 py-3 rounded-lg font-bold"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Return to Games
              </motion.button>
            </Link>
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col h-screen bg-black">
      {/* Game control header */}
      <div className="bg-gray-900 border-b border-gray-800 p-4 flex justify-between items-center">
        <Link href="/games">
          <motion.button
            className="flex items-center text-white hover:text-primary transition-colors"
            whileHover={{ x: -5 }}
          >
            <i className="fas fa-arrow-left mr-2"></i>
            <span>Back to Games</span>
          </motion.button>
        </Link>
        <div className="font-rajdhani font-bold text-xl text-white">
          {gameId.split('-').map((word: string) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
        </div>
        <div className="flex gap-4">
          <motion.button
            className={`text-white ${isMuted ? 'text-red-500' : 'text-white'} hover:text-primary transition-colors`}
            onClick={toggleMute}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <i className={`fas ${isMuted ? 'fa-volume-mute' : 'fa-volume-up'} text-xl`}></i>
          </motion.button>
          <motion.button
            className="text-white hover:text-primary transition-colors"
            onClick={toggleFullscreen}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <i className={`fas ${isFullscreen ? 'fa-compress' : 'fa-expand'} text-xl`}></i>
          </motion.button>
        </div>
      </div>

      {/* Game container */}
      <div className="flex-1 relative overflow-hidden">
        {renderGame()}
      </div>
    </div>
  );
}