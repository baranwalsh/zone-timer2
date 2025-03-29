
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Diamond, X } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useTimer } from "@/contexts/TimerContext";

type Theme = {
  id: number;
  url: string;
  title: string;
};

const themes: Theme[] = [
  {
    id: 1,
    url: "https://drive.google.com/file/d/1ASBFSvPnvcFwbxPwdjyYoNqeRHVXFtk_/preview",
    title: "Ocean Waves",
  },
  {
    id: 2,
    url: "https://drive.google.com/file/d/1e2zAwdj6mg24GIoAcW_4ibF_cxp7s2nr/preview",
    title: "Northern Lights",
  },
  {
    id: 3,
    url: "https://drive.google.com/file/d/1NPpUb5_2D4P6SDjkN5EgNkWS1Pb8pnrz/preview",
    title: "Forest Stream",
  },
];

const ThemeSelector: React.FC = () => {
  const [showPreviews, setShowPreviews] = useState(false);
  const [activeTheme, setActiveTheme] = useState<Theme | null>(null);
  const { playSound } = useTimer();

  const handleThemeToggle = () => {
    setShowPreviews(!showPreviews);
    playSound("refresh");
  };

  const handleThemeSelect = (theme: Theme) => {
    setActiveTheme(theme);
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
                className="rounded-full p-2 btn-hover bg-white/10 backdrop-blur-sm text-white z-20 relative"
                onClick={handleThemeClose}
              >
                <X className="w-5 h-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
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
                className="rounded-full p-2 btn-hover bg-white/10 backdrop-blur-sm text-white"
                onClick={handleThemeToggle}
              >
                <Diamond className="w-5 h-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-sm">Theme Selector</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}

      {showPreviews && !activeTheme && (
        <div className="theme-previews absolute right-0 bottom-12 flex flex-col-reverse gap-2">
          {themes.map((theme, index) => (
            <div 
              key={theme.id}
              className="theme-preview cursor-pointer"
              style={{
                opacity: [0.25, 0.5, 0.8][index],
                transform: `translateY(${index * -10}px)`,
                zIndex: 10 - index,
                height: "90px",
                width: "160px"
              }}
              onClick={() => handleThemeSelect(theme)}
            >
              <iframe 
                src={theme.url} 
                width="100%" 
                height="100%" 
                allow="autoplay" 
                title={theme.title}
              ></iframe>
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
