import { useRef } from 'react';
import { motion } from 'framer-motion';

const featureCardVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 0.5
    }
  }
};

export default function FeaturesSection() {
  const sectionRef = useRef<HTMLElement>(null);

  return (
    <section 
      id="features" 
      ref={sectionRef} 
      className="scroll-section relative py-20 bg-secondary"
    >
      <div className="container mx-auto px-4">
        <motion.h2 
          className="text-4xl md:text-5xl font-audiowide text-center mb-20 text-accent"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          Why Choose <span className="text-primary">AYSTAR</span>?
        </motion.h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Feature 1 */}
          <motion.div 
            className="feature-card bg-background/80 border border-gray-800 rounded-xl p-8 transform transition-all duration-500 hover:-translate-y-4 hover:shadow-xl hover:shadow-primary/20 relative gradient-border"
            variants={featureCardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            custom={0}
          >
            <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground rounded-full w-20 h-20 flex items-center justify-center shadow-lg shadow-primary/30">
              <i className="fas fa-bolt text-4xl"></i>
            </div>
            <h3 className="font-rajdhani font-bold text-2xl mt-10 mb-4 text-white">Instant Access</h3>
            <p className="text-gray-300">No downloads, no waiting. Jump into your favorite games instantly from any device with an internet connection.</p>
          </motion.div>
          
          {/* Feature 2 */}
          <motion.div 
            className="feature-card bg-background/80 border border-gray-800 rounded-xl p-8 transform transition-all duration-500 hover:-translate-y-4 hover:shadow-xl hover:shadow-blue-500/20 relative gradient-border"
            variants={featureCardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            custom={1}
            transition={{ delay: 0.2 }}
          >
            <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-blue-500 text-primary-foreground rounded-full w-20 h-20 flex items-center justify-center shadow-lg shadow-blue-500/30">
              <i className="fas fa-microchip text-4xl"></i>
            </div>
            <h3 className="font-rajdhani font-bold text-2xl mt-10 mb-4 text-white">Cutting-Edge Hardware</h3>
            <p className="text-gray-300">Experience maximum performance without expensive hardware upgrades. Our servers handle the heavy lifting for you.</p>
          </motion.div>
          
          {/* Feature 3 */}
          <motion.div 
            className="feature-card bg-background/80 border border-gray-800 rounded-xl p-8 transform transition-all duration-500 hover:-translate-y-4 hover:shadow-xl hover:shadow-accent/20 relative gradient-border"
            variants={featureCardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            custom={2}
            transition={{ delay: 0.4 }}
          >
            <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-accent text-primary-foreground rounded-full w-20 h-20 flex items-center justify-center shadow-lg shadow-accent/30">
              <i className="fas fa-gamepad text-4xl"></i>
            </div>
            <h3 className="font-rajdhani font-bold text-2xl mt-10 mb-4 text-white">Extensive Library</h3>
            <p className="text-gray-300">Access hundreds of AAA titles and indie gems with a single subscription. New games added every month.</p>
          </motion.div>
        </div>
        
        {/* Additional Features */}
        <motion.div 
          className="mt-24 grid grid-cols-1 md:grid-cols-2 gap-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <div className="flex items-start p-6 bg-background/40 rounded-lg">
            <div className="bg-primary/20 rounded-full p-3 mr-4">
              <i className="fas fa-users text-primary text-xl"></i>
            </div>
            <div>
              <h4 className="font-rajdhani font-bold text-xl mb-2">Multiplayer Community</h4>
              <p className="text-gray-400">Connect with gamers worldwide with integrated voice chat and friend systems.</p>
            </div>
          </div>
          
          <div className="flex items-start p-6 bg-background/40 rounded-lg">
            <div className="bg-blue-500/20 rounded-full p-3 mr-4">
              <i className="fas fa-mobile-alt text-blue-500 text-xl"></i>
            </div>
            <div>
              <h4 className="font-rajdhani font-bold text-xl mb-2">Cross-Device Compatibility</h4>
              <p className="text-gray-400">Play on your PC, tablet, smartphone, or smart TV with seamless progression.</p>
            </div>
          </div>
          
          <div className="flex items-start p-6 bg-background/40 rounded-lg">
            <div className="bg-accent/20 rounded-full p-3 mr-4">
              <i className="fas fa-shield-alt text-accent text-xl"></i>
            </div>
            <div>
              <h4 className="font-rajdhani font-bold text-xl mb-2">Advanced Security</h4>
              <p className="text-gray-400">Your data and gaming sessions are fully encrypted and protected.</p>
            </div>
          </div>
          
          <div className="flex items-start p-6 bg-background/40 rounded-lg">
            <div className="bg-primary/20 rounded-full p-3 mr-4">
              <i className="fas fa-trophy text-primary text-xl"></i>
            </div>
            <div>
              <h4 className="font-rajdhani font-bold text-xl mb-2">Achievements & Rewards</h4>
              <p className="text-gray-400">Earn points and unlock exclusive content as you play your favorite games.</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
