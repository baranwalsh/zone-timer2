
import React from "react";
import { useTimer } from "@/contexts/TimerContext";

const BreakProgressBar: React.FC = () => {
  const { mode, seconds, breakTime } = useTimer();

  if (mode !== "break" || breakTime <= 0) {
    return null;
  }

  const progress = Math.min(100, (seconds / breakTime) * 100);

  return (
    <div className="break-progress-bar" style={{ width: `${progress}%` }}></div>
  );
};

export default BreakProgressBar;
