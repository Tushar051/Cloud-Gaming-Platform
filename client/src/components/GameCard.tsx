import { motion } from 'framer-motion';
import { Game } from '@shared/schema';
import { Link } from 'wouter';

interface GameCardProps {
  game: Game;
}

export default function GameCard({ game }: GameCardProps) {
  return (
    <motion.div 
      className="game-card relative rounded-lg overflow-hidden group"
      whileHover={{ scale: 1.03 }}
      transition={{ duration: 0.3 }}
    >
      <img 
        src={game.imageUrl}
        alt={game.title} 
        className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
      />
      
      {/* Always visible content - Game Title at the top */}
      <div className="absolute top-0 left-0 right-0 p-3 bg-gradient-to-b from-black/80 to-transparent">
        <h3 className="font-rajdhani font-bold text-white text-lg">{game.title}</h3>
      </div>
      
      {/* Overlay on hover */}
      <div className="game-overlay absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent p-4 flex flex-col justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="flex justify-end mt-8">
          <span className="text-yellow-400 flex items-center bg-black/30 px-2 py-1 rounded">
            <i className="fas fa-star mr-1"></i> {game.rating}
          </span>
        </div>
        
        <div className="mt-auto">
          <div className="flex justify-between items-center mb-2">
            <span className="bg-primary/80 text-white text-xs px-2 py-1 rounded">{game.category}</span>
          </div>
          
          <p className="text-sm text-gray-300 mb-3">{game.description}</p>
          
          <div className="flex justify-center">
            {game.gameUrl ? (
              <Link href={game.gameUrl}>
                <motion.button 
                  className="bg-accent hover:bg-accent/80 text-primary-foreground font-bold py-2 px-4 rounded-full text-sm transition-colors w-full"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  PLAY NOW
                </motion.button>
              </Link>
            ) : (
              <button className="bg-gray-500 text-primary-foreground font-bold py-2 px-4 rounded-full text-sm cursor-not-allowed w-full">
                COMING SOON
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
