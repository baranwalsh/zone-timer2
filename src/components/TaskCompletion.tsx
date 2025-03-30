
import React, { useState, useRef, useEffect } from "react";
import { Check, MoreHorizontal, History, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTimer } from "@/contexts/TimerContext";
import { toast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { AnimatePresence, motion } from "framer-motion";

interface CompletedTask {
  id: string;
  task: string;
  timestamp: Date;
}

const TaskCompletion: React.FC = () => {
  const { currentTask, setCurrentTask } = useTimer();
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [completedTasks, setCompletedTasks] = useState<CompletedTask[]>([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Clear timeout on unmount
  useEffect(() => {
    return () => {
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
      }
    };
  }, []);

  const handleComplete = () => {
    if (!currentTask.trim()) {
      toast({
        title: "No active task",
        description: "Add a task to complete first",
        className: "popup-blur text-gray-800 border-0",
        duration: 3000,
      });
      return;
    }

    const newCompletedTask: CompletedTask = {
      id: Date.now().toString(),
      task: currentTask,
      timestamp: new Date(),
    };

    setCompletedTasks((prev) => [newCompletedTask, ...prev]);
    
    toast({
      title: "Task completed",
      description: `"${currentTask}" has been completed`,
      className: "popup-blur text-gray-800 border-0",
      duration: 3000,
    });
    
    setCurrentTask("");
  };

  const handleMouseEnter = () => {
    // Clear any existing timeout to hide the menu
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }
    setIsMenuVisible(true);
  };

  const handleMouseLeave = () => {
    // Set a timeout to hide the menu after 1 second
    hideTimeoutRef.current = setTimeout(() => {
      setIsMenuVisible(false);
    }, 1000);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  return (
    <div 
      className="relative flex items-center space-x-2"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Button
        onClick={handleComplete}
        className="bg-white/20 hover:bg-white/10 hover:border hover:border-white/50 text-white timer-btn-hover rounded-full w-12 h-12"
      >
        <Check className="w-6 h-6" />
      </Button>

      <AnimatePresence>
        {isMenuVisible && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute left-16"
          >
            <Dialog open={isHistoryOpen} onOpenChange={setIsHistoryOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="ghost"
                  className="bg-white/20 hover:bg-white/10 hover:border hover:border-white/50 text-white timer-btn-hover rounded-full w-12 h-12"
                >
                  <History className="w-5 h-5 text-white" />
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md work-gradient border-white/20 text-white">
                <DialogHeader>
                  <DialogTitle className="text-white">Task History</DialogTitle>
                </DialogHeader>
                <div className="max-h-[60vh] overflow-y-auto pr-2">
                  {completedTasks.length > 0 ? (
                    completedTasks.map((task) => (
                      <div key={task.id} className="task-history-item group">
                        <div>
                          <p className="font-medium">{task.task}</p>
                          <p className="text-xs text-white/70">{formatDate(task.timestamp)}</p>
                        </div>
                        <div className="task-action-menu">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className="h-8 w-8 p-0 text-white/70 hover:text-white"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-8 text-center text-white/60">
                      <p>No completed tasks yet</p>
                    </div>
                  )}
                </div>
              </DialogContent>
            </Dialog>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TaskCompletion;
