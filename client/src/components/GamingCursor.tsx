import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';

export default function GamingCursor() {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [lastPosition, setLastPosition] = useState({ x: -100, y: -100 });
  const [velocity, setVelocity] = useState({ x: 0, y: 0 });
  const [isClicking, setIsClicking] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(true); // Changed to true for immediate visibility
  const animationFrameRef = useRef<number>();
  const lastTimeRef = useRef<number>(0);
  const cursorRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Apply global styles to ensure cursor is always active across pages
    const styleElement = document.createElement('style');
    styleElement.innerHTML = `
      * {
        cursor: none !important;
      }
      body * {
        cursor: none !important;
      }
    `;
    document.head.appendChild(styleElement);

    const updateMousePosition = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };
    
    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);
    
    const handleMouseOver = (e: MouseEvent) => {
      // Check if hovering over clickable elements
      const target = e.target as HTMLElement;
      const isClickable = (
        target.tagName === 'BUTTON' || 
        target.tagName === 'A' || 
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.closest('button') !== null || 
        target.closest('a') !== null ||
        target.closest('[role="button"]') !== null ||
        target.classList.contains('clickable')
      );
        
      setIsHovering(isClickable);
    };

    // Handle cursor movement effect with physics
    const animateCursor = (time: number) => {
      if (!lastTimeRef.current) lastTimeRef.current = time;
      const deltaTime = time - lastTimeRef.current;
      lastTimeRef.current = time;

      // Calculate velocity based on mouse position change
      const newVelocity = {
        x: (position.x - lastPosition.x) / (deltaTime || 16.67),
        y: (position.y - lastPosition.y) / (deltaTime || 16.67)
      };

      // Apply velocity changes with damping
      setVelocity({
        x: newVelocity.x * 0.9,
        y: newVelocity.y * 0.9
      });

      // Update the last known position
      setLastPosition(position);

      // Continue animation loop
      animationFrameRef.current = requestAnimationFrame(animateCursor);
    };
    
    // Start animation loop
    animationFrameRef.current = requestAnimationFrame(animateCursor);
    
    // Add event listeners
    window.addEventListener('mousemove', updateMousePosition);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('mouseover', handleMouseOver);
    
    // Keep original cursor visible
    document.body.style.cursor = 'auto';
    
    // Cleanup
    return () => {
      document.head.removeChild(styleElement);
      window.removeEventListener('mousemove', updateMousePosition);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('mouseover', handleMouseOver);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [position, lastPosition]);
  
  if (!isVisible) return null;
  
  // Calculate rotation based on velocity
  const rotationAngle = Math.atan2(velocity.y, velocity.x) * (180 / Math.PI);
  const speed = Math.sqrt(velocity.x * velocity.x + velocity.y * velocity.y);
  const stretch = Math.min(1 + speed * 0.2, 1.5); // Limit stretch factor
  
  return (
    <>
      {/* Main cursor circle with velocity-based effects */}
      <motion.div 
        ref={cursorRef}
        className="pointer-events-none fixed z-50 mix-blend-difference"
        animate={{
          x: position.x - (isHovering ? 24 : 12),
          y: position.y - (isHovering ? 24 : 12),
          scale: isClicking ? 0.8 : isHovering ? 1.5 : 1,
          rotate: isHovering ? 0 : rotationAngle,
          scaleX: isHovering ? 1 : stretch,
          scaleY: isHovering ? 1 : 2 - stretch,
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
      
      {/* Enhanced trail effect with varied sizes */}
      {Array.from({ length: 7 }).map((_, i) => (
        <motion.div 
          key={i}
          className={`pointer-events-none fixed z-40 rounded-full mix-blend-difference ${
            i % 2 === 0 ? 'bg-primary' : 'bg-accent'
          }`}
          style={{
            width: `${Math.max(5 - i * 0.5, 2)}px`,
            height: `${Math.max(5 - i * 0.5, 2)}px`,
            opacity: 0.3 - i * 0.03
          }}
          animate={{
            x: position.x - 2.5 + (i * velocity.x * 2),
            y: position.y - 2.5 + (i * velocity.y * 2),
          }}
          transition={{
            type: "spring",
            mass: 0.1 + i * 0.05,
            stiffness: 400 - i * 30,
            damping: 30,
            delay: i * 0.02
          }}
        ></motion.div>
      ))}

      {/* Particle effects that follow cursor */}
      {Array.from({ length: 3 }).map((_, i) => (
        <motion.div 
          key={`particle-${i}`}
          className="pointer-events-none fixed z-40 w-1 h-1 bg-white rounded-full mix-blend-difference"
          animate={{
            x: [
              position.x + (Math.random() * 20 - 10),
              position.x + (Math.random() * 40 - 20),
              position.x + (Math.random() * 60 - 30)
            ],
            y: [
              position.y + (Math.random() * 20 - 10),
              position.y + (Math.random() * 40 - 20),
              position.y + (Math.random() * 60 - 30)
            ],
            opacity: [0.8, 0.4, 0],
            scale: [1, 0.5, 0]
          }}
          transition={{
            duration: 0.8 + Math.random() * 0.5,
            repeat: Infinity,
            repeatDelay: Math.random() * 0.3,
          }}
        ></motion.div>
      ))}
    </>
  );
}