import { motion } from 'framer-motion';

interface EnterArenaSectionProps {
  onEnterArena: () => void;
}

export function EnterArenaSection({ onEnterArena }: EnterArenaSectionProps) {
  const floatingElements = [
    { size: 'w-20 h-20', color: 'bg-[#B026FF]', position: 'top-1/4 left-1/4', delay: 0 },
    { size: 'w-32 h-32', color: 'bg-[#2E96FF]', position: 'bottom-1/3 right-1/5', delay: 2 },
    { size: 'w-24 h-24', color: 'bg-[#26FFB0]', position: 'top-2/3 left-1/3', delay: 4 }
  ];
  
  return (
    <section className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[#0A0E17] to-[#2D1B4E]"></div>
      
      {/* Floating elements for atmosphere */}
      {floatingElements.map((el, index) => (
        <motion.div
          key={index}
          className={`absolute ${el.size} ${el.color} rounded-full blur-3xl opacity-20`}
          initial={{ y: 0 }}
          animate={{ y: [-20, 20, -20] }}
          transition={{
            repeat: Infinity,
            duration: 6,
            ease: "easeInOut",
            delay: el.delay
          }}
          style={{ top: el.position.split(' ')[0], left: el.position.split(' ')[1] }}
        />
      ))}
      
      <div className="container mx-auto px-4 relative z-10 text-center">
        <motion.h2 
          className="text-4xl md:text-5xl font-bold mb-8 text-shadow-sm"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          Ready to Play?
        </motion.h2>
        
        <motion.p 
          className="text-xl max-w-3xl mx-auto mb-12 text-[#A0A0A8]"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Step into the arena and experience gaming like never before. No downloads, no waiting. Just pure gaming.
        </motion.p>
        
        <div className="perspective mx-auto w-full max-w-md">
          <motion.button 
            onClick={onEnterArena}
            className="relative w-full py-6 px-8 text-2xl font-bold bg-transparent overflow-hidden group rounded-xl border border-[#B026FF] border-opacity-50 transition-all duration-800"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <span className="relative z-10 flex items-center justify-center space-x-2 text-white group-hover:text-[#B026FF] transition-colors duration-500">
              <span>ENTER THE ARENA</span>
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-5 w-5 transition-transform duration-500 group-hover:translate-x-2" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </span>
            
            <div className="absolute inset-0 bg-[#2D1B4E] opacity-30 group-hover:opacity-0 transition-opacity duration-500"></div>
            
            <div className="absolute inset-0 bg-gradient-to-r from-[#B026FF] via-[#2E96FF] to-[#B026FF] opacity-80 group-hover:opacity-100 transition-all duration-500 blur-sm group-hover:blur-md"></div>
            
            <div className="absolute inset-0 bg-[#0A0E17] opacity-90 group-hover:opacity-80 transition-opacity duration-500"></div>
            
            <div className="absolute -inset-px rounded-xl shadow-[0_0_15px_#B026FF,_0_0_30px_#2E96FF] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </motion.button>
        </div>
      </div>
    </section>
  );
}

export default EnterArenaSection;
