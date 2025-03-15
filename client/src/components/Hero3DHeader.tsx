import { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import * as THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text3D, Center, PerspectiveCamera } from '@react-three/drei';

// 3D Text component that responds to mouse movements
const AnimatedText = ({ text, color, position }: { text: string, color: string, position: [number, number, number] }) => {
  const mesh = useRef<THREE.Mesh>(null);
  
  useFrame(({ mouse }) => {
    if (!mesh.current) return;
    
    // Convert mouse position from normalized (-1 to 1) to rotation angles
    const targetRotationX = -(mouse.y * 0.1);
    const targetRotationY = mouse.x * 0.1;
    
    // Smooth rotation
    mesh.current.rotation.x = THREE.MathUtils.lerp(mesh.current.rotation.x, targetRotationX, 0.1);
    mesh.current.rotation.y = THREE.MathUtils.lerp(mesh.current.rotation.y, targetRotationY, 0.1);
  });
  
  return (
    <mesh ref={mesh} position={position}>
      <Text3D 
        font="/fonts/Orbitron_Regular.json"
        size={1.2}
        height={0.2}
        curveSegments={4}
        bevelEnabled
        bevelThickness={0.05}
        bevelSize={0.04}
        bevelOffset={0}
        bevelSegments={5}
      >
        {text}
        <meshStandardMaterial color={color} />
      </Text3D>
    </mesh>
  );
};

// Particle effect component
const Particles = ({ count = 200 }: { count?: number }) => {
  const mesh = useRef<THREE.Points>(null);
  const positions = new Float32Array(count * 3);
  
  // Create random positions for particles
  for (let i = 0; i < count; i++) {
    const i3 = i * 3;
    positions[i3] = (Math.random() - 0.5) * 30;
    positions[i3 + 1] = (Math.random() - 0.5) * 15;
    positions[i3 + 2] = (Math.random() - 0.5) * 10;
  }
  
  useFrame(({ clock }) => {
    if (!mesh.current) return;
    mesh.current.rotation.y = clock.getElapsedTime() * 0.02;
  });
  
  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.05} color="#ffffff" transparent opacity={0.6} />
    </points>
  );
};

interface Hero3DHeaderProps {
  onScrollDown: () => void;
}

export function Hero3DHeader({ onScrollDown }: Hero3DHeaderProps) {
  // Fallback for browsers where WebGL might not be available
  const supportsWebGL = useRef(true);
  
  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      supportsWebGL.current = !!(
        window.WebGLRenderingContext &&
        (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
      );
    } catch (e) {
      supportsWebGL.current = false;
    }
  }, []);
  
  // Particles for background effect
  const particleCount = 100;
  const particles = Array.from({ length: particleCount }).map((_, i) => {
    const size = Math.random() * 3 + 1;
    const top = `${Math.random() * 100}%`;
    const left = `${Math.random() * 100}%`;
    const animationDuration = `${Math.random() * 20 + 10}s`;
    const delay = `${Math.random() * 5}s`;
    
    return (
      <div
        key={i}
        className="absolute rounded-full bg-white opacity-10"
        style={{
          width: `${size}px`,
          height: `${size}px`,
          top,
          left,
          animation: `float ${animationDuration} infinite`,
          animationDelay: delay,
        }}
      />
    );
  });
  
  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden" id="hero">
      <div className="absolute inset-0 bg-gradient-to-b from-[#0A0E17] to-[#2D1B4E] opacity-80"></div>
      <div className="absolute inset-0" id="particleBackground">
        {particles}
      </div>
      
      <div className="container mx-auto px-4 py-20 text-center relative z-10">
        <div className="perspective h-[200px] md:h-[300px] mb-8">
          {supportsWebGL.current ? (
            <Canvas>
              <ambientLight intensity={0.5} />
              <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
              <PerspectiveCamera makeDefault position={[0, 0, 10]} />
              <Center>
                <AnimatedText text="NEXUS" color="#B026FF" position={[-4.5, 0, 0]} />
                <AnimatedText text="CLOUD" color="#ffffff" position={[0, 0, 0]} />
                <AnimatedText text="GAMING" color="#2E96FF" position={[5, 0, 0]} />
              </Center>
              <Particles />
            </Canvas>
          ) : (
            // Fallback for browsers without WebGL
            <div className="flex justify-center items-center h-full">
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white">
                <span className="text-[#B026FF]">NEXUS</span> 
                <span className="text-white">CLOUD</span> 
                <span className="text-[#2E96FF]">GAMING</span>
              </h1>
            </div>
          )}
        </div>
        
        <motion.p 
          className="text-xl md:text-2xl max-w-3xl mx-auto mb-8 text-[#A0A0A8]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          Experience gaming without boundaries. High-performance titles streamed directly to your device.
        </motion.p>
        
        <motion.div 
          className="inline-block relative"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
        >
          <button onClick={onScrollDown} className="group">
            <div className="text-[#B026FF] animate-bounce">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </div>
            <span className="block mt-2 text-sm text-[#A0A0A8] group-hover:text-[#B026FF] transition-colors duration-300">
              Discover More
            </span>
          </button>
        </motion.div>
      </div>
      
      <div className="absolute bottom-0 left-0 w-full">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
          <path fill="#2D1B4E" fillOpacity="0.8" d="M0,96L48,117.3C96,139,192,181,288,186.7C384,192,480,160,576,154.7C672,149,768,171,864,192C960,213,1056,235,1152,218.7C1248,203,1344,149,1392,122.7L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
        </svg>
      </div>
    </section>
  );
}

export default Hero3DHeader;
