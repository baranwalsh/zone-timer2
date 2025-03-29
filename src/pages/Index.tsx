
import React from "react";
import { TimerProvider } from "@/contexts/TimerContext";
import { useTimer } from "@/contexts/TimerContext";
import Timer from "@/components/Timer";
import Settings from "@/components/Settings";
import InfoDialog from "@/components/InfoDialog";
import MusicPlayer from "@/components/MusicPlayer";
import DateTime from "@/components/DateTime";
import { cn } from "@/lib/utils";

// Flocus logo component
const Logo: React.FC = () => (
  <div className="text-white text-4xl font-bold tracking-tight">
    fl<span className="text-white/80">o</span>cus
  </div>
);

// Inner content that uses the timer context
const TimerApp: React.FC = () => {
  const { mode } = useTimer();

  return (
    <div 
      className={cn(
        "timer-container transition-all duration-1000 flex flex-col animate-fade-in",
        mode === "work" 
          ? "work-gradient animated-gradient" 
          : mode === "break" 
            ? "break-gradient animated-gradient" 
            : "neutral-gradient animated-gradient"
      )}
    >
      <header className="w-full p-6 flex justify-between items-center">
        <Logo />
        <DateTime />
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-6">
        <Timer />
      </main>

      <footer className="p-6 flex justify-between items-center">
        <InfoDialog />
        <div className="flex space-x-2">
          <MusicPlayer />
          <Settings />
        </div>
      </footer>
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
