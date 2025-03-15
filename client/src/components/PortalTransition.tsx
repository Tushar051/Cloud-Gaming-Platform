import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface PortalTransitionProps {
  isActive: boolean;
  target: string;
  onTransitionEnd: () => void;
}

export function PortalTransition({ isActive, target, onTransitionEnd }: PortalTransitionProps) {
  const portalRef = useRef<HTMLDivElement>(null);
  
  // Generate a bunch of particle elements when the transition is activated
  useEffect(() => {
    if (!isActive || !portalRef.current) return;
    
    const portalElement = portalRef.current;
    const particles: HTMLDivElement[] = [];
    const particleCount = 100;
    
    // Clear any existing particles
    portalElement.innerHTML = '';
    
    // Create particles
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      
      // Random size between 2px and 8px
      const size = Math.random() * 6 + 2;
      
      // Random position
      const posX = Math.random() * 100;
      const posY = Math.random() * 100;
      
      // Random color - blues and purples
      const hue = Math.random() * 60 + 240; // 240-300 is blue to purple
      const saturation = Math.random() * 20 + 80; // 80-100%
      const lightness = Math.random() * 30 + 60; // 60-90%
      
      // Apply styles
      particle.style.position = 'absolute';
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      particle.style.left = `${posX}%`;
      particle.style.top = `${posY}%`;
      particle.style.borderRadius = '50%';
      particle.style.backgroundColor = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
      particle.style.boxShadow = `0 0 ${size * 2}px hsl(${hue}, ${saturation}%, ${lightness}%)`;
      
      // Add animation
      particle.animate(
        [
          { opacity: 0, transform: 'scale(0) translate(0, 0)' },
          { opacity: 1, transform: `scale(1) translate(${Math.random() * 100 - 50}px, ${Math.random() * 100 - 50}px)` },
          { opacity: 0, transform: `scale(0) translate(${Math.random() * 200 - 100}px, ${Math.random() * 200 - 100}px)` }
        ],
        {
          duration: Math.random() * 800 + 400,
          easing: 'cubic-bezier(0.4, 0.0, 0.2, 1)',
          iterations: 1
        }
      );
      
      // Add to DOM
      portalElement.appendChild(particle);
      particles.push(particle);
    }
    
    // Cleanup
    return () => {
      particles.forEach(p => p.remove());
    };
  }, [isActive]);
  
  return (
    <div className="fixed inset-0 z-50 pointer-events-none">
      {isActive && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ 
            scale: [0, 1, 30],
            opacity: [0, 1, 1]
          }}
          transition={{ 
            duration: 1.2,
            times: [0, 0.3, 1],
            ease: [0.16, 1, 0.3, 1]
          }}
          onAnimationComplete={onTransitionEnd}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 rounded-full bg-gradient-to-r from-[#B026FF] to-[#2E96FF] flex items-center justify-center overflow-hidden"
        >
          <div className="absolute inset-0 blur-md opacity-70 bg-gradient-to-r from-[#B026FF] to-[#2E96FF]" />
          
          {/* Spinning ring */}
          <motion.div 
            className="absolute w-full h-full border-4 border-white rounded-full opacity-30"
            animate={{ 
              rotate: 360,
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              rotate: { 
                duration: 3, 
                ease: "linear", 
                repeat: Infinity 
              },
              scale: {
                duration: 2,
                ease: "easeInOut",
                repeat: Infinity,
                repeatType: "reverse"
              }
            }}
          />
          
          {/* Particles container */}
          <div ref={portalRef} className="absolute inset-0" />
          
          {/* Center glow */}
          <motion.div 
            className="absolute w-1/3 h-1/3 bg-white rounded-full blur-md"
            animate={{ 
              scale: [1, 1.5, 1],
              opacity: [0.5, 0.8, 0.5]
            }}
            transition={{ 
              duration: 2,
              ease: "easeInOut",
              repeat: Infinity,
              repeatType: "reverse"
            }}
          />
          
          {/* Text */}
          <motion.div
            className="relative text-white font-bold text-center z-10"
            animate={{
              opacity: [0, 1, 0]
            }}
            transition={{
              duration: 0.8,
              times: [0, 0.2, 1],
              delay: 0.1
            }}
          >
            <div className="text-sm">Entering</div>
            <div className="text-lg">{target.replace('/', '')}</div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}