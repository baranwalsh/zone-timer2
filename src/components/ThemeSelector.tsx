
import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Diamond, X, ChevronUp, ChevronDown } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useTimer } from "@/contexts/TimerContext";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

type Theme = {
  id: number;
  url: string;
  title: string;
};

const themes: Theme[] = [
  {
    id: 1,
    url: "https://wallpaperaccess.com/full/345256.jpg",
    title: "Mountain Sunset"
  },
  {
    id: 2,
    url: "https://wallpaperaccess.com/full/345168.jpg",
    title: "Aurora Borealis"
  },
  {
    id: 3,
    url: "https://wallpaperaccess.com/full/30119.png",
    title: "Purple Fantasy"
  },
  {
    id: 4,
    url: "https://wallpaperaccess.com/full/345367.jpg",
    title: "Snow Mountain"
  },
  {
    id: 5,
    url: "https://img.freepik.com/free-photo/japan-background-digital-art_23-2151546139.jpg",
    title: "Digital Japan"
  },
  {
    id: 6,
    url: "https://img.freepik.com/free-photo/cityscape-anime-inspired-urban-area_23-2151028678.jpg",
    title: "Anime Cityscape"
  },
  {
    id: 7,
    url: "https://wallpaperaccess.com/full/345388.jpg",
    title: "Nature Forest"
  }
];

const ThemeSelector: React.FC = () => {
  const [showPicker, setShowPicker] = useState(false);
  const [activeTheme, setActiveTheme] = useState<Theme | null>(null);
  const { playSound } = useTimer();
  const isDragging = useRef(false);

  const handleThemeToggle = () => {
    setShowPicker(prev => !prev);
    playSound("refresh");
  };

  const handleThemeSelect = (theme: Theme) => {
    if (isDragging.current) {
      isDragging.current = false;
      return;
    }
    setActiveTheme(theme);
    setShowPicker(false);
    playSound("refresh");
  };

  const handleThemeClose = () => {
    setActiveTheme(null);
    playSound("refresh");
  };

  const handleDragStart = () => {
    isDragging.current = true;
  };

  const handleDragEnd = () => {
    // Reset after a short delay to allow click events to work
    setTimeout(() => {
      isDragging.current = false;
    }, 100);
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
                className="rounded-full p-2 btn-hover bg-white/10 backdrop-blur-sm text-white z-20 relative"
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
                className="rounded-full p-2 btn-hover bg-white/10 backdrop-blur-sm text-white relative z-30"
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

      <AnimatePresence>
        {showPicker && !activeTheme && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-12 right-0 z-20 w-64 rounded-xl overflow-hidden backdrop-blur-md bg-black/30 border border-white/20 p-3"
          >
            <div className="text-white text-sm font-medium mb-2 flex justify-between items-center">
              <span>Select Theme</span>
              <Button
                variant="ghost"
                size="icon"
                className="w-6 h-6 p-0 hover:bg-white/10 text-white"
                onClick={() => setShowPicker(false)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            
            <Carousel
              opts={{
                align: "start",
                loop: true,
                dragFree: true,
              }}
              orientation="vertical"
              className="h-80"
            >
              <CarouselContent className="-mt-1 h-full">
                {themes.map((theme) => (
                  <CarouselItem key={theme.id} className="pt-1 basis-1/3 md:basis-1/3">
                    <div
                      className="aspect-video relative overflow-hidden rounded-md cursor-pointer hover:ring-2 hover:ring-white/50 transition-all duration-200 h-full"
                      onClick={() => handleThemeSelect(theme)}
                      onMouseDown={handleDragStart}
                      onMouseUp={handleDragEnd}
                      onTouchStart={handleDragStart}
                      onTouchEnd={handleDragEnd}
                    >
                      <img 
                        src={theme.url} 
                        alt={theme.title} 
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-2">
                        <span className="text-white text-xs font-medium">{theme.title}</span>
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <div className="flex justify-center mt-2 space-x-1">
                <Button 
                  size="icon"
                  variant="outline"
                  className="h-8 w-8 rounded-full bg-white/10 border-white/20 text-white hover:bg-white/20"
                  onClick={() => document.querySelector<HTMLButtonElement>('[data-carousel-button="prev"]')?.click()}
                >
                  <ChevronUp className="h-4 w-4" />
                </Button>
                <Button 
                  size="icon"
                  variant="outline"
                  className="h-8 w-8 rounded-full bg-white/10 border-white/20 text-white hover:bg-white/20"
                  onClick={() => document.querySelector<HTMLButtonElement>('[data-carousel-button="next"]')?.click()}
                >
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </div>
              <CarouselPrevious className="left-1/2 -translate-x-[calc(50%+16px)] -top-1 bg-white/10 text-white hover:bg-white/20 border-white/20" data-carousel-button="prev" />
              <CarouselNext className="left-1/2 -translate-x-[calc(50%-16px)] -bottom-1 bg-white/10 text-white hover:bg-white/20 border-white/20" data-carousel-button="next" />
            </Carousel>
          </motion.div>
        )}
      </AnimatePresence>

      {activeTheme && (
        <div className="fixed inset-0 pointer-events-none z-0 bg-theme-fade transition-opacity duration-1000">
          <img 
            src={activeTheme.url} 
            alt={activeTheme.title}
            className="w-full h-full object-cover" 
          />
          <div className="absolute inset-0 bg-black/10 pointer-events-none"></div>
        </div>
      )}
    </div>
  );
};

export default ThemeSelector;
