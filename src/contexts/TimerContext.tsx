
import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  useCallback,
} from "react";

type TimerContextType = {
  time: number;
  seconds: number;
  mode: "work" | "break" | "idle";
  isRunning: boolean;
  divisor: number;
  musicUrl: string;
  backgroundDarkness: number;
  currentTask: string;
  setCurrentTask: React.Dispatch<React.SetStateAction<string>>;
  totalWorkTime: number;
  breakTime: number;
  setBackgroundDarkness: React.Dispatch<React.SetStateAction<number>>;
  startTimer: () => void;
  pauseTimer: () => void;
  resetTimer: () => void;
  switchToWork: () => void;
  switchToBreak: () => void;
  setTime: React.Dispatch<React.SetStateAction<number>>;
  setMode: React.Dispatch<React.SetStateAction<"work" | "break" | "idle">>;
  setDivisor: React.Dispatch<React.SetStateAction<number>>;
  setMusicUrl: React.Dispatch<React.SetStateAction<string>>;
  playSound: (sound: "work" | "break" | "refresh") => void;
  taskName: string;
  setTaskName: React.Dispatch<React.SetStateAction<string>>;
  taskHistory: string[];
  addTaskToHistory: (task: string) => void;
};

const TimerContext = createContext<TimerContextType | undefined>(undefined);

export const TimerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [time, setTime] = useState<number>(25 * 60);
  const [mode, setMode] = useState<"work" | "break" | "idle">("idle");
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [divisor, setDivisor] = useState<number>(5);
  const [musicUrl, setMusicUrl] = useState<string>("");
  const [backgroundDarkness, setBackgroundDarkness] = useState<number>(10);
  const [taskName, setTaskName] = useState<string>("");
  const [taskHistory, setTaskHistory] = useState<string[]>([]);
  const [currentTask, setCurrentTask] = useState<string>("");
  const [totalWorkTime, setTotalWorkTime] = useState<number>(0);
  const [breakTime, setBreakTime] = useState<number>(0);

  // Define playSound function before using it in the useEffect
  const playSound = useCallback((sound: "work" | "break" | "refresh") => {
    const audio = new Audio(`https://whyp.it/tracks/26905${sound === 'work' ? 3 : sound === 'break' ? 4 : 5}/${sound}`);
    audio.play().catch(error => console.error("Playback failed:", error));
  }, []);

  // Track total work time
  useEffect(() => {
    let workTimer: NodeJS.Timeout;
    if (isRunning && mode === "work") {
      workTimer = setInterval(() => {
        setTotalWorkTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(workTimer);
  }, [isRunning, mode]);

  // Calculate break time based on work time and divisor
  useEffect(() => {
    if (mode === "break") {
      setBreakTime(Math.floor(totalWorkTime / divisor));
    }
  }, [mode, totalWorkTime, divisor]);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (isRunning && mode !== "idle") {
      intervalId = setInterval(() => {
        setTime((prevTime) => {
          if (prevTime <= 0) {
            clearInterval(intervalId);
            if (mode === "work") {
              setMode("break");
              setTime(25 * 60 / divisor);
              playSound("break");
            } else if (mode === "break") {
              setMode("work");
              setTime(25 * 60);
              playSound("work");
            }
            setIsRunning(false);
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }

    return () => clearInterval(intervalId);
  }, [isRunning, mode, divisor, playSound]);

  // Apply background darkness on initial load and when it changes
  useEffect(() => {
    document.documentElement.style.setProperty('--background-darkness', `${backgroundDarkness}`);
  }, [backgroundDarkness]);

  const addTaskToHistory = (task: string) => {
    if (task.trim() !== "") {
      setTaskHistory(prev => [task, ...prev]);
      setTaskName("");
    }
  };

  const startTimer = () => {
    setIsRunning(true);
    if (mode === "idle") {
      setMode("work");
    }
  };

  const pauseTimer = () => {
    setIsRunning(false);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setMode("idle");
    setTime(25 * 60);
    setTotalWorkTime(0);
    setBreakTime(0);
  };

  const switchToWork = () => {
    setMode("work");
    setTime(25 * 60);
  };

  const switchToBreak = () => {
    setMode("break");
    setTime(25 * 60 / divisor);
  };

  // Calculate seconds for display
  const seconds = time;

  return (
    <TimerContext.Provider 
      value={{ 
        time,
        seconds,
        mode, 
        isRunning, 
        divisor, 
        musicUrl,
        backgroundDarkness,
        currentTask,
        setCurrentTask,
        totalWorkTime,
        breakTime,
        setBackgroundDarkness,
        startTimer, 
        pauseTimer, 
        resetTimer,
        switchToWork,
        switchToBreak,
        setTime, 
        setMode, 
        setDivisor, 
        setMusicUrl,
        playSound,
        taskName,
        setTaskName,
        taskHistory,
        addTaskToHistory
      }}
    >
      {children}
    </TimerContext.Provider>
  );
};

export const useTimer = () => {
  const context = useContext(TimerContext);
  if (!context) {
    throw new Error("useTimer must be used within a TimerProvider");
  }
  return context;
};
