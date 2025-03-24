import { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';

interface NavbarProps {
  isGamesPage?: boolean;
  onBackToHome?: () => void;
}

export function Navbar({ isGamesPage = false, onBackToHome }: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [location] = useLocation();
  
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const scrollToSection = (sectionId: string) => {
    setIsMobileMenuOpen(false);
    
    if (location !== '/') {
      window.location.href = `/#${sectionId}`;
      return;
    }
    
    const section = document.getElementById(sectionId);
    if (section) {
      window.scrollTo({
        top: section.offsetTop - 100,
        behavior: 'smooth'
      });
      // Update URL without triggering scroll
      window.history.pushState(null, '', `/#${sectionId}`);
    }
  };
  
  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  
  const navItemVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: (i: number) => ({ 
      opacity: 1, 
      y: 0,
      transition: { 
        delay: i * 0.1,
        duration: 0.2
      }
    })
  };
  
  const logoVariants = {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0, transition: { duration: 0.5 } },
    hover: { 
      scale: 1.05,
      transition: { 
        type: "spring",
        stiffness: 400,
        damping: 10
      }
    }
  };

  const navItems = [
    { text: "Home", path: "/", id: "" },
    { text: "Features", path: "/#features", id: "features" },
    { text: "Games", path: "/games", id: "" },
    { text: "Team", path: "/#team", id: "team" },
  ];

  return (
    <motion.nav 
      className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-md transition-all duration-300 ${
        scrolled 
          ? 'bg-opacity-90 bg-[#0A0E17] shadow-lg border-b border-primary/20 py-2' 
          : 'bg-opacity-60 bg-[#0A0E17] py-4'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        <motion.div 
          className="flex items-center"
          variants={logoVariants}
          initial="initial"
          animate="animate"
          whileHover="hover"
        >
          {isGamesPage && onBackToHome && (
            <motion.button 
              onClick={onBackToHome}
              className="text-[#2E96FF] hover:text-[#B026FF] transition-colors mr-6"
              whileHover={{ x: -3 }}
              whileTap={{ scale: 0.9 }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </motion.button>
          )}
          <Link href="/">
            <div className="text-2xl font-bold text-white flex items-center cursor-pointer group">
              <span className="text-[#B026FF] mr-1 group-hover:text-[#D056FF] transition-colors">AYSTAR</span>
              <span className="text-[#2E96FF] group-hover:text-[#5EADFF] transition-colors">
                {isGamesPage ? "Arena" : "Gaming"}
              </span>
              <motion.div
                className="absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-[#B026FF] to-[#2E96FF]"
                initial={{ width: 0 }}
                whileHover={{ width: "100%" }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </Link>
        </motion.div>
        
        <div className="hidden md:flex space-x-8 items-center font-['Rajdhani']">
          {navItems.map((item, index) => (
            <motion.div
              key={item.text}
              className="relative"
              variants={navItemVariants}
              initial="hidden"
              animate="visible"
              custom={index}
            >
              {item.id ? (
                <button 
                  className="text-white hover:text-[#B026FF] transition-colors duration-300 relative group py-2"
                  onClick={() => scrollToSection(item.id)}
                >
                  {item.text}
                  <motion.div
                    className="absolute -bottom-1 left-0 h-0.5 bg-[#B026FF]"
                    initial={{ width: 0 }}
                    whileHover={{ width: "100%" }}
                    transition={{ duration: 0.3 }}
                  />
                </button>
              ) : (
                <Link href={item.path} className="text-white hover:text-[#B026FF] transition-colors duration-300 relative group py-2">
                  {item.text}
                  <motion.div
                    className="absolute -bottom-1 left-0 h-0.5 bg-[#B026FF]"
                    initial={{ width: 0 }}
                    whileHover={{ width: "100%" }}
                    transition={{ duration: 0.3 }}
                  />
                </Link>
              )}
            </motion.div>
          ))}
          
          <motion.div
            variants={navItemVariants}
            initial="hidden"
            animate="visible"
            custom={4}
          >
            <Link href="/games">
              <motion.button 
                className="text-white bg-[#B026FF] bg-opacity-20 hover:bg-opacity-40 px-5 py-2 rounded-md transition-colors duration-300 border border-[#B026FF] relative overflow-hidden group"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="relative z-10">Play Now</span>
                <motion.div 
                  className="absolute inset-0 bg-[#B026FF]"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: 0 }}
                  transition={{ duration: 0.3 }}
                />
              </motion.button>
            </Link>
          </motion.div>
        </div>
        
        <div className="md:hidden">
          <motion.button 
            onClick={toggleMobileMenu} 
            className="text-white p-2"
            whileTap={{ scale: 0.9 }}
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-6 w-6" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} 
              />
            </svg>
          </motion.button>
        </div>
      </div>
      
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            className="md:hidden bg-[#0A0E17] border-t border-gray-800"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex flex-col px-4 pt-2 pb-4 space-y-3 font-['Rajdhani']">
              {navItems.map((item) => (
                item.id ? (
                  <button 
                    key={item.text}
                    onClick={() => scrollToSection(item.id)} 
                    className="text-white hover:text-[#B026FF] py-2 transition-colors duration-300 text-left"
                  >
                    {item.text}
                  </button>
                ) : (
                  <Link 
                    key={item.text}
                    href={item.path}
                    className="text-white hover:text-[#B026FF] py-2 transition-colors duration-300"
                  >
                    {item.text}
                  </Link>
                )
              ))}
              
              <Link 
                href="/games" 
                className="text-white bg-[#B026FF] bg-opacity-20 hover:bg-opacity-40 px-4 py-2 rounded-md transition-colors duration-300 border border-[#B026FF] text-center mt-2"
              >
                Play Now
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}

export default Navbar;