import { useState } from 'react';
import PerformanceChart from './PerformanceChart';
import { type WpmPoint } from '../../hooks/useTypingEngine';

import restartIcon from '../../assets/images/icon-restart.svg';
import completedIcon from '../../assets/images/icon-completed.svg';
import star1 from '../../assets/images/pattern-star-1.svg';
import star2 from '../../assets/images/pattern-star-2.svg';
import newPbIcon from '../../assets/images/icon-new-pb.svg';
import confettiPattern from '../../assets/images/pattern-confetti.svg';

interface ResultsModalProps {
  status: 'idle' | 'running' | 'finished';
  wpm: number;
  accuracy: number;
  correctChars: number;
  errorChars: number;
  history: WpmPoint[];
  resultMessage: string;
  onRestart: () => void;
}

const ResultsModal = ({ status, wpm, accuracy, correctChars, errorChars, history, resultMessage, onRestart }: ResultsModalProps) => {
  
  const [copied, setCopied] = useState(false);

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

  const handleShare = () => {
    const text = `🚀 I just hit ${wpm} WPM with ${accuracy}% accuracy on the FM30 Typing Speed Test!\n\nCan you beat my score? Try it here: https://typing-speed-test-blik.vercel.app/`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const statBoxClass = "bg-[var(--bg-secondary)] border border-[var(--text-secondary)]/20 rounded-xl p-5 w-full md:w-48 flex flex-col items-start gap-1 shadow-sm";

  return (
    // ✅ FIX 1: Outer Container handles Scrolling and Z-Index
    // We use 'overflow-y-auto' here so the whole page scrolls if needed
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[var(--bg-primary)] animate-in fade-in duration-200">
      
      {/* Background Decor (Fixed so they don't scroll awkwardly) */}
      <div className="fixed inset-0 pointer-events-none">
        <img src={star1} alt="" className="absolute top-32 left-8 w-8 h-8 opacity-40 animate-pulse" style={{ animationDuration: '3s' }} />
        <img src={star2} alt="" className="absolute bottom-40 right-8 w-10 h-10 opacity-40 animate-pulse" style={{ animationDuration: '4s' }} />
        {isHighScore && <img src={confettiPattern} alt="Confetti" className="absolute bottom-0 inset-x-0 w-full object-cover opacity-60 pointer-events-none animate-in slide-in-from-bottom-10 duration-700" />}
      </div>

      {/* ✅ FIX 2: Layout Wrapper
          'min-h-full' ensures that if content is small, it centers vertically.
          If content is large, it stretches naturally so you can scroll to the top/bottom.
      */}
      <div className="flex min-h-full items-center justify-center p-4 text-center">
        
        {/* Content Container */}
        <div className="relative w-full max-w-sm md:max-w-4xl flex flex-col items-center py-10 z-10">
          
          <div className="mb-6">
            {isHighScore ? 
              <img src={newPbIcon} alt="New High Score!" className="w-16 h-16 animate-bounce" /> : 
              <img src={completedIcon} alt="Completed" className="w-16 h-16 animate-in zoom-in duration-300 drop-shadow-md" />
            }
          </div>

          <h2 className="text-3xl font-bold text-[var(--text-primary)] mb-3">{resultMessage}</h2>
          <p className="text-[var(--text-secondary)] text-sm md:text-base leading-relaxed mb-8 px-4">{subtitle}</p>
          
          <div className="w-full flex flex-col md:flex-row justify-center gap-4 mb-8">
            <div className={statBoxClass}>
              <span className="text-[var(--text-secondary)] text-sm font-medium">WPM:</span>
              <span className="text-3xl font-bold text-[var(--text-primary)]">{wpm}</span>
            </div>
            <div className={statBoxClass}>
              <span className="text-[var(--text-secondary)] text-sm font-medium">Accuracy:</span>
              <span className={`text-3xl font-bold ${accuracy < 100 ? 'text-[var(--error)]' : 'text-green-500'}`}>{accuracy}%</span>
            </div>
            <div className={statBoxClass}>
              <span className="text-[var(--text-secondary)] text-sm font-medium">Characters</span>
              <div className="text-3xl font-bold">
                <span className="text-green-500">{correctChars}</span>
                <span className="text-[var(--text-secondary)] mx-1">/</span>
                <span className="text-[var(--error)]">{errorChars}</span>
              </div>
            </div>
          </div>

          <div className="w-full mb-10 animate-in slide-in-from-bottom-4 duration-500 delay-100">
            <PerformanceChart data={history} />
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
            <button onClick={onRestart} className="px-8 py-3.5 bg-[var(--text-primary)] text-[var(--bg-primary)] font-bold text-base rounded-xl hover:opacity-90 transition-transform active:scale-95 flex items-center justify-center gap-2 shadow-lg">
              <span>{buttonText}</span>
              <img src={restartIcon} alt="" className="w-4 h-4 invert" />
            </button>
            
            <button onClick={handleShare} className="px-8 py-3.5 bg-transparent border border-[var(--text-secondary)]/50 text-[var(--text-primary)] font-bold text-base rounded-xl hover:bg-[var(--text-secondary)]/10 transition-all active:scale-95">
              {copied ? "Copied!" : "Share Result"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsModal;