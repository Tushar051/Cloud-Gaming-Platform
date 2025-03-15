import { animate } from 'framer-motion';

/**
 * Setup scroll animations for elements
 * @param container Container element to observe for animations
 * @returns Cleanup function
 */
export function setupScrollAnimations(container: HTMLElement | null): () => void {
  if (!container) return () => {};
  
  // Elements to animate on scroll
  const elementsToAnimate = container.querySelectorAll('.feature-card, .team-card');
  
  // Create intersection observer
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Add animation class when element is visible
          entry.target.classList.add('animate-fade-in');
          // Unobserve after animation is applied
          observer.unobserve(entry.target);
        }
      });
    },
    {
      root: null,
      rootMargin: '-100px',
      threshold: 0.1,
    }
  );
  
  // Observe all elements
  elementsToAnimate.forEach((element) => {
    observer.observe(element);
  });
  
  // Cleanup function
  return () => {
    elementsToAnimate.forEach((element) => {
      observer.unobserve(element);
    });
  };
}

/**
 * Create a fullscreen portal animation effect
 * @param onComplete Callback when animation completes
 */
export function animatePortalTransition(onComplete: () => void): void {
  // Create portal overlay
  const overlay = document.createElement('div');
  overlay.className = 'fixed inset-0 z-50 flex items-center justify-center';
  overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
  overlay.style.opacity = '0';
  
  // Create portal circle
  const circle = document.createElement('div');
  circle.className = 'rounded-full';
  circle.style.background = 'linear-gradient(45deg, hsl(var(--primary)), hsl(var(--chart-2)), hsl(var(--accent)))';
  circle.style.boxShadow = '0 0 100px 20px currentColor';
  circle.style.width = '0px';
  circle.style.height = '0px';
  
  overlay.appendChild(circle);
  document.body.appendChild(overlay);
  
  // Animate overlay fade in
  animate(
    overlay,
    { opacity: 1 },
    { duration: 0.3 }
  );
  
  // Animate circle growth
  animate(
    circle,
    { width: '100px', height: '100px' },
    { duration: 0.4 }
  ).then(() => {
    // Expand the portal
    animate(
      circle,
      { width: '200vw', height: '200vw' },
      { duration: 0.8, ease: [0.68, -0.6, 0.32, 1.6] }
    ).then(() => {
      // Execute callback
      onComplete();
      
      // Fade out overlay
      setTimeout(() => {
        animate(
          overlay,
          { opacity: 0 },
          { duration: 0.3 }
        ).then(() => {
          // Remove from DOM
          document.body.removeChild(overlay);
        });
      }, 300);
    });
  });
}
