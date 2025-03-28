import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Shield, Rocket, Alien, Heart, Trophy } from 'lucide-react';

// Enhanced game configuration
const GAME_CONFIG = {
  PLAYER_WIDTH: 10,
  PLAYER_HEIGHT: 6,
  ALIEN_WIDTH: 8,
  ALIEN_HEIGHT: 8,
  GRID_ROWS: 4,
  GRID_COLS: 10,
  BULLET_SPEED: 5,
  ALIEN_SPEED: 1,
  INITIAL_LIVES: 3,
  POINTS_PER_ALIEN: 100,
  BONUS_POINTS_PER_LEVEL: 500
};

// Power-up types
type PowerUpType = 'shield' | 'multishot' | 'rapid-fire';

export default function SpaceInvaders({ isMuted }: { isMuted: boolean }) {
  // Game state
  const [playerX, setPlayerX] = useState(50);
  const [bullets, setBullets] = useState<Array<{ x: number; y: number; type?: string }>>([]);
  const [aliens, setAliens] = useState<Array<{ x: number; y: number; health: number }>>([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [level, setLevel] = useState(1);
  const [lives, setLives] = useState(GAME_CONFIG.INITIAL_LIVES);
  const [powerUps, setPowerUps] = useState<Array<{ x: number; y: number; type: PowerUpType }>>([]);
  const [activeShield, setActiveShield] = useState(false);
  const [multiShotActive, setMultiShotActive] = useState(false);
  const [rapidFireActive, setRapidFireActive] = useState(false);

  // Initialize aliens with health and varied types
  useEffect(() => {
    const newAliens = [];
    const alienTypes = ['basic', 'tough', 'boss'];
    for (let y = 0; y < GAME_CONFIG.GRID_ROWS; y++) {
      for (let x = 0; x < GAME_CONFIG.GRID_COLS; x++) {
        const type = alienTypes[Math.floor(Math.random() * alienTypes.length)];
        newAliens.push({ 
          x: x * 10 + 15, 
          y: y * 10 + 10, 
          health: type === 'basic' ? 1 : type === 'tough' ? 2 : 3,
          type 
        });
      }
    }
    setAliens(newAliens);
  }, [level]);

  // Spawn random power-ups
  useEffect(() => {
    if (Math.random() < 0.02) {
      const powerUpTypes: PowerUpType[] = ['shield', 'multishot', 'rapid-fire'];
      setPowerUps(prev => [...prev, {
        x: Math.random() * 90,
        y: 10,
        type: powerUpTypes[Math.floor(Math.random() * powerUpTypes.length)]
      }]);
    }
  }, [bullets]);

  // Keyboard and touch controls
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (gameOver) return;
    
    if (e.key === 'ArrowLeft') setPlayerX(prev => Math.max(10, prev - 5));
    if (e.key === 'ArrowRight') setPlayerX(prev => Math.min(90, prev + 5));
    
    // Different shooting mechanics based on power-ups
    if (e.key === ' ') {
      if (multiShotActive) {
        // Multi-shot spreads bullets
        setBullets(prev => [
          ...prev, 
          { x: playerX - 2, y: 90 },
          { x: playerX, y: 90 },
          { x: playerX + 2, y: 90 }
        ]);
      } else {
        setBullets(prev => [...prev, { x: playerX, y: 90 }]);
      }
    }
  }, [playerX, gameOver, multiShotActive]);

  // Game loop with enhanced mechanics
  useEffect(() => {
    if (gameOver) return;

    const gameLoop = setInterval(() => {
      // Move and filter bullets
      setBullets(prev => 
        prev.map(bullet => ({ ...bullet, y: bullet.y - GAME_CONFIG.BULLET_SPEED }))
          .filter(bullet => bullet.y > 0)
      );

      // Move power-ups
      setPowerUps(prev => 
        prev.map(powerUp => ({ ...powerUp, y: powerUp.y + 1 }))
          .filter(powerUp => powerUp.y < 100)
      );

      // Move aliens with more complex pathing
      setAliens(prev => {
        const shouldMoveDown = prev.some(alien => alien.x <= 5 || alien.x >= 95);
        return prev.map(alien => ({
          ...alien,
          x: shouldMoveDown ? alien.x : alien.x + (level % 2 === 0 ? -GAME_CONFIG.ALIEN_SPEED : GAME_CONFIG.ALIEN_SPEED),
          y: shouldMoveDown ? alien.y + 2 : alien.y
        }));
      });

      // Collision detection with power-ups
      setPowerUps(powerUps => {
        return powerUps.filter(powerUp => {
          // Check if player collected power-up
          if (
            Math.abs(powerUp.x - playerX) < 5 && 
            powerUp.y >= 85 && powerUp.y <= 90
          ) {
            switch(powerUp.type) {
              case 'shield':
                setActiveShield(true);
                setTimeout(() => setActiveShield(false), 5000);
                break;
              case 'multishot':
                setMultiShotActive(true);
                setTimeout(() => setMultiShotActive(false), 5000);
                break;
              case 'rapid-fire':
                setRapidFireActive(true);
                setTimeout(() => setRapidFireActive(false), 5000);
                break;
            }
            return false;
          }
          return true;
        });
      });

      // Bullet-alien collision with health system
      setBullets(prev => {
        const newBullets = [...prev];
        setAliens(currentAliens => {
          return currentAliens.filter(alien => {
            const hit = newBullets.some((bullet, i) => {
              const distance = Math.sqrt(
                Math.pow(bullet.x - alien.x, 2) + Math.pow(bullet.y - alien.y, 2)
              );
              if (distance < 8) {
                // Reduce alien health
                alien.health -= 1;
                newBullets.splice(i, 1);
                
                if (alien.health <= 0) {
                  // Different points for different alien types
                  setScore(s => s + (
                    alien.type === 'basic' ? 100 : 
                    alien.type === 'tough' ? 200 : 
                    300
                  ));
                  return false;
                }
                return true;
              }
              return false;
            });
            return hit ? alien : !hit;
          });
        });
        return newBullets;
      });

      // Alien bullets and attacks
      if (Math.random() < 0.02 && aliens.length > 0) {
        const randomAlien = aliens[Math.floor(Math.random() * aliens.length)];
        setBullets(prev => [...prev, { x: randomAlien.x, y: randomAlien.y + 5, type: 'alien' }]);
      }

      // Player hit detection with shield
      const playerHit = bullets.some(
        bullet => bullet.type === 'alien' && 
        bullet.y >= 85 && 
        Math.abs(bullet.x - playerX) < 5
      );
      
      if (playerHit) {
        if (activeShield) {
          // Shield absorbs one hit
          setActiveShield(false);
        } else {
          // Lose a life
          setLives(l => {
            const newLives = l - 1;
            if (newLives <= 0) {
              setGameOver(true);
            }
            return newLives;
          });
        }
      }

      // Level complete
      if (aliens.length === 0) {
        setLevel(l => {
          const newLevel = l + 1;
          // Bonus points for completing level
          setScore(s => s + GAME_CONFIG.BONUS_POINTS_PER_LEVEL);
          return newLevel;
        });
        setBullets([]);
      }
    }, 50);

    return () => clearInterval(gameLoop);
  }, [gameOver, aliens, playerX, level, activeShield]);

  // Restart game
  const restartGame = () => {
    setGameOver(false);
    setScore(0);
    setLevel(1);
    setLives(GAME_CONFIG.INITIAL_LIVES);
    setBullets([]);
    setPlayerX(50);
    setPowerUps([]);
  };

  return (
    <div className="relative w-full h-full bg-black overflow-hidden">
      {/* Game Info */}
      <div className="absolute top-4 left-4 text-white text-xl font-bold flex items-center space-x-4">
        <div>Score: {score}</div>
        <div className="flex items-center">
          {[...Array(lives)].map((_, i) => (
            <Heart key={i} className="text-red-500 w-6 h-6" />
          ))}
        </div>
        <div>Level: {level}</div>
      </div>
      
      {/* Player with power-up indicators */}
      <div 
        className={`absolute bottom-4 w-10 h-6 transform -translate-x-1/2 ${
          activeShield ? 'bg-blue-500' : 'bg-green-500'
        }`}
        style={{ left: `${playerX}%` }}
      >
        {activeShield && <Shield className="absolute top-0 left-0 text-white w-full h-full" />}
      </div>
      
      {/* Bullets */}
      {bullets.map((bullet, i) => (
        <div
          key={i}
          className={`absolute w-2 h-6 transform -translate-x-1/2 ${
            bullet.type === 'alien' ? 'bg-red-400' : 'bg-yellow-400'
          }`}
          style={{ left: `${bullet.x}%`, top: `${bullet.y}%` }}
        />
      ))}
      
      {/* Aliens with health visualization */}
      {aliens.map((alien, i) => (
        <div
          key={i}
          className={`absolute w-8 h-8 transform -translate-x-1/2 -translate-y-1/2 ${
            alien.type === 'basic' ? 'bg-red-500' : 
            alien.type === 'tough' ? 'bg-orange-500' : 
            'bg-purple-600'
          }`}
          style={{ left: `${alien.x}%`, top: `${alien.y}%` }}
        >
          <div className="absolute w-6 h-2 bg-red-700 top-1 left-1">
            {/* Health indicator */}
            {alien.health > 1 && (
              <div className="text-white text-xs text-center">{alien.health}</div>
            )}
          </div>
        </div>
      ))}
      
      {/* Power-ups */}
      {powerUps.map((powerUp, i) => (
        <div
          key={i}
          className="absolute w-6 h-6 transform -translate-x-1/2 -translate-y-1/2"
          style={{ left: `${powerUp.x}%`, top: `${powerUp.y}%` }}
        >
          {powerUp.type === 'shield' && <Shield className="text-blue-500" />}
          {powerUp.type === 'multishot' && <Rocket className="text-green-500" />}
          {powerUp.type === 'rapid-fire' && <Alien className="text-purple-500" />}
        </div>
      ))}
      
      {/* Game over screen */}
      {gameOver && (
        <div className="absolute inset-0 bg-black bg-opacity-70 flex flex-col items-center justify-center">
          <h2 className="text-4xl font-bold text-white mb-4">Game Over!</h2>
          <p className="text-2xl text-white mb-6">Score: {score}</p>
          <motion.button
            className="bg-green-500 text-white px-6 py-3 rounded-lg font-bold flex items-center"
            onClick={restartGame}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Trophy className="mr-2" /> Play Again
          </motion.button>
        </div>
      )}
      
      {/* Level complete */}
      {aliens.length === 0 && !gameOver && (
        <div className="absolute inset-0 bg-black bg-opacity-70 flex flex-col items-center justify-center">
          <h2 className="text-4xl font-bold text-white mb-4">Level Complete!</h2>
          <p className="text-2xl text-white mb-6">Score: {score}</p>
          <motion.button
            className="bg-green-500 text-white px-6 py-3 rounded-lg font-bold flex items-center"
            onClick={() => setAliens([])}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Trophy className="mr-2" /> Next Level
          </motion.button>
        </div>
      )}
    </div>
  );
}