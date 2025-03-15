/**
 * Calculate rotation based on mouse position
 * @param e MouseEvent
 * @param maxRotation Maximum rotation in degrees
 * @returns Rotation values for X and Y axes
 */
export function calculateMouseRotation(e: MouseEvent, maxRotation: number = 10) {
  const { clientX, clientY } = e;
  const { innerWidth, innerHeight } = window;
  
  // Calculate mouse position as percentages from the center (-1 to 1)
  const x = (clientX / innerWidth - 0.5) * 2;
  const y = (clientY / innerHeight - 0.5) * 2;
  
  // Calculate rotation based on the mouse position
  const rotateY = -x * maxRotation; // Inverted for natural feeling
  const rotateX = y * maxRotation;
  
  return { rotateX, rotateY };
}

/**
 * Apply 3D effect to an element based on mouse movement
 * @param element Target element
 * @param maxRotation Maximum rotation
 */
export function apply3DEffect(element: HTMLElement, maxRotation: number = 10) {
  const handleMouseMove = (e: MouseEvent) => {
    const { rotateX, rotateY } = calculateMouseRotation(e, maxRotation);
    element.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  };
  
  window.addEventListener('mousemove', handleMouseMove);
  
  // Return cleanup function
  return () => {
    window.removeEventListener('mousemove', handleMouseMove);
  };
}

/**
 * Create a floating animation
 * @param element Element to animate
 * @param intensity Animation intensity (0-1)
 */
export function createFloatingEffect(element: HTMLElement, intensity: number = 0.5) {
  // Base values
  const floatAmount = 15 * intensity; // px to float
  const rotateAmount = 2 * intensity; // degrees to rotate
  
  // Generate random starting points
  const randomPhase = Math.random() * Math.PI * 2;
  const randomPhase2 = Math.random() * Math.PI * 2;
  
  // Duration between 4-6 seconds, affected by intensity
  const duration = (4 + Math.random() * 2) / intensity;
  
  // Set initial position
  element.style.transition = `transform ${duration}s ease-in-out`;
  
  // Start the animation
  let startTime = Date.now();
  
  const animate = () => {
    const now = Date.now();
    const elapsed = (now - startTime) / 1000;
    
    // Calculate float and rotation values using sin waves
    const floatY = Math.sin(elapsed + randomPhase) * floatAmount;
    const rotateZ = Math.sin(elapsed * 0.8 + randomPhase2) * rotateAmount;
    
    // Apply transformation
    element.style.transform = `translate3d(0, ${floatY}px, 0) rotateZ(${rotateZ}deg)`;
    
    // Continue animation
    requestAnimationFrame(animate);
  };
  
  // Start animation
  animate();
  
  // Return a function to stop the animation if needed
  return () => {
    element.style.transition = '';
    element.style.transform = '';
  };
}