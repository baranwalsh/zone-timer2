
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useTimer } from "@/contexts/TimerContext";

const InfoDialog: React.FC = () => {
  const [open, setOpen] = useState(false);
  const { playSound } = useTimer();

  const handleDialogOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (newOpen) {
      playSound("refresh");
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleDialogOpenChange}>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <DialogTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="rounded-full p-2 btn-hover bg-white/10 backdrop-blur-sm text-white"
              >
                <Info className="w-5 h-5" />
              </Button>
            </DialogTrigger>
          </TooltipTrigger>
          <TooltipContent className="custom-tooltip">
            <p className="text-sm">How It Works</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      
      <DialogContent className="neutral-gradient text-white animate-fade-in backdrop-blur-lg border-0 max-w-3xl max-h-[80vh] overflow-auto dialog-morphing">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">How It Works</DialogTitle>
          <DialogDescription className="text-white/80">
            Smart break calculation for better productivity
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 mt-4 cascade-fade-in">
          <div>
            <h3 className="text-lg font-medium mb-2">The Main Concept</h3>
            <p className="text-white/80">
              This app calculates your break time based on how long you've been working. The break duration is your work time divided by the divisor (default: 5).
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-2">How to Use</h3>
            <ol className="space-y-2 text-white/80 list-decimal pl-5">
              <li>Enter what you're working on in the input field</li>
              <li>Press play to start the timer</li>
              <li>Pause the timer when your concentration drops below 50%</li>
              <li>Click the forward button to switch to break mode</li>
              <li>The app will automatically calculate your break time</li>
              <li>When your break is over, you'll be notified</li>
            </ol>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-2">Break Mode Ideas</h3>
            <ul className="space-y-1 text-white/80 list-disc pl-5">
              <li>Take a short walk</li>
              <li>Do some quick stretches</li>
              <li>Grab a healthy snack or drink water</li>
              <li>Practice deep breathing or meditation</li>
              <li>Rest your eyes by looking at something 20 feet away</li>
              <li>Tidy up your work space</li>
            </ul>
          </div>
          
          <div className="pt-2">
            <p className="text-white/90 italic">
              "Time will pass regardless. Might as well lock in."
            </p>
          </div>
          
          <div className="pt-4 border-t border-white/20 mt-4">
            <p className="text-white/70 text-right">
              Made by <a href="https://modul.so/shagun" target="_blank" rel="noopener noreferrer" className="hover:text-white underline">Shagun Baranwal</a>.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InfoDialog;
