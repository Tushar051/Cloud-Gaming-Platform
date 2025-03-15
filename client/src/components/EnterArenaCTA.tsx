import { motion } from 'framer-motion';

interface EnterArenaCTAProps {
  onEnterClick: () => void;
}

export default function EnterArenaCTA({ onEnterClick }: EnterArenaCTAProps) {
  return (
    <section className="scroll-section relative py-32 bg-gradient-to-b from-secondary to-background overflow-hidden">
      <div className="container mx-auto px-4 text-center relative z-10">
        <div className="max-w-3xl mx-auto">
          <motion.h2 
            className="text-4xl md:text-6xl font-audiowide mb-8 text-transparent bg-clip-text bg-gradient-to-r from-primary via-blue-500 to-accent animate-pulse-glow"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7 }}
          >
            Ready to Play?
          </motion.h2>
          <motion.p 
            className="text-xl text-gray-300 mb-12 font-rajdhani"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            Experience gaming like never before. No downloads, no expensive hardware - just pure gaming bliss.
          </motion.p>
          
          <div className="perspective-container">
            <motion.button 
              onClick={onEnterClick}
              className="portal-transition group relative inline-flex items-center bg-black bg-opacity-50 border-2 border-accent text-accent font-rajdhani font-bold text-2xl px-12 py-6 rounded-full overflow-hidden"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ delay: 0.4, duration: 0.6 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              {/* Portal effect elements */}
              <span className="absolute inset-0 bg-black bg-opacity-50 z-0"></span>
              <span className="absolute inset-0 bg-gradient-to-r from-primary to-blue-500 opacity-0 group-hover:opacity-30 transition-opacity duration-500 z-0"></span>
              
              {/* Electric borders */}
              <span 
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" 
                style={{
                  background: "linear-gradient(90deg, transparent, hsl(var(--accent)), transparent)",
                  filter: "blur(5px)", 
                  zIndex: 0
                }}
              ></span>
              
              {/* Text and icon */}
              <span className="relative z-10 flex items-center gap-3">
                <span>ENTER ARENA</span>
                <i className="fas fa-arrow-right group-hover:translate-x-2 transition-transform duration-300"></i>
              </span>
            </motion.button>
          </div>
        </div>
      </div>
      
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-0 right-0 w-2/3 h-full bg-primary opacity-5 blur-3xl rounded-l-full"></div>
        <div className="absolute top-1/3 left-0 w-1/2 h-2/3 bg-blue-500 opacity-5 blur-3xl rounded-r-full"></div>
      </div>
    </section>
  );
}
