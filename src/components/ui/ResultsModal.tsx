import React from 'react';

interface ResultsModalProps {
  status: 'idle' | 'running' | 'finished';
  wpm: number;
  accuracy: number;
  resultMessage: string;
  onRestart: () => void;
  // Optional: We can pass high score to show comparison if needed
  highScore?: number; 
}

const ResultsModal = ({ status, wpm, accuracy, resultMessage, onRestart }: ResultsModalProps) => {
  if (status !== 'finished') return null;

  // Determine icon based on message
  let icon = '🏁';
  let titleColor = 'text-white';
  
  if (resultMessage.includes('Smashed')) {
    icon = '🎉';
    titleColor = 'text-yellow-400';
  } else if (resultMessage.includes('Baseline')) {
    icon = '📈';
    titleColor = 'text-blue-400';
  }

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-300">
      <div className="bg-neutral-900 p-8 md:p-12 rounded-3xl border border-neutral-800 text-center max-w-md w-full shadow-2xl scale-100 animate-in zoom-in-95 duration-300">
        
        {/* Icon & Title */}
        <div className="text-6xl mb-6 animate-bounce">
          {icon}
        </div>
        
        <h2 className={`text-3xl font-bold ${titleColor} mb-2 tracking-tight`}>
          {resultMessage}
        </h2>
        
        <p className="text-neutral-400 mb-8 font-medium">
          {resultMessage.includes('Smashed') 
            ? "You're getting faster! That was incredible." 
            : "Solid run. Keep pushing to beat your best."}
        </p>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 mb-10">
          <div className="bg-neutral-800/50 p-6 rounded-2xl border border-neutral-700/50 flex flex-col items-center">
            <p className="text-neutral-500 text-xs uppercase font-bold tracking-wider mb-2">WPM</p>
            <p className="text-5xl font-bold text-white font-mono">{wpm}</p>
          </div>
          
          <div className="bg-neutral-800/50 p-6 rounded-2xl border border-neutral-700/50 flex flex-col items-center">
            <p className="text-neutral-500 text-xs uppercase font-bold tracking-wider mb-2">Accuracy</p>
            <p className={`text-5xl font-bold font-mono ${accuracy === 100 ? 'text-green-500' : 'text-neutral-200'}`}>
              {accuracy}%
            </p>
          </div>
        </div>

        {/* Action Button */}
        <button 
          onClick={onRestart}
          className="w-full py-4 bg-white text-neutral-900 font-bold text-lg rounded-xl hover:bg-neutral-200 hover:scale-[1.02] transition-all shadow-xl active:scale-95"
        >
          Play Again ↺
        </button>

      </div>
    </div>
  );
};

export default ResultsModal;