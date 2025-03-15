import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function CustomCursor() {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [isClicking, setIsClicking] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    // Only show custom cursor after a delay to prevent flash on page load
    const timeout = setTimeout(() => {
      setIsVisible(true);
    }, 500);
    
    const updateMousePosition = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };
    
    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);
    
    const handleMouseOver = (e: MouseEvent) => {
      // Check if hovering over clickable elements
      const target = e.target as HTMLElement;
      const isClickable = 
        target.tagName === 'BUTTON' || 
        target.tagName === 'A' || 
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.closest('button') !== null || 
        target.closest('a') !== null ||
        target.closest('[role="button"]') !== null ||
        target.classList.contains('clickable');
        
      setIsHovering(isClickable);
    };
    
    // Add mousemove event listener
    window.addEventListener('mousemove', updateMousePosition);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('mouseover', handleMouseOver);
    
    // Hide original cursor
    document.body.style.cursor = 'none';
    
    // Cleanup
    return () => {
      clearTimeout(timeout);
      window.removeEventListener('mousemove', updateMousePosition);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('mouseover', handleMouseOver);
      document.body.style.cursor = 'auto';
    };
  }, []);
  
  if (!isVisible) return null;
  
  return (
    <>
      {/* Main cursor circle */}
      <motion.div 
        className="pointer-events-none fixed z-50 mix-blend-difference"
        animate={{
          x: position.x - (isHovering ? 24 : 12),
          y: position.y - (isHovering ? 24 : 12),
          scale: isClicking ? 0.8 : isHovering ? 1.5 : 1,
        }}
        transition={{
          type: "spring",
          mass: 0.2,
          stiffness: 800,
          damping: 50,
          duration: 0.1
        }}
      >
        <div className={`bg-white rounded-full opacity-90 ${isHovering ? 'w-12 h-12' : 'w-6 h-6'}`}></div>
      </motion.div>
      
      {/* Small dot to follow cursor precisely */}
      <motion.div 
        className="pointer-events-none fixed z-50 w-2 h-2 bg-white rounded-full mix-blend-difference"
        animate={{
          x: position.x - 1,
          y: position.y - 1,
          opacity: isHovering ? 0 : 1,
        }}
        transition={{
          type: "spring",
          mass: 0.1,
          stiffness: 1000,
          damping: 50,
          duration: 0.05
        }}
      ></motion.div>
      
      {/* Trail effect */}
      {Array.from({ length: 5 }).map((_, i) => (
        <motion.div 
          key={i}
          className="pointer-events-none fixed z-40 w-3 h-3 bg-primary opacity-20 rounded-full"
          animate={{
            x: position.x - 1.5,
            y: position.y - 1.5,
          }}
          transition={{
            type: "spring",
            mass: 0.2,
            stiffness: 400,
            damping: 30,
            delay: i * 0.02
          }}
        ></motion.div>
      ))}
    </>
  );
}