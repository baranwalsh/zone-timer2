
import React, { useState, useEffect } from "react";
import { format } from "date-fns";

const DateTime: React.FC = () => {
  const [currentDateTime, setCurrentDateTime] = useState<Date>(new Date());
  
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);
    
    return () => {
      clearInterval(timer);
    };
  }, []);
  
  return (
    <div className="flex flex-col items-start">
      <span className="text-white/90 text-2xl font-light animate-fade-in">
        {format(currentDateTime, "h:mm a")}
      </span>
      <span className="text-white/70 text-sm animate-fade-in">
        {format(currentDateTime, "EEEE, MMMM d")}
      </span>
    </div>
  );
};

export default DateTime;
