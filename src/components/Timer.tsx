
import React, { useEffect, useState, KeyboardEvent } from "react";
import { useTimer } from "@/contexts/TimerContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlayCircle, PauseCircle, SkipForward, RefreshCw, Edit } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import TaskCompletion from "@/components/TaskCompletion";

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
  const [lastTimeString, setLastTimeString] = useState<string>("");
  const [currentTimeString, setCurrentTimeString] = useState<string>("");

  useEffect(() => {
    // Handle auto break completion
    if (mode === "break" && isRunning && breakTime > 0 && seconds >= breakTime) {
      pauseTimer();
      resetTimer(); // Reset to idle mode when break is complete
      toast({
        title: "Break complete!",
        description: "Your break time is over. Ready to start working again?",
        className: "popup-blur text-gray-800 border-0",
        duration: 1000, // Auto dismiss after 1 second
      });
    }
    
    // Update time strings for animation
    const timeString = formatTime(
      mode === "work" 
        ? seconds
        : mode === "break" 
          ? (breakTime > 0 ? Math.max(0, breakTime - seconds) : 0)
          : 0
    );
    
    if (timeString !== currentTimeString) {
      setLastTimeString(currentTimeString);
      setCurrentTimeString(timeString);
    }
    
    // Update previous seconds for animation
    setPrevSeconds(seconds);
    
    // Add global keyboard shortcuts
    const handleKeyDown = (e: KeyboardEvent<Document>) => {
      if (!isEditing) {
        if (e.key === 's' || e.key === 'S') {
          isRunning ? pauseTimer() : startTimer();
        } else if (e.key === 'r' || e.key === 'R') {
          resetTimer();
        } else if (e.key === 't' || e.key === 'T') {
          if (mode === 'work' && currentTask.trim()) {
            if (totalWorkTime >= 60) {
              switchToBreak();
            } else {
              toast({
                title: "Work a bit longer",
                description: "You should work for at least 1 minute before taking a break.",
                className: "popup-blur text-gray-800 border-0",
                duration: 1000,
              });
            }
          } else if (mode === 'break') {
            switchToWork();
          }
        }
      }
    };
    
    document.addEventListener('keydown', handleKeyDown as any);
    return () => document.removeEventListener('keydown', handleKeyDown as any);
  }, [seconds, mode, isRunning, breakTime, pauseTimer, isEditing, startTimer, resetTimer, switchToBreak, switchToWork, totalWorkTime, currentTask, currentTimeString]);

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
  
  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSaveTask();
    }
  };

  // Prevent users from switching to break if they haven't worked enough
  const handleSwitchToBreak = () => {
    if (totalWorkTime < 60) {
      toast({
        title: "Work a bit longer",
        description: "You should work for at least 1 minute before taking a break.",
        className: "popup-blur text-gray-800 border-0",
        duration: 1000,
      });
      return;
    }
    switchToBreak();
  };

  // Render each digit with fade animation
  const renderDigit = (digit: string, index: number) => {
    const digitClass = (prevSeconds !== seconds && index >= 3) ? "digit-fade-in" : "";
    
    return (
      <span 
        key={`${index}-${digit}`} 
        className={`inline-block ${digitClass}`}
        style={{ width: index === 2 ? '0.5em' : '0.6em' }}
      >
        {digit}
      </span>
    );
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
              onKeyDown={handleInputKeyDown}
              placeholder="What are you focusing on?"
              className="text-2xl md:text-3xl font-medium text-white bg-white/10 border-0 p-4 backdrop-blur-sm placeholder-white/70 rounded-2xl focus:outline-none focus:border-0 focus:ring-0"
              autoFocus
            />
            <Button
              onClick={handleSaveTask}
              className="bg-white/20 hover:bg-white/10 text-white timer-btn-hover p-4 h-12 rounded-2xl"
            >
              Save
            </Button>
          </div>
        ) : (
          <div 
            className="group flex items-center justify-center cursor-pointer p-4 rounded-2xl hover:bg-white/5 transition-all duration-300"
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
            "py-6 px-8 rounded-full text-lg font-medium transition-all duration-300 timer-btn-hover",
            mode === "work" 
              ? "bg-white/20 text-white shadow-lg scale-110 border-0" 
              : "bg-white/10 text-white hover:bg-white/10 border-0 hover:border-0 hover:text-white"
          )}
          onClick={switchToWork}
          disabled={mode === "work" || !currentTask.trim()}
        >
          Work
        </Button>
        <Button
          variant={mode === "break" ? "default" : "outline"}
          className={cn(
            "py-6 px-8 rounded-full text-lg font-medium transition-all duration-300 timer-btn-hover",
            mode === "break" 
              ? "bg-white/20 text-white shadow-lg scale-110 border-0" 
              : "bg-white/10 text-white hover:bg-white/10 border-0 hover:border-0 hover:text-white"
          )}
          onClick={handleSwitchToBreak}
          disabled={mode === "break" || !currentTask.trim()}
        >
          Break
        </Button>
      </div>

      {/* Timer display */}
      <div className="w-full text-center mb-10">
        <div className="text-9xl font-bold tracking-tighter text-white">
          {currentTimeString.split('').map((digit, i) => renderDigit(digit, i))}
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
                  className="bg-white/20 hover:bg-white/10 text-white timer-btn-hover rounded-full w-16 h-16"
                >
                  <PauseCircle className="w-10 h-10" />
                </Button>
              ) : (
                <Button
                  onClick={startTimer}
                  className="bg-white/20 hover:bg-white/10 text-white timer-btn-hover rounded-full w-16 h-16"
                >
                  <PlayCircle className="w-10 h-10" />
                </Button>
              )}
            </TooltipTrigger>
            <TooltipContent className="custom-tooltip">
              {isRunning ? "Pause Timer (S)" : "Start Timer (S)"}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {mode === "work" && seconds > 0 && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={handleSwitchToBreak}
                  className="bg-white/20 hover:bg-white/10 text-white timer-btn-hover rounded-full w-16 h-16"
                >
                  <SkipForward className="w-8 h-8" />
                </Button>
              </TooltipTrigger>
              <TooltipContent className="custom-tooltip">
                Take a Break (T)
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={resetTimer}
                className="bg-white/20 hover:bg-white/10 text-white timer-btn-hover rounded-full w-16 h-16"
              >
                <RefreshCw className="w-8 h-8" />
              </Button>
            </TooltipTrigger>
            <TooltipContent className="custom-tooltip">
              Reset Timer (R)
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TaskCompletion />
      </div>
    </div>
  );
};

export default Timer;
