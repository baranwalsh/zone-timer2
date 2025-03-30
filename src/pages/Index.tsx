
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
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Zone logo component with dropdown
const Logo: React.FC = () => {
  const { playSound } = useTimer();
  
  return (
    <DropdownMenu>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>
              <a 
                className="cursor-pointer transition-opacity hover:opacity-80 flex"
                onClick={() => playSound("refresh")}
              >
                <img src="/lovable-uploads/1e67c2cf-62b8-4e21-a652-aaec2976cbaf.png" alt="Zone" className="h-12" />
              </a>
            </DropdownMenuTrigger>
          </TooltipTrigger>
          <TooltipContent className="custom-tooltip">
            <p className="text-sm">Need kanban within kanbans?</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      
      <DropdownMenuContent 
        className="bg-white/20 backdrop-blur-lg text-white border-white/20 animate-fade-in min-w-48"
        align="start"
        sideOffset={10}
      >
        <DropdownMenuItem 
          className="hover:bg-white/20 cursor-pointer"
          onClick={() => window.open("https://modul.so/shagun", "_blank")}
        >
          More by Shagun
        </DropdownMenuItem>
        <DropdownMenuItem 
          className="hover:bg-white/20 cursor-pointer"
          onClick={() => window.open("https://zone-flow.vercel.app", "_blank")}
        >
          Work Timer
        </DropdownMenuItem>
        <DropdownMenuItem 
          className="hover:bg-white/20 cursor-pointer"
          onClick={() => window.open("https://latticelace.netlify.app", "_blank")}
        >
          Latticelace
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

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
            'https://wallpaperaccess.com/full/345256.jpg',
            'https://wallpaperaccess.com/full/345168.jpg',
            'https://wallpaperaccess.com/full/30119.png',
            'https://wallpaperaccess.com/full/345367.jpg',
            'https://img.freepik.com/free-photo/japan-background-digital-art_23-2151546139.jpg',
            'https://img.freepik.com/free-photo/cityscape-anime-inspired-urban-area_23-2151028678.jpg',
            'https://wallpaperaccess.com/full/345388.jpg',
            'https://whyp.it/tracks/269053/work',
            'https://whyp.it/tracks/269054/break',
            'https://whyp.it/tracks/269055/refresh'
          ];
          
          // Preload images
          const preloadImages = urls
            .filter(url => url.includes('.jpg') || url.includes('.png'))
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
          ? "work-gradient" 
          : mode === "break" 
            ? "break-gradient" 
            : "neutral-gradient"
      )}
    >
      {/* Navbar shadow gradient */}
      <div className="navbar-shadow"></div>
      
      <header className="w-full p-6 navbar-blur flex justify-between items-center z-20 relative">
        <Logo />
        <DateTime />
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-6 cascade-fade-in">
        <Timer />
      </main>

      <footer className="p-6 flex justify-between items-center z-20 relative">
        <div className="flex space-x-2">
          <InfoDialog />
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
          <ThemeSelector />
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
