import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  useCallback,
} from "react";

type TimerContextType = {
  time: number;
  mode: "work" | "break" | "idle";
  isRunning: boolean;
  divisor: number;
  musicUrl: string;
  backgroundDarkness: number;
  setBackgroundDarkness: React.Dispatch<React.SetStateAction<number>>;
  startTimer: () => void;
  pauseTimer: () => void;
  resetTimer: () => void;
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

  const playSound = useCallback((sound: "work" | "break" | "refresh") => {
    const audio = new Audio(`https://whyp.it/tracks/26905${sound === 'work' ? 3 : sound === 'break' ? 4 : 5}/${sound}`);
    audio.play().catch(error => console.error("Playback failed:", error));
  }, []);

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
  };

  return (
    <TimerContext.Provider 
      value={{ 
        time, 
        mode, 
        isRunning, 
        divisor, 
        musicUrl,
        backgroundDarkness,
        setBackgroundDarkness,
        startTimer, 
        pauseTimer, 
        resetTimer, 
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
