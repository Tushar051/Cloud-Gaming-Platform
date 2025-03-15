import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface PortalTransitionProps {
  isVisible: boolean;
}

export function PortalTransition({ isVisible }: PortalTransitionProps) {
  // Track animation states
  const [portalSize, setPortalSize] = useState(0);
  
  useEffect(() => {
    if (isVisible) {
      // Start with a small portal
      setPortalSize(100);
      
      // Then expand it
      const expandTimer = setTimeout(() => {
        setPortalSize(3000);
      }, 400);
      
      return () => {
        clearTimeout(expandTimer);
      };
    } else {
      setPortalSize(0);
    }
  }, [isVisible]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.7)' }}
        >
          <motion.div
            className="rounded-full"
            initial={{ width: 0, height: 0 }}
            animate={{ 
              width: portalSize, 
              height: portalSize
            }}
            transition={{ 
              duration: 0.8,
              ease: [0.68, -0.6, 0.32, 1.6]
            }}
            style={{
              background: 'linear-gradient(45deg, hsl(var(--primary)), hsl(var(--chart-2)), hsl(var(--accent)))',
              boxShadow: '0 0 100px 20px currentColor'
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
