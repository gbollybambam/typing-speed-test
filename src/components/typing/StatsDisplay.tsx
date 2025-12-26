import { type Mode } from '../../hooks/useTypingEngine';

interface StatsDisplayProps {
  wpm: number;
  accuracy: number;
  timer: number;
  mode: Mode;
}

const StatsDisplay = ({ wpm, accuracy, timer, mode }: StatsDisplayProps) => {
  
  // Helper to match the screenshot time format (e.g., 0:60, 0:46)
  const formatTime = (seconds: number) => {
    // If it's exactly 60, hardcode to match screenshot "0:60" if desired, 
    // otherwise standard min:sec formatting:
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex w-full max-w-5xl justify-between items-center mb-8 px-2 divide-x divide-neutral-800">
      
      {/* WPM */}
      <div className="flex flex-col items-center w-1/3 px-2">
        <span className="text-neutral-500 text-xs sm:text-sm font-medium mb-1">
          WPM:
        </span>
        <span className="text-3xl sm:text-4xl font-bold text-white">
          {wpm}
        </span>
      </div>

      {/* Accuracy */}
      <div className="flex flex-col items-center w-1/3 px-2">
        <span className="text-neutral-500 text-xs sm:text-sm font-medium mb-1">
          Accuracy:
        </span>
        <span className={`text-3xl sm:text-4xl font-bold ${accuracy < 100 ? "text-red-500" : "text-white"}`}>
          {accuracy}%
        </span>
      </div>

      {/* Timer */}
      <div className="flex flex-col items-center w-1/3 px-2">
        <span className="text-neutral-500 text-xs sm:text-sm font-medium mb-1">
          {mode === 'timed' ? 'Time:' : 'Time:'}
        </span>
        <span className={`text-3xl sm:text-4xl font-bold text-yellow-400 ${timer <= 5 && mode === 'timed' ? 'animate-pulse text-red-500' : ''}`}>
          {formatTime(timer)}
        </span>
      </div>
      
    </div>
  );
};

export default StatsDisplay;