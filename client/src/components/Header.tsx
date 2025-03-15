import { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';

export default function Header() {
  const [location] = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Add scroll event listener to change header appearance
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className={`fixed top-0 w-full z-50 backdrop-blur-md border-b border-gray-800 transition-all duration-300 ${
      isScrolled ? 'bg-background/90 py-2' : 'bg-background/70 py-3'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-primary font-audiowide text-2xl tracking-wider neon-glow">AYSTAR<span className="text-accent">PLAY</span></span>
          </Link>
          <div className="hidden md:flex items-center gap-8">
            <Link href="/#features" className={`text-gray-300 hover:text-accent transition duration-300 font-rajdhani text-lg ${location === '/' ? 'block' : 'hidden'}`}>
              Features
            </Link>
            <Link href="/#team" className={`text-gray-300 hover:text-accent transition duration-300 font-rajdhani text-lg ${location === '/' ? 'block' : 'hidden'}`}>
              Team
            </Link>
            <Link href="/games" className="text-gray-300 hover:text-accent transition duration-300 font-rajdhani text-lg">
              Games
            </Link>
            <Link href="/" className="text-gray-300 hover:text-accent transition duration-300 font-rajdhani text-lg">
              About
            </Link>
          </div>
          <div className="flex items-center">
            <motion.button 
              className="bg-gradient-to-r from-primary to-blue-500 px-5 py-2 rounded-full font-rajdhani font-semibold hover:shadow-lg hover:shadow-primary/20 transition duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Sign In
            </motion.button>
            <button 
              className="md:hidden ml-4 text-gray-300"
              onClick={toggleMobileMenu}
              aria-label="Toggle menu"
            >
              <i className={`fas ${isMobileMenuOpen ? 'fa-times' : 'fa-bars'} text-2xl`}></i>
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            className="md:hidden bg-secondary border-t border-gray-800"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="container mx-auto px-4 py-4">
              <div className="flex flex-col space-y-4">
                <Link href="/#features" className="text-gray-300 hover:text-accent py-2 font-rajdhani text-lg" onClick={() => setIsMobileMenuOpen(false)}>
                  Features
                </Link>
                <Link href="/#team" className="text-gray-300 hover:text-accent py-2 font-rajdhani text-lg" onClick={() => setIsMobileMenuOpen(false)}>
                  Team
                </Link>
                <Link href="/games" className="text-gray-300 hover:text-accent py-2 font-rajdhani text-lg" onClick={() => setIsMobileMenuOpen(false)}>
                  Games
                </Link>
                <Link href="/" className="text-gray-300 hover:text-accent py-2 font-rajdhani text-lg" onClick={() => setIsMobileMenuOpen(false)}>
                  About
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
