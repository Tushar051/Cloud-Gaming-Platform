import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface GamerCharacterProps {
  className?: string;
}

export default function GamerCharacter({ className = '' }: GamerCharacterProps) {
  const characterRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!characterRef.current) return;
    
    const character = characterRef.current;
    
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const rect = character.getBoundingClientRect();
      const characterCenterX = rect.left + rect.width / 2;
      const characterCenterY = rect.top + rect.height / 2;
      
      // Calculate the distance from the mouse to the character center
      const deltaX = clientX - characterCenterX;
      const deltaY = clientY - characterCenterY;
      
      // Limit the rotation to a reasonable amount
      const maxRotation = 15;
      const rotateY = Math.max(-maxRotation, Math.min(maxRotation, -deltaX / 50));
      const rotateX = Math.max(-maxRotation / 2, Math.min(maxRotation / 2, deltaY / 50));
      
      // Apply the transformation
      character.style.transform = `perspective(1000px) rotateY(${rotateY}deg) rotateX(${rotateX}deg)`;
      
      // Make the character's eyes follow the mouse - find eyes elements
      const leftEye = character.querySelector('.left-eye');
      const rightEye = character.querySelector('.right-eye');
      
      if (leftEye && rightEye) {
        // Limit eye movement
        const maxEyeMove = 3;
        const eyeX = Math.max(-maxEyeMove, Math.min(maxEyeMove, deltaX / 100));
        const eyeY = Math.max(-maxEyeMove, Math.min(maxEyeMove, deltaY / 100));
        
        // Apply eye movement
        (leftEye as HTMLElement).style.transform = `translate(${eyeX}px, ${eyeY}px)`;
        (rightEye as HTMLElement).style.transform = `translate(${eyeX}px, ${eyeY}px)`;
      }
      
      // Make the character react to mouse proximity - add a slight "leaning in" effect
      const proximity = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      const proximityScale = Math.max(0.95, Math.min(1.05, 1 - proximity / 2000));
      character.style.setProperty('--proximity-scale', proximityScale.toString());
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);
  
  // Animation variants
  const characterVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.5,
        delay: 0.2
      }
    }
  };
  
  const floatingVariants = {
    animate: {
      y: [0, -10, 0],
      transition: {
        duration: 3,
        repeat: Infinity,
        repeatType: "reverse" as const
      }
    }
  };
  
  const headphonesVariants = {
    animate: {
      rotate: [-1, 1, -1],
      transition: {
        duration: 4,
        repeat: Infinity,
        repeatType: "reverse" as const
      }
    }
  };
  
  const screenGlowVariants = {
    animate: {
      opacity: [0.4, 0.8, 0.4],
      transition: {
        duration: 2,
        repeat: Infinity,
        repeatType: "reverse" as const
      }
    }
  };
  
  return (
    <motion.div 
      ref={characterRef}
      className={`relative w-64 h-64 ${className}`}
      initial="initial"
      animate="animate"
      variants={characterVariants}
      style={{
        transformStyle: 'preserve-3d',
        transform: 'perspective(1000px)',
        transformOrigin: 'center center',
        willChange: 'transform'
      }}
    >
      <motion.div
        variants={floatingVariants}
        animate="animate"
        className="w-full h-full"
      >
        {/* Main SVG Character */}
        <svg
          viewBox="0 0 240 240"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          {/* Boy's body */}
          <g className="gamer-boy" style={{ transformOrigin: 'center center', transform: 'scale(var(--proximity-scale, 1))' }}>
            {/* Body */}
            <path
              d="M120 140c-30 0-50-25-50-55s20-55 50-55 50 25 50 55-20 55-50 55z"
              fill="#FFD8B9"
              className="body"
            />
            
            {/* Hoodie */}
            <path
              d="M160 100c0 22.1-17.9 50-40 50s-40-27.9-40-50c0-5.5 0-10 0-15 0-22.1 17.9-40 40-40s40 17.9 40 40c0 5 0 9.5 0 15z"
              fill="#6A4CFF"
              className="hoodie"
            />
            
            {/* Neck */}
            <path
              d="M110 110v15c0 5.5 4.5 10 10 10s10-4.5 10-10v-15h-20z"
              fill="#FFCCAA"
              className="neck"
            />
            
            {/* Face */}
            <circle
              cx="120"
              cy="85"
              r="30"
              fill="#FFCCAA"
              className="face"
            />
            
            {/* Eyes */}
            <g className="eyes">
              <circle
                cx="110"
                cy="80"
                r="5"
                fill="white"
                className="eye-back"
              />
              <circle
                cx="130"
                cy="80"
                r="5"
                fill="white"
                className="eye-back"
              />
              <circle
                cx="110"
                cy="80"
                r="2.5"
                fill="#333"
                className="left-eye"
              />
              <circle
                cx="130"
                cy="80"
                r="2.5"
                fill="#333"
                className="right-eye"
              />
            </g>
            
            {/* Mouth */}
            <path
              d="M115 95c5 5 10 5 15 0"
              stroke="#333"
              strokeWidth="2"
              fill="none"
              className="mouth"
            />
            
            {/* Hair */}
            <path
              d="M90 70c-5-15 5-30 30-30 25 0 35 15 30 30 0-10 5-20 15-20-5 0-5-10-15-10 5-5 0-15-10-15 0 5-10 5-15 0-10 5-15 10-10 15-10 0-10 10-15 10 10 0 15 10 15 20-5 0-10 0-15-5-5 5-10 5-10 5z"
              fill="#333"
              className="hair"
            />
            
            {/* Headphones - separate group for animation */}
            <motion.g 
              className="headphones"
              variants={headphonesVariants}
              animate="animate"
              style={{ transformOrigin: 'center top' }}
            >
              <path
                d="M85 75c-10 0-15 10-15 15v10c0 5 5 10 10 10s10-5 10-10V90c0-5-2-15-5-15z"
                fill="#333"
                className="left-ear"
              />
              <path
                d="M155 75c10 0 15 10 15 15v10c0 5-5 10-10 10s-10-5-10-10V90c0-5 2-15 5-15z"
                fill="#333"
                className="right-ear"
              />
              <path
                d="M85 70c0 0 5-35 35-35 30 0 35 35 35 35"
                stroke="#333"
                strokeWidth="5"
                fill="none"
                className="band"
              />
            </motion.g>
            
            {/* Arms and Mobile Device */}
            <g className="device-group">
              {/* Left Arm */}
              <path
                d="M90 120c-10 10-15 30-10 40 5 10 15 10 20 0 5-10 10-20 10-30 0-5-5-10-10-10h-10z"
                fill="#6A4CFF"
                className="left-arm"
              />
              
              {/* Right Arm */}
              <path
                d="M150 120c10 10 15 30 10 40-5 10-15 10-20 0-5-10-10-20-10-30 0-5 5-10 10-10h10z"
                fill="#6A4CFF"
                className="right-arm"
              />
              
              {/* Hands */}
              <circle cx="95" cy="160" r="8" fill="#FFCCAA" className="left-hand" />
              <circle cx="145" cy="160" r="8" fill="#FFCCAA" className="right-hand" />
              
              {/* Mobile Device */}
              <rect
                x="100"
                y="150"
                width="40"
                height="70"
                rx="5"
                ry="5"
                fill="#333"
                className="phone"
              />
              
              {/* Screen */}
              <rect
                x="105"
                y="155"
                width="30"
                height="60"
                rx="2"
                ry="2"
                fill="#222"
                className="screen"
              />
              
              {/* Screen Content - Website Mockup */}
              <motion.g
                variants={screenGlowVariants}
                animate="animate"
                className="screen-content"
              >
                {/* Screen Glow */}
                <rect
                  x="105"
                  y="155"
                  width="30"
                  height="60"
                  rx="2"
                  ry="2"
                  fill="#5A3FFF"
                  opacity="0.4"
                  className="screen-glow"
                />
                
                {/* Nav Bar */}
                <rect
                  x="107"
                  y="158"
                  width="26"
                  height="6"
                  rx="1"
                  ry="1"
                  fill="#6A4CFF"
                  className="nav-bar"
                />
                
                {/* Content Blocks */}
                <rect
                  x="107"
                  y="166"
                  width="26"
                  height="10"
                  rx="1"
                  ry="1"
                  fill="#B026FF"
                  opacity="0.7"
                  className="content-block"
                />
                
                <rect
                  x="107"
                  y="178"
                  width="12"
                  height="12"
                  rx="1"
                  ry="1"
                  fill="#2E96FF"
                  opacity="0.7"
                  className="content-block"
                />
                
                <rect
                  x="121"
                  y="178"
                  width="12"
                  height="12"
                  rx="1"
                  ry="1"
                  fill="#2E96FF"
                  opacity="0.7"
                  className="content-block"
                />
                
                <rect
                  x="107"
                  y="192"
                  width="26"
                  height="6"
                  rx="1"
                  ry="1"
                  fill="#FFFFFF"
                  opacity="0.5"
                  className="content-block"
                />
                
                <rect
                  x="107"
                  y="200"
                  width="26"
                  height="6"
                  rx="1"
                  ry="1"
                  fill="#FFFFFF"
                  opacity="0.5"
                  className="content-block"
                />
              </motion.g>
            </g>
          </g>
        </svg>
        
        {/* Purple Glow beneath character */}
        <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 w-40 h-10 bg-[#6A4CFF] opacity-20 blur-xl rounded-full"></div>
      </motion.div>
    </motion.div>
  );
}