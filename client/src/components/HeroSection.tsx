import { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import AnimatedText3D from './3d/AnimatedText3D';
import GamingBoyAnimation from './GamingBoyAnimation';

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  
  // Function to handle scroll-to-features button
  const scrollToFeatures = () => {
    const featuresSection = document.getElementById('features');
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      id="hero"
      ref={sectionRef}
      className="scroll-section relative min-h-screen flex items-center justify-center overflow-hidden pt-28"
    >
      <div className="absolute inset-0 bg-background">
        {/* Animated background elements */}
        <div className="absolute top-0 right-0 w-2/3 h-3/4 bg-gradient-to-b from-primary/10 to-transparent rounded-bl-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-3/4 h-1/2 bg-gradient-to-t from-accent/10 to-transparent rounded-tr-full blur-3xl"></div>
        
        {/* Grid lines for cyber effect */}
        <div 
          className="absolute inset-0 opacity-5" 
          style={{
            backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
            backgroundSize: '40px 40px'
          }}
        ></div>
      </div>
      
      <div className="container mx-auto px-4 z-10 text-center perspective-container">
        <motion.div 
          className="hero-text"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <AnimatedText3D maxRotation={10} className="mb-6">
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-audiowide tracking-wider mb-6">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-500 inline-block">CLOUD GAMING</span>
              <span className="block mt-2 text-accent text-shadow">PLATFORM</span>
            </h1>
          </AnimatedText3D>
          <p className="text-xl md:text-2xl font-rajdhani max-w-2xl mx-auto text-gray-300 mb-12">
            Experience next-gen gaming without limits. Play anywhere, anytime with cutting-edge cloud technology.
          </p>
        </motion.div>
        
        {/* Gaming Boy Animation */}
        <motion.div
          className="flex justify-center mt-2 mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          <div className="relative">
            <GamingBoyAnimation className="z-10 transform scale-90" />
            
            {/* Glow effect beneath the character */}
            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-40 h-10 bg-primary/40 rounded-full blur-xl"></div>
            
            {/* Gaming particles around the character */}
            <motion.div
              className="absolute -top-5 -left-5 w-4 h-4 rounded-full bg-blue-500"
              animate={{
                opacity: [0, 1, 0],
                scale: [0, 1, 0],
                x: [0, -20],
                y: [0, -20]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatDelay: 1
              }}
            />
            <motion.div
              className="absolute top-10 -right-5 w-3 h-3 rounded-full bg-primary"
              animate={{
                opacity: [0, 1, 0],
                scale: [0, 1, 0],
                x: [0, 20],
                y: [0, -15]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                repeatDelay: 2,
                delay: 0.5
              }}
            />
            <motion.div
              className="absolute bottom-20 -right-3 w-2 h-2 rounded-full bg-accent"
              animate={{
                opacity: [0, 1, 0],
                scale: [0, 1, 0],
                x: [0, 15],
                y: [0, 10]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatDelay: 1.5,
                delay: 1
              }}
            />
          </div>
        </motion.div>
        
        <motion.div 
          className="mt-8 opacity-80"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.8 }}
          transition={{ delay: 1, duration: 0.5 }}
        >
          <button 
            onClick={scrollToFeatures}
            className="flex justify-center items-center animate-pulse"
            aria-label="Scroll to features"
          >
            <i className="fas fa-chevron-down text-3xl text-accent"></i>
          </button>
        </motion.div>
      </div>
    </section>
  );
}
