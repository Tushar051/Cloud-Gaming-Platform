import { useEffect, useRef } from "react";
import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import TeamSection from "@/components/TeamSection";
import EnterArenaCTA from "@/components/EnterArenaCTA";
import { setupScrollAnimations } from "@/utils/animations";

interface HomeProps {
  onEnterArena: () => void;
}

export default function Home({ onEnterArena }: HomeProps) {
  // Ref for scroll animation tracking
  const pageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Setup scroll animations when component mounts
    const cleanup = setupScrollAnimations(pageRef.current);

    // Add event listener to prevent spacebar from scrolling the page
    const handleSpacebar = (e: KeyboardEvent) => {
      if (e.key === " ") {
        e.preventDefault(); // Prevent default spacebar behavior (scrolling)
      }
    };

    window.addEventListener("keydown", handleSpacebar);

    // Cleanup event listeners when component unmounts
    return () => {
      cleanup();
      window.removeEventListener("keydown", handleSpacebar);
    };
  }, []);

  return (
    <div ref={pageRef} className="overflow-hidden">
      <HeroSection />
      <FeaturesSection />
      <TeamSection />
      <EnterArenaCTA onEnterClick={onEnterArena} />
    </div>
  );
}