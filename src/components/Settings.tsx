
import React, { useState } from "react";
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

const Settings: React.FC = () => {
  const { divisor, setDivisor, musicUrl, setMusicUrl } = useTimer();
  const [localDivisor, setLocalDivisor] = useState<number>(divisor);
  const [localMusicUrl, setLocalMusicUrl] = useState<string>(musicUrl);
  const [open, setOpen] = useState(false);

  const handleSave = () => {
    if (localDivisor < 1) {
      toast({
        title: "Invalid divisor",
        description: "Divisor must be 1 or greater",
        variant: "destructive",
      });
      return;
    }

    setDivisor(localDivisor);
    setMusicUrl(localMusicUrl);
    toast({
      title: "Settings saved",
      description: "Your changes have been applied",
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="rounded-full p-2 btn-hover bg-white/10 backdrop-blur-sm text-white"
        >
          <SettingsIcon className="w-5 h-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="neutral-gradient text-white animate-fade-in backdrop-blur-lg border-0 max-w-md">
        <DialogHeader className="mb-4">
          <DialogTitle className="text-2xl font-bold">Settings</DialogTitle>
          <DialogDescription className="text-white/80">
            Customize your focus timer experience
          </DialogDescription>
        </DialogHeader>
        
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
                className="bg-white/20 border-0 text-white placeholder-white/60 focus-visible:ring-white"
              />
            </div>
            <p className="text-sm text-white/70">
              Your break time will be your work time divided by this number
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
              className="bg-white/20 border-0 text-white placeholder-white/60 focus-visible:ring-white"
            />
            <p className="text-sm text-white/70">
              Paste a Spotify or YouTube URL to play music during your sessions
            </p>
          </div>

          <Button 
            onClick={handleSave} 
            className="w-full bg-white/20 hover:bg-white/30 text-white border-0 btn-hover"
          >
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default Settings;
