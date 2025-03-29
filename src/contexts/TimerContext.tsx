
import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "@/components/ui/use-toast";

type TimerMode = "work" | "break" | "idle";

interface TimerContextType {
  seconds: number;
  isRunning: boolean;
  mode: TimerMode;
  divisor: number;
  currentTask: string;
  totalWorkTime: number;
  breakTime: number;
  musicUrl: string;
  setMusicUrl: (url: string) => void;
  setDivisor: (divisor: number) => void;
  setCurrentTask: (task: string) => void;
  startTimer: () => void;
  pauseTimer: () => void;
  resetTimer: () => void;
  switchToBreak: () => void;
  switchToWork: () => void;
}

const TimerContext = createContext<TimerContextType | undefined>(undefined);

export const TimerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [seconds, setSeconds] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [mode, setMode] = useState<TimerMode>("idle");
  const [divisor, setDivisor] = useState<number>(5);
  const [currentTask, setCurrentTask] = useState<string>("");
  const [totalWorkTime, setTotalWorkTime] = useState<number>(0);
  const [breakTime, setBreakTime] = useState<number>(0);
  const [musicUrl, setMusicUrl] = useState<string>("");

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isRunning) {
      interval = setInterval(() => {
        setSeconds((prevSeconds) => prevSeconds + 1);
        
        if (mode === "work") {
          setTotalWorkTime((prevTotal) => prevTotal + 1);
        }
      }, 1000);
    } else if (interval) {
      clearInterval(interval);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, mode]);

  const startTimer = () => {
    if (currentTask.trim() === "" && mode === "idle") {
      toast({
        title: "Please enter a task",
        description: "Enter what you're focusing on before starting the timer.",
        variant: "destructive",
      });
      return;
    }
    
    setIsRunning(true);
    if (mode === "idle") setMode("work");
  };

  const pauseTimer = () => {
    setIsRunning(false);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setSeconds(0);
    setMode("idle");
    setBreakTime(0);
  };

  const switchToBreak = () => {
    const calculatedBreakTime = Math.floor(totalWorkTime / divisor);
    setBreakTime(calculatedBreakTime);
    setSeconds(0);
    setMode("break");
    
    toast({
      title: "Break Time!",
      description: `Take a ${Math.floor(calculatedBreakTime / 60)} minute break.`,
    });
  };

  const switchToWork = () => {
    setSeconds(0);
    setMode("work");
    setTotalWorkTime(0);
    setBreakTime(0);

    toast({
      title: "Back to Work!",
      description: "Work session started. Focus on your task.",
    });
  };

  return (
    <TimerContext.Provider
      value={{
        seconds,
        isRunning,
        mode,
        divisor,
        currentTask,
        totalWorkTime,
        breakTime,
        musicUrl,
        setMusicUrl,
        setDivisor,
        setCurrentTask,
        startTimer,
        pauseTimer,
        resetTimer,
        switchToBreak,
        switchToWork,
      }}
    >
      {children}
    </TimerContext.Provider>
  );
};

export const useTimer = () => {
  const context = useContext(TimerContext);
  if (context === undefined) {
    throw new Error("useTimer must be used within a TimerProvider");
  }
  return context;
};
