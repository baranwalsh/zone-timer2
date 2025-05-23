
import React, { useState, useEffect } from "react";
import { useTimer } from "@/contexts/TimerContext";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Settings as SettingsIcon } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Slider } from "@/components/ui/slider";
import MoodistEmbed from "./MoodistEmbed";

const Settings: React.FC = () => {
  const { divisor, setDivisor, musicUrl, setMusicUrl, playSound, backgroundDarkness, setBackgroundDarkness } = useTimer();
  const [localDivisor, setLocalDivisor] = useState<number>(divisor);
  const [localMusicUrl, setLocalMusicUrl] = useState<string>(musicUrl);
  const [localBackgroundDarkness, setLocalBackgroundDarkness] = useState<number>(backgroundDarkness);
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"settings" | "moodist">("settings");

  useEffect(() => {
    // Apply background darkness to CSS variable
    document.documentElement.style.setProperty('--background-darkness', `${localBackgroundDarkness}`);
  }, [localBackgroundDarkness]);

  const handleSave = () => {
    if (localDivisor < 1) {
      toast({
        title: "Invalid divisor",
        description: "Divisor must be 1 or greater",
        className: "popup-blur text-gray-800 border-0",
        duration: 3000, // Auto dismiss after 3 seconds
      });
      return;
    }

    setDivisor(localDivisor);
    setMusicUrl(localMusicUrl);
    setBackgroundDarkness(localBackgroundDarkness);
    
    toast({
      title: "Settings saved",
      description: "Your changes have been applied",
      className: "popup-blur text-gray-800 border-0",
      duration: 3000, // Auto dismiss after 3 seconds
    });
    setOpen(false);
  };

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
                <SettingsIcon className="w-5 h-5" />
              </Button>
            </DialogTrigger>
          </TooltipTrigger>
          <TooltipContent className="custom-tooltip">
            <p className="text-sm">Settings</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      
      <DialogContent className="neutral-gradient text-white animate-fade-in backdrop-blur-lg border-0 max-w-2xl dialog-morphing">
        <DialogHeader className="mb-4">
          <DialogTitle className="text-2xl font-bold">Settings</DialogTitle>
          <DialogDescription className="text-white/80">
            Customize your focus timer experience
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex mb-4 space-x-2">
          <Button 
            variant={activeTab === "settings" ? "default" : "outline"}
            className={`
              rounded-xl py-2 px-4 transition-all ${activeTab === "settings" 
                ? "bg-white/20 text-white hover:bg-white/30 border-0" 
                : "bg-transparent text-white hover:bg-white/10 border border-white/20 hover:text-white"}
            `}
            onClick={() => setActiveTab("settings")}
          >
            Settings
          </Button>
          <Button 
            variant={activeTab === "moodist" ? "default" : "outline"}
            className={`
              rounded-xl py-2 px-4 transition-all ${activeTab === "moodist" 
                ? "bg-white/20 text-white hover:bg-white/30 border-0" 
                : "bg-transparent text-white hover:bg-white/10 border border-white/20 hover:text-white"}
            `}
            onClick={() => setActiveTab("moodist")}
          >
            Moodist
          </Button>
        </div>
        
        <div className="cascade-fade-in">
          {activeTab === "settings" ? (
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="divisor" className="text-white text-sm font-medium">
                  Work/Break Divisor
                </Label>
                <div className="flex items-center">
                  <Input
                    id="divisor"
                    type="number"
                    min="1"
                    value={localDivisor}
                    onChange={(e) => setLocalDivisor(parseInt(e.target.value) || 1)}
                    className="bg-white/20 border-0 text-white placeholder-white/60 focus-visible:ring-0 rounded-xl"
                  />
                </div>
                <p className="text-sm text-white/70">
                  Your break time will be your work time divided by this number
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="background-darkness" className="text-white text-sm font-medium">
                  Background Darkness: {localBackgroundDarkness}%
                </Label>
                <Slider
                  id="background-darkness"
                  value={[localBackgroundDarkness]}
                  min={0}
                  max={50}
                  step={1}
                  onValueChange={(value) => setLocalBackgroundDarkness(value[0])}
                  className="bg-white/20 rounded-full"
                />
                <p className="text-sm text-white/70">
                  Adjust how dark the background appears
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="music" className="text-white text-sm font-medium">
                  Music URL (YouTube or Spotify)
                </Label>
                <Input
                  id="music"
                  type="text"
                  placeholder="https://open.spotify.com/playlist/..."
                  value={localMusicUrl}
                  onChange={(e) => setLocalMusicUrl(e.target.value)}
                  className="bg-white/20 border-0 text-white placeholder-white/60 focus-visible:ring-0 rounded-xl"
                />
                <p className="text-sm text-white/70">
                  Paste a Spotify or YouTube URL to play music during your sessions
                </p>
              </div>

              <Button 
                onClick={handleSave} 
                className="w-full bg-white/20 text-white border-0 rounded-xl hover:bg-white/30 transition-all"
              >
                Save Changes
              </Button>
            </div>
          ) : (
            <MoodistEmbed height="400px" />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default Settings;
