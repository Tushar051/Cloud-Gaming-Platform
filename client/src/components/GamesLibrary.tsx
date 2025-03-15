import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import GameCard from './GameCard';
import { Game } from '@shared/schema';

interface GamesLibraryProps {
  games: Game[];
  isLoading: boolean;
  error: Error | null;
  searchTerm: string;
  selectedCategory: string;
  onSearch: (term: string) => void;
  onCategoryChange: (category: string) => void;
}

export default function GamesLibrary({
  games,
  isLoading,
  error,
  searchTerm,
  selectedCategory,
  onSearch,
  onCategoryChange
}: GamesLibraryProps) {
  const [visibleGamesCount, setVisibleGamesCount] = useState(8);
  
  // All available game categories
  const categories = ["All Categories", "Action", "Adventure", "RPG", "FPS", "Racing", "Strategy", "Sports", "Horror", "Puzzle"];
  
  // Load more games function
  const handleLoadMore = () => {
    setVisibleGamesCount(prev => prev + 4);
  };
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="container mx-auto px-4">
      <motion.div 
        className="flex flex-col md:flex-row md:justify-between md:items-center mb-12"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h2 
          className="text-4xl font-audiowide text-accent mb-6 md:mb-0"
          variants={itemVariants}
        >
          Game Library
        </motion.h2>
        
        <motion.div 
          className="flex flex-col md:flex-row gap-4"
          variants={itemVariants}
        >
          {/* Search bar */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search games..."
              value={searchTerm}
              onChange={(e) => onSearch(e.target.value)}
              className="bg-secondary border border-gray-700 rounded-full py-2 px-6 pr-12 w-full md:w-64 text-gray-300 focus:outline-none focus:border-primary"
            />
            <button className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400">
              <i className="fas fa-search"></i>
            </button>
          </div>
          
          {/* Filter dropdown */}
          <div className="relative">
            <select
              value={selectedCategory}
              onChange={(e) => onCategoryChange(e.target.value)}
              className="bg-secondary border border-gray-700 rounded-full py-2 px-6 w-full appearance-none text-gray-300 focus:outline-none focus:border-primary"
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
              <i className="fas fa-chevron-down"></i>
            </div>
          </div>
        </motion.div>
      </motion.div>
      
      {isLoading ? (
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="text-accent text-4xl animate-pulse">
            <i className="fas fa-spinner fa-spin mr-2"></i> Loading...
          </div>
        </div>
      ) : error ? (
        <div className="text-center text-red-500 py-10">
          <i className="fas fa-exclamation-triangle text-4xl mb-4"></i>
          <p>Failed to load games. Please try again later.</p>
        </div>
      ) : (
        <>
          {/* Game grid */}
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <AnimatePresence>
              {games.slice(0, visibleGamesCount).map((game, index) => (
                <motion.div
                  key={game.id}
                  variants={itemVariants}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.3 }}
                >
                  <GameCard game={game} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
          
          {/* Load more games button */}
          {visibleGamesCount < games.length && (
            <motion.div 
              className="text-center mt-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <button
                onClick={handleLoadMore}
                className="bg-transparent border border-primary text-primary hover:bg-primary/10 font-rajdhani font-bold px-8 py-3 rounded-full transition duration-300"
              >
                LOAD MORE GAMES
              </button>
            </motion.div>
          )}
          
          {/* No games found message */}
          {games.length === 0 && (
            <motion.div 
              className="text-center py-16"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <i className="fas fa-search text-4xl text-gray-500 mb-4"></i>
              <p className="text-xl text-gray-400">No games found matching your criteria.</p>
            </motion.div>
          )}
        </>
      )}
    </div>
  );
}
