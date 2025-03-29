
import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Diamond, X, ArrowRight } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useTimer } from "@/contexts/TimerContext";

type Theme = {
  id: number;
  url: string;
  title: string;
  previewImg: string;
};

const themes: Theme[] = [
  {
    id: 1,
    url: "https://drive.google.com/file/d/1ASBFSvPnvcFwbxPwdjyYoNqeRHVXFtk_/preview",
    title: "Ocean Waves",
    previewImg: "https://i.ibb.co/TM70RnnZ/image.png"
  },
  {
    id: 2,
    url: "https://drive.google.com/file/d/1e2zAwdj6mg24GIoAcW_4ibF_cxp7s2nr/preview",
    title: "Northern Lights",
    previewImg: "https://i.ibb.co/5yh9rYG/image-2025-03-29-144539849.png"
  },
  {
    id: 3,
    url: "https://drive.google.com/file/d/1NPpUb5_2D4P6SDjkN5EgNkWS1Pb8pnrz/preview",
    title: "Forest Stream",
    previewImg: "https://i.ibb.co/27B4zDkW/image.png"
  },
];

const ThemeSelector: React.FC = () => {
  const [showPreviews, setShowPreviews] = useState(false);
  const [activeTheme, setActiveTheme] = useState<Theme | null>(null);
  const { playSound } = useTimer();
  const previewsRef = useRef<HTMLDivElement | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Auto hide previews when mouse leaves area
    const handleMouseMovement = (e: MouseEvent) => {
      if (!showPreviews || activeTheme) return;
      
      const isOverButton = (e.target as HTMLElement)?.closest('.theme-button');
      const isOverPreview = (e.target as HTMLElement)?.closest('.theme-previews');
      
      if (!isOverButton && !isOverPreview) {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => {
          setShowPreviews(false);
        }, 1000);
      } else {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
      }
    };
    
    document.addEventListener('mousemove', handleMouseMovement);
    return () => {
      document.removeEventListener('mousemove', handleMouseMovement);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [showPreviews, activeTheme]);

  const handleThemeToggle = () => {
    setShowPreviews(!showPreviews);
    playSound("refresh");
  };

  const handleThemeSelect = (theme: Theme) => {
    setActiveTheme(theme);
    setShowPreviews(false);
    playSound("refresh");
  };

  const handleThemeClose = () => {
    setActiveTheme(null);
    playSound("refresh");
  };

  return (
    <div className="relative">
      {activeTheme ? (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full p-2 btn-hover bg-white/10 backdrop-blur-sm text-white z-20 relative theme-button"
                onClick={handleThemeClose}
              >
                <X className="w-5 h-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent className="custom-tooltip">
              <p className="text-sm">Remove Theme</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ) : (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full p-2 btn-hover bg-white/10 backdrop-blur-sm text-white theme-button"
                onClick={handleThemeToggle}
              >
                <Diamond className="w-5 h-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent className="custom-tooltip">
              <p className="text-sm">Theme Selector</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}

      {showPreviews && !activeTheme && (
        <div 
          ref={previewsRef}
          className="theme-previews absolute right-2 bottom-12 flex flex-col-reverse gap-2"
        >
          {themes.map((theme, index) => (
            <div 
              key={theme.id}
              className="theme-preview cursor-pointer relative group"
              style={{
                opacity: [0.25, 0.5, 0.8][index],
                transform: `translateY(${index * -10}px)`,
                zIndex: 10 - index,
                height: "90px",
                width: "160px",
                transition: "opacity 0.3s ease-in-out"
              }}
            >
              <img 
                src={theme.previewImg} 
                alt={theme.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300">
                <Button
                  className="bg-white/30 hover:bg-white/50 text-white rounded-full p-2 flex items-center space-x-1"
                  onClick={() => handleThemeSelect(theme)}
                >
                  <span>Apply</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTheme && (
        <div className="fixed inset-0 pointer-events-none z-0">
          <iframe 
            src={activeTheme.url} 
            className="w-full h-full" 
            allow="autoplay" 
            title={activeTheme.title}
          ></iframe>
        </div>
      )}
    </div>
  );
};

export default ThemeSelector;
