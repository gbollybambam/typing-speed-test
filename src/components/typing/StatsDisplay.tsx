import { memo } from 'react';
import { type Mode } from '../../hooks/useTypingEngine';

interface StatsDisplayProps {
  wpm: number;
  accuracy: number;
  timer: number;
  mode: Mode;
}

const StatsDisplay = ({ wpm, accuracy, timer, mode }: StatsDisplayProps) => {
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // UPDATED: Uses semantic variables for label colors
  const labelClasses = "text-[var(--text-secondary)] text-xs sm:text-sm md:text-lg font-medium mb-1 md:mb-0 md:mr-2 whitespace-nowrap";
  const valueBaseClasses = "text-3xl sm:text-4xl md:text-2xl font-bold";

  return (
    <div className="flex w-full md:w-auto justify-between md:justify-start items-center md:items-baseline px-2 md:px-0 divide-x divide-[var(--text-secondary)]/20">
      
      {/* WPM */}
      <div className="flex flex-col md:flex-row md:items-baseline items-center w-1/3 md:w-auto px-2 md:pr-4 md:pl-0">
        <span className={labelClasses}>WPM:</span>
        <span className={`${valueBaseClasses} text-[var(--text-primary)]`}>{wpm}</span>
      </div>

      {/* Accuracy */}
      <div className="flex flex-col md:flex-row md:items-baseline items-center w-1/3 md:w-auto px-2 md:px-4">
        <span className={labelClasses}>Accuracy:</span>
        <span className={`${valueBaseClasses} ${accuracy < 100 ? "text-[var(--error)]" : "text-[var(--text-primary)]"}`}>
          {accuracy}%
        </span>
      </div>

      {/* Timer */}
      <div className="flex flex-col md:flex-row md:items-baseline items-center w-1/3 md:w-auto px-2 md:pl-4 md:pr-0">
        <span className={labelClasses}>Time:</span>
        <span className={`${valueBaseClasses} text-[var(--accent)] ${timer <= 5 && mode === 'timed' ? 'animate-pulse text-[var(--error)]' : ''}`}>
          {formatTime(timer)}
        </span>
      </div>
      
    </div>
  );
};

export default memo(StatsDisplay);