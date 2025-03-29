
import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import { toast } from "@/components/ui/use-toast";

type TimerMode = "work" | "break" | "idle";
type SoundType = "work" | "break" | "refresh";

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
  playSound: (type: SoundType) => void;
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

  const workSoundRef = useRef<HTMLAudioElement | null>(null);
  const breakSoundRef = useRef<HTMLAudioElement | null>(null);
  const refreshSoundRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    workSoundRef.current = new Audio("https://whyp.it/tracks/269053/work");
    breakSoundRef.current = new Audio("https://whyp.it/tracks/269054/break");
    refreshSoundRef.current = new Audio("https://whyp.it/tracks/269055/refresh");
    
    return () => {
      workSoundRef.current = null;
      breakSoundRef.current = null;
      refreshSoundRef.current = null;
    };
  }, []);

  const playSound = (type: SoundType) => {
    try {
      if (type === "work" && workSoundRef.current) {
        workSoundRef.current.currentTime = 0;
        workSoundRef.current.play();
      } else if (type === "break" && breakSoundRef.current) {
        breakSoundRef.current.currentTime = 0;
        breakSoundRef.current.play();
      } else if (type === "refresh" && refreshSoundRef.current) {
        refreshSoundRef.current.currentTime = 0;
        refreshSoundRef.current.play();
      }
    } catch (error) {
      console.error("Error playing sound:", error);
    }
  };

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

  // Custom toast function with auto-dismiss
  const showToast = (title: string, description: string) => {
    toast({
      title,
      description,
      className: "popup-blur text-gray-800 border-0 cursor-pointer",
      duration: 3000, // Auto dismiss after 3 seconds
    });
  };

  const startTimer = () => {
    if (currentTask.trim() === "" && mode === "idle") {
      showToast(
        "Please enter a task",
        "Enter what you're focusing on before starting the timer."
      );
      return;
    }
    
    setIsRunning(true);
    if (mode === "idle") {
      setMode("work");
      playSound("work");
    } else if (mode === "break") {
      playSound("break");
    }
  };

  const pauseTimer = () => {
    setIsRunning(false);
    if (mode === "break") {
      playSound("break");
    }
  };

  const resetTimer = () => {
    setIsRunning(false);
    setSeconds(0);
    setMode("idle");
    setBreakTime(0);
    playSound("refresh");
  };

  const switchToBreak = () => {
    if (currentTask.trim() === "") {
      showToast(
        "Please enter a task",
        "Enter what you're focusing on before starting a break."
      );
      return;
    }
    
    const calculatedBreakTime = Math.floor(totalWorkTime / divisor);
    setBreakTime(calculatedBreakTime);
    setSeconds(0);
    setMode("break");
    playSound("break");
    
    showToast(
      "Break Time!",
      `Take a ${Math.floor(calculatedBreakTime / 60)} minute break.`
    );
  };

  const switchToWork = () => {
    if (currentTask.trim() === "") {
      showToast(
        "Please enter a task",
        "Enter what you're focusing on before starting work."
      );
      return;
    }
    
    setSeconds(0);
    setMode("work");
    setTotalWorkTime(0);
    setBreakTime(0);
    playSound("work");

    showToast(
      "Back to Work!",
      "Work session started. Focus on your task."
    );
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
        playSound,
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
