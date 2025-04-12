
import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Diamond, X, ChevronUp, ChevronDown, ArrowRight } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useTimer } from "@/contexts/TimerContext";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

type Theme = {
  id: number;
  url: string;
};

const themes: Theme[] = [
  {
    id: 1,
    url: "https://wallpaperaccess.com/full/345256.jpg",
  },
  {
    id: 2,
    url: "https://wallpaperaccess.com/full/345168.jpg",
  },
  {
    id: 3,
    url: "https://wallpaperaccess.com/full/30119.png",
  },
  {
    id: 4,
    url: "https://wallpaperaccess.com/full/345367.jpg",
  },
  {
    id: 5,
    url: "https://img.freepik.com/free-photo/japan-background-digital-art_23-2151546139.jpg",
  },
  {
    id: 6,
    url: "https://img.freepik.com/free-photo/cityscape-anime-inspired-urban-area_23-2151028678.jpg",
  },
  {
    id: 7,
    url: "https://wallpaperaccess.com/full/345388.jpg",
  }
];

const ThemeSelector: React.FC = () => {
  const [showPicker, setShowPicker] = useState(false);
  const [activeTheme, setActiveTheme] = useState<Theme | null>(null);
  const [hoverTheme, setHoverTheme] = useState<number | null>(null);
  const { playSound } = useTimer();
  const isDragging = useRef(false);
  const touchStartY = useRef(0);
  const carouselRef = useRef<HTMLDivElement>(null);

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

  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    isDragging.current = true;
    if (e.type === 'touchstart') {
      const touchEvent = e as React.TouchEvent;
      touchStartY.current = touchEvent.touches[0].clientY;
    }
  };

  const handleDragEnd = () => {
    // Reset after a short delay to allow click events to work
    setTimeout(() => {
      isDragging.current = false;
    }, 100);
  };

  const handleMouseEnter = (id: number) => {
    setHoverTheme(id);
  };

  const handleMouseLeave = () => {
    setHoverTheme(null);
  };

  // Handle wheel events for scrolling
  const handleWheel = (e: React.WheelEvent) => {
    if (!carouselRef.current) return;
    
    e.preventDefault();
    const scrollAmount = e.deltaY * 0.5;
    carouselRef.current.scrollTop += scrollAmount;
  };

  // Handle touch move for mobile scrolling
  const handleTouchMove = (e: React.TouchEvent) => {
    if (!carouselRef.current) return;
    
    const currentY = e.touches[0].clientY;
    const diff = touchStartY.current - currentY;
    touchStartY.current = currentY;
    
    carouselRef.current.scrollTop += diff;
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
            
            <div 
              ref={carouselRef}
              className="h-80 overflow-y-auto"
              onWheel={handleWheel}
              onTouchStart={handleDragStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleDragEnd}
              onMouseDown={handleDragStart}
              onMouseMove={(e) => {
                if (isDragging.current && carouselRef.current) {
                  e.preventDefault();
                  carouselRef.current.scrollTop -= e.movementY;
                }
              }}
              onMouseUp={handleDragEnd}
              onMouseLeave={handleDragEnd}
            >
              <div className="space-y-3 pr-2">
                {themes.map((theme) => (
                  <div
                    key={theme.id}
                    className={cn(
                      "relative rounded-md overflow-hidden transition-all duration-200",
                      hoverTheme === theme.id ? "opacity-97" : "opacity-100"
                    )}
                    onMouseEnter={() => handleMouseEnter(theme.id)}
                    onMouseLeave={handleMouseLeave}
                  >
                    <img 
                      src={theme.url} 
                      alt=""
                      className="w-full h-32 object-cover"
                    />
                    
                    {hoverTheme === theme.id && (
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-black/50 flex items-center justify-center"
                      >
                        <Button
                          variant="ghost"
                          onClick={() => handleThemeSelect(theme)}
                          className="bg-white/10 hover:bg-white/20 text-white gap-2 rounded-full"
                        >
                          Apply <ArrowRight className="h-4 w-4" />
                        </Button>
                      </motion.div>
                    )}
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex justify-center mt-2 space-x-1">
              <Button 
                size="icon"
                variant="outline"
                className="h-8 w-8 rounded-full bg-white/10 border-white/20 text-white hover:bg-white/20"
                onClick={() => {
                  if (carouselRef.current) {
                    carouselRef.current.scrollTop -= 100;
                  }
                }}
              >
                <ChevronUp className="h-4 w-4" />
              </Button>
              <Button 
                size="icon"
                variant="outline"
                className="h-8 w-8 rounded-full bg-white/10 border-white/20 text-white hover:bg-white/20"
                onClick={() => {
                  if (carouselRef.current) {
                    carouselRef.current.scrollTop += 100;
                  }
                }}
              >
                <ChevronDown className="h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {activeTheme && (
        <div className="fixed inset-0 pointer-events-none z-[-1] bg-theme-fade">
          <img 
            src={activeTheme.url} 
            alt=""
            className="w-full h-full object-cover transition-opacity duration-500" 
          />
          <div className="absolute inset-0 bg-black/10 pointer-events-none"></div>
        </div>
      )}
    </div>
  );
};

export default ThemeSelector;
