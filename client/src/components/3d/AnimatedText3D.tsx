import { ReactNode, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { calculateMouseRotation } from '@/lib/3d-utils';

interface AnimatedText3DProps {
  children: ReactNode;
  maxRotation?: number;
  className?: string;
}

export default function AnimatedText3D({ 
  children, 
  maxRotation = 10,
  className
}: AnimatedText3DProps) {
  const textRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const element = textRef.current;
    if (!element) return;
    
    const handleMouseMove = (e: MouseEvent) => {
      const { rotateX, rotateY } = calculateMouseRotation(e, maxRotation);
      
      // Apply 3D transformation
      element.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    };
    
    // Add event listener for mouse movement
    window.addEventListener('mousemove', handleMouseMove);
    
    // Cleanup
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [maxRotation]);
  
  return (
    <motion.div 
      ref={textRef}
      className={cn(
        "transition-transform duration-200 ease-out",
        className
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        type: "spring", 
        stiffness: 300, 
        damping: 30,
        delay: 0.2
      }}
    >
      {children}
    </motion.div>
  );
}