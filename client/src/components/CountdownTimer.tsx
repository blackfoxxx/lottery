import { useState, useEffect } from "react";
import { Clock } from "lucide-react";

interface CountdownTimerProps {
  endDate: string | Date;
  onEnd?: () => void;
  size?: "sm" | "md" | "lg";
  showIcon?: boolean;
}

export default function CountdownTimer({ 
  endDate, 
  onEnd, 
  size = "md",
  showIcon = true 
}: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  function calculateTimeLeft() {
    const end = new Date(endDate).getTime();
    const now = new Date().getTime();
    const difference = end - now;

    if (difference <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, ended: true };
    }

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
      minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
      seconds: Math.floor((difference % (1000 * 60)) / 1000),
      ended: false,
    };
  }

  useEffect(() => {
    const timer = setInterval(() => {
      const newTimeLeft = calculateTimeLeft();
      setTimeLeft(newTimeLeft);

      if (newTimeLeft.ended && onEnd) {
        onEnd();
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [endDate]);

  if (timeLeft.ended) {
    return null;
  }

  const sizeClasses = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
  };

  const iconSizes = {
    sm: "h-3 w-3",
    md: "h-4 w-4",
    lg: "h-5 w-5",
  };

  const isUrgent = timeLeft.days === 0 && timeLeft.hours < 6;

  return (
    <div className={`flex items-center gap-1.5 ${sizeClasses[size]} ${isUrgent ? "text-red-600 dark:text-red-400 animate-pulse" : "text-orange-600 dark:text-orange-400"}`}>
      {showIcon && <Clock className={iconSizes[size]} />}
      <div className="flex items-center gap-1 font-mono font-semibold">
        {timeLeft.days > 0 && (
          <>
            <span>{timeLeft.days}d</span>
            <span>:</span>
          </>
        )}
        <span>{String(timeLeft.hours).padStart(2, "0")}</span>
        <span>:</span>
        <span>{String(timeLeft.minutes).padStart(2, "0")}</span>
        <span>:</span>
        <span>{String(timeLeft.seconds).padStart(2, "0")}</span>
      </div>
    </div>
  );
}
