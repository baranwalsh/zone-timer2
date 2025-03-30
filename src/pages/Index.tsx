
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
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

// Zone logo component
const Logo: React.FC = () => (
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger asChild>
        <a 
          href="https://zone-flow.vercel.app" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="cursor-pointer transition-opacity hover:opacity-80 flex"
        >
          <img src="/lovable-uploads/1e67c2cf-62b8-4e21-a652-aaec2976cbaf.png" alt="Zone" className="h-12" />
        </a>
      </TooltipTrigger>
      <TooltipContent className="custom-tooltip">
        <p className="text-sm">Need kanban within kanbans?</p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
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
    
    // Cache media files
    const cacheMedia = async () => {
      try {
        if ('caches' in window) {
          const cache = await caches.open('zone-media');
          const urls = [
            'https://i.ibb.co/DfRFXYGY/09-orange-smooth-gradients-blur.png',
            'https://i.ibb.co/yczhwzGX/29-diffuse-light-blue.jpg',
            'https://i.ibb.co/zTvYrVtc/01-colorful-smooth-gradient.jpg',
            'https://whyp.it/tracks/269053/work',
            'https://whyp.it/tracks/269054/break',
            'https://whyp.it/tracks/269055/refresh',
            'https://i.ibb.co/TM70RnnZ/image.png',
            'https://i.ibb.co/5yh9rYG/image-2025-03-29-144539849.png',
            'https://i.ibb.co/27B4zDkW/image.png'
          ];
          
          // Preload images
          const preloadImages = urls
            .filter(url => url.includes('.png') || url.includes('.jpg'))
            .map(url => {
              return new Promise((resolve, reject) => {
                const img = new Image();
                img.src = url;
                img.onload = resolve;
                img.onerror = reject;
              });
            });
            
          await Promise.all([...preloadImages, ...urls.map(url => cache.add(new Request(url)))]);
          console.log('Media cached and preloaded successfully');
        }
      } catch (error) {
        console.error('Failed to cache media:', error);
      }
    };
    
    cacheMedia();
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
      {/* Navbar shadow gradient */}
      <div className="navbar-shadow"></div>
      
      <header className="w-full p-6 navbar-blur flex justify-between items-center z-10 relative">
        <Logo />
        <DateTime />
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-6 cascade-fade-in">
        <Timer />
      </main>

      <footer className="p-6 flex justify-between items-center z-10 relative">
        <div className="flex space-x-2">
          <InfoDialog />
          <ThemeSelector />
          <a 
            href="https://modul.so/shagun" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-white/70 hover:text-white text-sm ml-4 self-center transition-colors duration-300"
          >
            By Shagun Baranwal
          </a>
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
