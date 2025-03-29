
import React, { useEffect, useState } from "react";
import { useTimer } from "@/contexts/TimerContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlayCircle, PauseCircle, SkipForward, RefreshCw, Edit } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const Timer: React.FC = () => {
  const {
    seconds,
    isRunning,
    mode,
    currentTask,
    setCurrentTask,
    totalWorkTime,
    breakTime,
    startTimer,
    pauseTimer,
    resetTimer,
    switchToBreak,
    switchToWork,
  } = useTimer();

  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [taskInput, setTaskInput] = useState<string>(currentTask);
  const [prevSeconds, setPrevSeconds] = useState<number>(seconds);

  useEffect(() => {
    // Handle auto break completion
    if (mode === "break" && isRunning && breakTime > 0 && seconds >= breakTime) {
      pauseTimer();
      toast({
        title: "Break complete!",
        description: "Your break time is over. Ready to start working again?",
      });
    }
    
    // Update previous seconds for animation
    setPrevSeconds(seconds);
  }, [seconds, mode, isRunning, breakTime, pauseTimer]);

  // Format time as MM:SS
  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  const handleSaveTask = () => {
    setCurrentTask(taskInput);
    setIsEditing(false);
  };

  // Prevent users from switching to break if they haven't worked enough
  const handleSwitchToBreak = () => {
    if (totalWorkTime < 60) {
      toast({
        title: "Work a bit longer",
        description: "You should work for at least 1 minute before taking a break.",
        variant: "destructive",
      });
      return;
    }
    switchToBreak();
  };

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-xl mx-auto animate-fade-in">
      {/* Task input/display area */}
      <div className="w-full mb-8 mt-4">
        {isEditing ? (
          <div className="flex items-center space-x-2 animate-slide-in">
            <Input
              value={taskInput}
              onChange={(e) => setTaskInput(e.target.value)}
              placeholder="What are you focusing on?"
              className="text-2xl md:text-3xl font-medium text-white bg-white/10 border-0 p-4 backdrop-blur-sm placeholder-white/70"
              autoFocus
            />
            <Button
              onClick={handleSaveTask}
              className="bg-white/20 hover:bg-white/30 text-white border-0 p-4 h-12 btn-hover"
            >
              Save
            </Button>
          </div>
        ) : (
          <div 
            className="group flex items-center justify-center cursor-pointer p-4 rounded-lg hover:bg-white/5 transition-all duration-300"
            onClick={() => setIsEditing(true)}
          >
            <h2 className="text-3xl md:text-4xl font-medium text-white text-center">
              {currentTask || "What do you want to focus on?"}
            </h2>
            <Edit className="w-5 h-5 ml-2 text-white/0 group-hover:text-white/70 transition-all duration-300" />
          </div>
        )}
      </div>

      {/* Mode indicator */}
      <div className="flex justify-center space-x-3 mb-8">
        <Button
          variant={mode === "work" ? "default" : "outline"}
          className={cn(
            "py-6 px-8 rounded-full text-lg font-medium transition-all duration-300",
            mode === "work" 
              ? "bg-red-500/80 text-white shadow-lg scale-110 border-0" 
              : "bg-white/10 text-white hover:bg-white/20 border-0 hover:border-0"
          )}
          onClick={switchToWork}
          disabled={mode === "work"}
        >
          Work
        </Button>
        <Button
          variant={mode === "break" ? "default" : "outline"}
          className={cn(
            "py-6 px-8 rounded-full text-lg font-medium transition-all duration-300",
            mode === "break" 
              ? "bg-blue-500/80 text-white shadow-lg scale-110 border-0" 
              : "bg-white/10 text-white hover:bg-white/20 border-0 hover:border-0"
          )}
          onClick={handleSwitchToBreak}
          disabled={mode === "break"}
        >
          Break
        </Button>
      </div>

      {/* Timer display */}
      <div className="w-full text-center mb-10">
        <div className="text-9xl font-bold tracking-tighter text-white">
          {mode === "work" 
            ? formatTime(seconds) 
            : mode === "break" 
              ? formatTime(breakTime > 0 ? Math.max(0, breakTime - seconds) : 0)
              : "00:00"
          }
        </div>
        
        {mode === "work" && (
          <div className="text-white/80 mt-2 text-lg">
            Total work time: {formatTime(totalWorkTime)}
          </div>
        )}
      </div>

      {/* Control buttons */}
      <div className="flex space-x-4 justify-center">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              {isRunning ? (
                <Button
                  onClick={pauseTimer}
                  className="bg-white/20 hover:bg-white/30 text-white rounded-full w-16 h-16 btn-hover"
                >
                  <PauseCircle className="w-10 h-10" />
                </Button>
              ) : (
                <Button
                  onClick={startTimer}
                  className="bg-white/20 hover:bg-white/30 text-white rounded-full w-16 h-16 btn-hover"
                >
                  <PlayCircle className="w-10 h-10" />
                </Button>
              )}
            </TooltipTrigger>
            <TooltipContent>
              {isRunning ? "Pause Timer" : "Start Timer"}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {mode === "work" && seconds > 0 && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={handleSwitchToBreak}
                  className="bg-white/20 hover:bg-white/30 text-white rounded-full w-16 h-16 btn-hover"
                >
                  <SkipForward className="w-8 h-8" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                Take a Break
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={resetTimer}
                className="bg-white/20 hover:bg-white/30 text-white rounded-full w-16 h-16 btn-hover"
              >
                <RefreshCw className="w-8 h-8" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              Reset Timer
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};

export default Timer;
