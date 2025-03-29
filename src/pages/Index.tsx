
import React, { useEffect, useRef } from "react";
import { TimerProvider } from "@/contexts/TimerContext";
import { useTimer } from "@/contexts/TimerContext";
import Timer from "@/components/Timer";
import Settings from "@/components/Settings";
import InfoDialog from "@/components/InfoDialog";
import MusicPlayer from "@/components/MusicPlayer";
import DateTime from "@/components/DateTime";
import FullscreenButton from "@/components/FullscreenButton";
import ThemeSelector from "@/components/ThemeSelector";
import BreakProgressBar from "@/components/BreakProgressBar";
import { cn } from "@/lib/utils";

// Zone logo component
const Logo: React.FC = () => (
  <div className="text-white text-4xl font-bold tracking-tight">
    <img src="/lovable-uploads/1e67c2cf-62b8-4e21-a652-aaec2976cbaf.png" alt="Zone" className="h-12" />
  </div>
);

// Inner content that uses the timer context
const TimerApp: React.FC = () => {
  const { mode, playSound } = useTimer();
  const appRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Play refresh sound on page load
    playSound("refresh");
    
    // Add navbar animation class after initial load
    const navbar = document.querySelector("header");
    if (navbar) {
      navbar.classList.add("navbar-slide-in");
    }
  }, [playSound]);

  return (
    <div 
      ref={appRef}
      className={cn(
        "timer-container transition-all duration-1000 flex flex-col animate-fade-in",
        mode === "work" 
          ? "work-gradient animated-gradient" 
          : mode === "break" 
            ? "break-gradient animated-gradient" 
            : "neutral-gradient animated-gradient"
      )}
    >
      <header className="w-full p-6 navbar-blur flex justify-between items-center z-10">
        <Logo />
        <DateTime />
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-6 cascade-fade-in">
        <Timer />
      </main>

      <footer className="p-6 flex justify-between items-center">
        <div className="flex space-x-2">
          <InfoDialog />
          <ThemeSelector />
        </div>
        <div className="flex space-x-2">
          <MusicPlayer />
          <Settings />
          <FullscreenButton />
        </div>
      </footer>
      
      <BreakProgressBar />
    </div>
  );
};

// Main index page with provider wrapper
const Index: React.FC = () => {
  return (
    <TimerProvider>
      <TimerApp />
    </TimerProvider>
  );
};

export default Index;
