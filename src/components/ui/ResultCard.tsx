import { forwardRef } from 'react';
import logoIcon from '../../assets/images/logo-small.svg';

interface ResultCardProps {
  wpm: number;
  accuracy: number;
  mode: string;
  date: string;
}

// We use forwardRef so the parent can grab this DOM element
const ResultCard = forwardRef<HTMLDivElement, ResultCardProps>(({ wpm, accuracy, mode, date }, ref) => {
  return (
    <div ref={ref} className="bg-neutral-900 p-8 w-[600px] h-[315px] flex flex-col justify-between relative overflow-hidden border border-neutral-800">
      
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-yellow-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

      {/* Header */}
      <div className="flex items-center gap-3 relative z-10">
        <img src={logoIcon} alt="Logo" className="w-8 h-8" />
        <h1 className="text-xl font-bold text-white tracking-tight font-display">TypeMaster</h1>
      </div>

      {/* Main Stats */}
      <div className="flex items-end justify-between relative z-10 px-4">
        <div>
          <p className="text-neutral-500 text-sm font-medium uppercase tracking-widest mb-1">Speed</p>
          <div className="flex items-baseline gap-2">
            <span className="text-7xl font-bold text-white">{wpm}</span>
            <span className="text-2xl text-yellow-400 font-bold">WPM</span>
          </div>
        </div>
        <div className="text-right">
          <p className="text-neutral-500 text-sm font-medium uppercase tracking-widest mb-1">Accuracy</p>
          <div className="text-5xl font-bold text-white">{accuracy}%</div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between border-t border-neutral-800 pt-6 relative z-10">
        <div className="flex flex-col">
          <span className="text-neutral-500 text-xs uppercase tracking-wider">Mode</span>
          <span className="text-neutral-300 font-medium capitalize">{mode.replace('timed-', '')}</span>
        </div>
        <div className="flex flex-col text-right">
          <span className="text-neutral-500 text-xs uppercase tracking-wider">Date</span>
          <span className="text-neutral-300 font-medium">{new Date(date).toLocaleDateString()}</span>
        </div>
      </div>

    </div>
  );
});

export default ResultCard;