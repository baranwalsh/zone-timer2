
import React, { useEffect, useState } from "react";
import { useTimer } from "@/contexts/TimerContext";
import { Button } from "@/components/ui/button";
import { Music, X } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const MusicPlayer: React.FC = () => {
  const { musicUrl } = useTimer();
  const [isOpen, setIsOpen] = useState(false);
  const [embedUrl, setEmbedUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!musicUrl) {
      setEmbedUrl(null);
      return;
    }

    // Convert various URLs to embed URLs
    if (musicUrl.includes("spotify.com")) {
      // Convert Spotify URL to embed
      const spotifyId = musicUrl.split("/").pop()?.split("?")[0];
      const embedSpotify = `https://open.spotify.com/embed/playlist/${spotifyId}`;
      setEmbedUrl(embedSpotify);
    } else if (musicUrl.includes("youtube.com") || musicUrl.includes("youtu.be")) {
      // Convert YouTube URL to embed
      let videoId = "";
      
      if (musicUrl.includes("youtu.be")) {
        videoId = musicUrl.split("/").pop() || "";
      } else if (musicUrl.includes("watch?v=")) {
        videoId = new URL(musicUrl).searchParams.get("v") || "";
      } else if (musicUrl.includes("playlist?list=")) {
        const listId = new URL(musicUrl).searchParams.get("list") || "";
        setEmbedUrl(`https://www.youtube.com/embed/videoseries?list=${listId}`);
        return;
      }
      
      if (videoId) {
        setEmbedUrl(`https://www.youtube.com/embed/${videoId}`);
      }
    } else {
      setEmbedUrl(null);
    }
  }, [musicUrl]);

  if (!musicUrl) {
    return null;
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="rounded-full p-2 btn-hover bg-white/10 backdrop-blur-sm text-white"
        >
          <Music className="w-5 h-5" />
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className="neutral-gradient backdrop-blur-lg border-0 p-0 w-80 md:w-96 shadow-xl animate-fade-in"
        align="end"
      >
        <div className="p-2 flex items-center justify-between border-b border-white/10">
          <h3 className="text-white font-medium">Music Player</h3>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 text-white/70 hover:text-white"
            onClick={() => setIsOpen(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="h-80">
          {embedUrl ? (
            <iframe 
              src={embedUrl} 
              width="100%" 
              height="100%" 
              frameBorder="0" 
              allow="autoplay; encrypted-media; fullscreen; picture-in-picture" 
              title="Music Player"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-white/70">
              Invalid music URL format
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default MusicPlayer;
