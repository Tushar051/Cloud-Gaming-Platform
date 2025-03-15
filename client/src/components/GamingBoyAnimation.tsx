import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface GamingBoyAnimationProps {
  className?: string;
}

export default function GamingBoyAnimation({ className }: GamingBoyAnimationProps) {
  const characterRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const character = characterRef.current;
    if (!character) return;
    
    const handleMouseMove = (e: MouseEvent) => {
      // Get mouse position
      const mouseX = e.clientX;
      const mouseY = e.clientY;
      
      // Get the position and dimensions of the character
      const rect = character.getBoundingClientRect();
      const charCenterX = rect.left + rect.width / 2;
      const charCenterY = rect.top + rect.height / 2;
      
      // Calculate the difference between mouse and character
      const deltaX = mouseX - charCenterX;
      const deltaY = mouseY - charCenterY;
      
      // Calculate the angle for head rotation (limited range)
      const headAngle = Math.min(Math.max(deltaX / 50, -15), 15);
      
      // Apply transformations
      const headElement = character.querySelector('.head') as HTMLElement;
      const phoneElement = character.querySelector('.phone') as HTMLElement;
      const bodyElement = character.querySelector('.body') as HTMLElement;
      
      if (headElement) {
        headElement.style.transform = `rotate(${headAngle * 0.5}deg)`;
      }
      
      if (phoneElement) {
        phoneElement.style.transform = `rotate(${deltaX * 0.01}deg) translateX(${deltaX * 0.01}px)`;
      }
      
      if (bodyElement) {
        bodyElement.style.transform = `translateX(${deltaX * 0.01}px) translateY(${deltaY * 0.005}px)`;
      }
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);
  
  // Animation variants
  const containerVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.5,
        delay: 0.2
      }
    }
  };
  
  const floatingAnimation = {
    y: [0, -10, 0],
    transition: {
      duration: 4,
      repeat: Infinity,
      repeatType: "reverse" as const,
      ease: "easeInOut"
    }
  };
  
  return (
    <motion.div 
      ref={characterRef}
      className={`relative ${className}`}
      variants={containerVariants}
      initial="initial"
      animate="animate"
      whileHover={{ scale: 1.05 }}
    >
      <motion.div animate={floatingAnimation}>
        <svg width="200" height="250" viewBox="0 0 200 250" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Body */}
          <g className="body">
            <rect x="60" y="100" width="80" height="100" rx="10" fill="#6E57E0" />
            <rect x="70" y="180" width="25" height="40" rx="5" fill="#4B3BBF" />
            <rect x="105" y="180" width="25" height="40" rx="5" fill="#4B3BBF" />
          </g>
          
          {/* Head */}
          <g className="head">
            <circle cx="100" cy="60" r="40" fill="#FFD3B5" />
            <path d="M85 50 Q100 65 115 50" stroke="black" strokeWidth="2" fill="none" />
            <circle cx="85" cy="40" r="5" fill="black" />
            <circle cx="115" cy="40" r="5" fill="black" />
            
            {/* Hair */}
            <path d="M60 40 Q70 20 100 20 Q130 20 140 40" fill="#553311" />
            <path d="M60 40 Q70 60 60 80" fill="#553311" />
            <path d="M140 40 Q130 60 140 80" fill="#553311" />
            
            {/* Headphones */}
            <path d="M60 60 Q50 80 55 100" stroke="#333" strokeWidth="5" />
            <path d="M140 60 Q150 80 145 100" stroke="#333" strokeWidth="5" />
            <rect x="45" y="60" width="10" height="20" rx="5" fill="#FF5252" />
            <rect x="145" y="60" width="10" height="20" rx="5" fill="#FF5252" />
            <path d="M55 60 Q100 10 145 60" stroke="#333" strokeWidth="5" fill="none" />
          </g>
          
          {/* Phone in hands */}
          <g className="phone">
            <rect x="75" y="130" width="50" height="30" rx="5" fill="#222" />
            <rect x="80" y="135" width="40" height="20" rx="2" fill="#B026FF" />
            
            {/* Game content on phone screen */}
            <text x="85" y="148" fill="white" fontSize="7">AYSTAR</text>
            <rect x="85" y="150" width="10" height="3" fill="white" />
            <rect x="105" y="150" width="10" height="3" fill="white" />
          </g>
          
          {/* Arms */}
          <path d="M60 120 Q50 130 70 140" stroke="#FFD3B5" strokeWidth="8" fill="none" />
          <path d="M140 120 Q150 130 130 140" stroke="#FFD3B5" strokeWidth="8" fill="none" />
          
          {/* Gaming effects */}
          <g className="gaming-effects">
            <motion.circle 
              cx="160" 
              cy="60" 
              r="5" 
              fill="#B026FF" 
              animate={{ 
                opacity: [0, 1, 0],
                scale: [0, 1.5, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: "loop",
                times: [0, 0.5, 1],
                delay: 0.5
              }}
            />
            <motion.circle 
              cx="170" 
              cy="80" 
              r="3" 
              fill="#2E96FF" 
              animate={{ 
                opacity: [0, 1, 0],
                scale: [0, 1.5, 0],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                repeatType: "loop",
                times: [0, 0.5, 1],
                delay: 0.8
              }}
            />
            <motion.circle 
              cx="40" 
              cy="70" 
              r="4" 
              fill="#B026FF" 
              animate={{ 
                opacity: [0, 1, 0],
                scale: [0, 1.5, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: "loop",
                times: [0, 0.5, 1],
                delay: 1.2
              }}
            />
          </g>
          
          {/* Expression changes on interaction */}
          <motion.g
            className="expressions"
            initial="normal"
            whileHover="excited"
            variants={{
              normal: { opacity: 1 },
              excited: { opacity: 0 }
            }}
          >
            <path d="M85 50 Q100 65 115 50" stroke="black" strokeWidth="2" fill="none" />
          </motion.g>
          
          <motion.g
            className="expressions-alt"
            initial="normal"
            whileHover="excited"
            variants={{
              normal: { opacity: 0 },
              excited: { opacity: 1 }
            }}
          >
            <path d="M85 55 Q100 70 115 55" stroke="black" strokeWidth="2" fill="none" />
          </motion.g>
        </svg>
      </motion.div>
      
      {/* Keyboard typing animation */}
      <motion.div
        className="absolute bottom-[70px] left-[75px] w-[50px] h-[5px] flex justify-between"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <motion.div
          className="w-[3px] h-[3px] bg-white rounded-full"
          animate={{ 
            opacity: [0, 1, 0],
            y: [0, -2, 0] 
          }}
          transition={{
            duration: 0.5,
            repeat: Infinity,
            repeatType: "loop",
            delay: 0,
            repeatDelay: 1
          }}
        />
        <motion.div
          className="w-[3px] h-[3px] bg-white rounded-full"
          animate={{ 
            opacity: [0, 1, 0],
            y: [0, -2, 0] 
          }}
          transition={{
            duration: 0.5,
            repeat: Infinity,
            repeatType: "loop",
            delay: 0.1,
            repeatDelay: 0.8
          }}
        />
        <motion.div
          className="w-[3px] h-[3px] bg-white rounded-full"
          animate={{ 
            opacity: [0, 1, 0],
            y: [0, -2, 0] 
          }}
          transition={{
            duration: 0.5,
            repeat: Infinity,
            repeatType: "loop",
            delay: 0.2,
            repeatDelay: 1.2
          }}
        />
      </motion.div>
    </motion.div>
  );
}