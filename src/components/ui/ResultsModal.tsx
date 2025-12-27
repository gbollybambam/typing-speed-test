import React from 'react';
import restartIcon from '../../assets/images/icon-restart.svg';
import completedIcon from '../../assets/images/icon-completed.svg';
import star1 from '../../assets/images/pattern-star-1.svg';
import star2 from '../../assets/images/pattern-star-2.svg';

interface ResultsModalProps {
  status: 'idle' | 'running' | 'finished';
  wpm: number;
  accuracy: number;
  correctChars: number;
  errorChars: number;
  resultMessage: string;
  onRestart: () => void;
}

const ResultsModal = ({ 
  status, 
  wpm, 
  accuracy, 
  correctChars, 
  errorChars,
  resultMessage, 
  onRestart 
}: ResultsModalProps) => {
  if (status !== 'finished') return null;

  const isHighScore = resultMessage.includes('Smashed');
  const isBaseline = resultMessage.includes('Baseline');
  
  let subtitle = "Solid run. Keep pushing to beat your high score.";
  let buttonText = "Go Again";
  
  if (isHighScore) {
    subtitle = "You're getting faster. That was incredible typing.";
    buttonText = "Go Again"; 
  } else if (isBaseline) {
    subtitle = "You've set the bar. Now the real challenge begins—time to beat it.";
    buttonText = "Beat This Score";
  }

  // ✅ FIX: Removed 'bg-[#1C1C1C]'. Now it is 'bg-transparent' with just the border.
  const statBoxClass = "bg-transparent border border-neutral-800 rounded-xl p-5 w-full flex flex-col items-start gap-1";

  return (
    // z-40 ensures it sits BEHIND the Header (which is z-50 in App.tsx)
    <div className="fixed inset-0 bg-[#0A0A0A] z-40 flex flex-col items-center justify-center p-6 animate-in fade-in duration-200">
      
      {/* Background Stars */}
      <img 
        src={star2} 
        alt="" 
        className="absolute top-32 left-8 w-8 h-8 opacity-80 animate-pulse" 
        style={{ animationDuration: '3s' }}
      />
      <img 
        src={star1} 
        alt="" 
        className="absolute bottom-20 right-8 w-10 h-10 opacity-80 animate-pulse" 
        style={{ animationDuration: '4s' }}
      />
      
      {/* Confetti (High Score only) */}
      {isHighScore && (
        <div className="absolute inset-x-0 bottom-0 h-1/3 overflow-hidden pointer-events-none">
           <div className="absolute bottom-0 left-[10%] w-2 h-2 bg-red-500 animate-bounce" style={{ animationDuration: '1s' }}></div>
           <div className="absolute bottom-10 left-[20%] w-2 h-2 bg-blue-500 animate-bounce" style={{ animationDuration: '1.5s' }}></div>
           <div className="absolute bottom-5 left-[50%] w-2 h-2 bg-yellow-400 animate-bounce" style={{ animationDuration: '1.2s' }}></div>
           <div className="absolute bottom-12 right-[20%] w-2 h-2 bg-green-500 animate-bounce" style={{ animationDuration: '1.3s' }}></div>
        </div>
      )}

      {/* Content */}
      <div className="w-full max-w-sm flex flex-col items-center text-center relative z-10 pt-10">
        
        {/* Icon */}
        <div className="mb-6">
          {isHighScore ? (
            <div className="animate-bounce">
              <svg width="56" height="56" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                 <path d="M11 2L10 4M14.5 3L13.5 5.5M6 8L3 8M7 13L4.5 15M20 11L22 10M17.5 7L19.5 5" stroke="#FACC15" strokeWidth="2" strokeLinecap="round"/>
                 <path d="M17.5 13.5L13 18L5.5 10.5L10 6L17.5 13.5Z" stroke="#FACC15" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                 <path d="M12.5 12L15 9.5" stroke="#FACC15" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
          ) : (
            <img 
              src={completedIcon} 
              alt="Completed" 
              className="w-16 h-16 animate-in zoom-in duration-300 drop-shadow-[0_0_15px_rgba(34,197,94,0.3)]"
            />
          )}
        </div>

        <h2 className="text-2xl font-bold text-white mb-2">
          {resultMessage}
        </h2>
        
        <p className="text-neutral-400 text-sm leading-relaxed mb-8 px-4">
          {subtitle}
        </p>
        
        {/* Stats Grid */}
        <div className="w-full flex flex-col gap-3 mb-12">
          
          <div className={statBoxClass}>
            <span className="text-neutral-500 text-sm font-medium">WPM:</span>
            <span className="text-3xl font-bold text-white">{wpm}</span>
          </div>

          <div className={statBoxClass}>
            <span className="text-neutral-500 text-sm font-medium">Accuracy:</span>
            <span className={`text-3xl font-bold ${accuracy < 100 ? 'text-red-500' : 'text-green-500'}`}>
              {accuracy}%
            </span>
          </div>

          <div className={statBoxClass}>
            <span className="text-neutral-500 text-sm font-medium">Characters</span>
            <div className="text-3xl font-bold">
              <span className="text-green-500">{correctChars}</span>
              <span className="text-neutral-600 mx-1">/</span>
              <span className="text-red-500">{errorChars}</span>
            </div>
          </div>

        </div>

        {/* Restart Button */}
        <button 
          onClick={onRestart}
          className="w-auto px-8 py-3 bg-white text-black font-bold text-base rounded-xl hover:bg-neutral-200 transition-transform active:scale-95 flex items-center gap-2 shadow-lg"
        >
          <span>{buttonText}</span>
          <img 
             src={restartIcon} 
             alt="" 
             className="w-4 h-4" 
             style={{ filter: 'brightness(0)' }} 
          />
        </button>

      </div>
    </div>
  );
};

export default ResultsModal;