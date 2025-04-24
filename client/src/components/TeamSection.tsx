import { motion } from 'framer-motion';

const teamMembers = [
  {
    name: "Aayush",
    role: "Gaming Master",
    bio: "Expert game developer with exceptional skills in creating immersive and challenging game experiences.",
    imageUrl: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=880&h=1100&q=80",
    color: "text-blue-500"
  },
  {
    name: "Tushar",
        role: "Backend Developer",
        bio: "Specialized in creating robust backend systems that power high-performance gaming platforms.",
        imageUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&h=1000&q=80",
        color: "text-primary"
  },
  {
    name: "Sammy",
    role: "ML Engineer",
    bio: "Implements cutting-edge machine learning solutions to enhance gameplay and create adaptive gaming experiences.",
    imageUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=880&h=1100&q=80",
    color: "text-accent"
  },
  {
    name: "Vivek",
    role: "AI Engineer",
    bio: "Designs intelligent systems that bring games to life with adaptive AI behaviors and realistic NPC interactions.",
    imageUrl: "https://images.unsplash.com/photo-1542190891-2093d38760f2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=880&h=1100&q=80",
    color: "text-accent"
  }
];

const teamCardVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: (i: number) => ({ 
    opacity: 1, 
    y: 0,
    transition: { 
      delay: i * 0.2,
      duration: 0.6
    }
  })
};

export default function TeamSection() {
  return (
    <section id="team" className="scroll-section relative py-24 bg-background">
      <div className="container mx-auto px-4">
        <motion.h2 
          className="text-4xl md:text-5xl font-audiowide text-center mb-20 text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-primary"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          Meet The Team
        </motion.h2>
        
        <div className="flex flex-nowrap overflow-x-auto pb-6 gap-6 px-2 -mx-2">
          {teamMembers.map((member, index) => (
            <motion.div 
              key={member.name}
              className="team-card relative rounded-xl overflow-hidden group min-w-[300px] flex-shrink-0"
              variants={teamCardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              custom={index}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent z-10"></div>
              <img 
                src={member.imageUrl}
                alt={member.name} 
                className="w-full h-[400px] object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute bottom-0 left-0 right-0 p-6 z-20 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                <h3 className="font-rajdhani font-bold text-2xl text-white">{member.name}</h3>
                <p className={`${member.color} font-rajdhani`}>{member.role}</p>
                <p className="text-gray-300 mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {member.bio}
                </p>
                <div className="flex gap-4 mt-4">
                  <a href="#" className="text-gray-400 hover:text-accent">
                    <i className="fab fa-linkedin text-xl"></i>
                  </a>
                  <a href="#" className="text-gray-400 hover:text-accent">
                    <i className="fab fa-twitter text-xl"></i>
                  </a>
                  <a href="#" className="text-gray-400 hover:text-accent">
                    <i className="fas fa-envelope text-xl"></i>
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}