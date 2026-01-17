import { useState, useRef, useCallback } from 'react';
import { toPng } from 'html-to-image';
import PerformanceChart from './PerformanceChart';
import ResultCard from './ResultCard';
import { type WpmPoint } from '../../hooks/useTypingEngine';

// Images
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
  
  // --- 1. HOOKS (Must be at the top, unconditional) ---
  const [copied, setCopied] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleShare = useCallback(() => {
    const text = `🚀 I just hit ${wpm} WPM with ${accuracy}% accuracy on the FM30 Typing Speed Test!\n\nCan you beat my score? Try it here: https://typing-speed-test-blik.vercel.app/`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [wpm, accuracy]);

  const handleDownload = useCallback(async () => {
    if (cardRef.current === null) return;
    
    setIsDownloading(true);
    try {
      const dataUrl = await toPng(cardRef.current, { cacheBust: true, pixelRatio: 2 });
      const link = document.createElement('a');
      link.download = `typemaster-result-${wpm}wpm.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Failed to generate image', err);
    } finally {
      setIsDownloading(false);
    }
  }, [wpm]);

  // --- 2. LOGIC (Safe to put here) ---
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

  const statBoxClass = "bg-[var(--bg-secondary)] border border-[var(--text-secondary)]/20 rounded-xl p-5 w-full md:w-48 flex flex-col items-start gap-1 shadow-sm";

  // --- 3. CONDITIONAL RETURN (Must be AFTER hooks) ---
  if (status !== 'finished') return null;

  // --- 4. RENDER ---
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[var(--bg-primary)] animate-in fade-in duration-200">
      
      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none">
        <img src={star1} alt="" className="absolute top-32 left-8 w-8 h-8 opacity-40 animate-pulse" style={{ animationDuration: '3s' }} />
        <img src={star2} alt="" className="absolute bottom-40 right-8 w-10 h-10 opacity-40 animate-pulse" style={{ animationDuration: '4s' }} />
        {isHighScore && <img src={confettiPattern} alt="Confetti" className="absolute bottom-0 inset-x-0 w-full object-cover opacity-60 pointer-events-none animate-in slide-in-from-bottom-10 duration-700" />}
      </div>

      <div className="flex min-h-full items-center justify-center p-4 text-center">
        
        <div className="relative w-full max-w-sm md:max-w-4xl flex flex-col items-center py-10 z-10">
          
          <div className="mb-6">
            {isHighScore ? 
              <img src={newPbIcon} alt="New High Score!" className="w-16 h-16 animate-bounce" /> : 
              <img src={completedIcon} alt="Completed" className="w-16 h-16 animate-in zoom-in duration-300 drop-shadow-md" />
            }
          </div>

          <h2 className="text-3xl font-bold text-[var(--text-primary)] mb-3">{resultMessage}</h2>
          <p className="text-[var(--text-secondary)] text-sm md:text-base leading-relaxed mb-8 px-4">{subtitle}</p>
          
          {/* Stats Grid */}
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
            {/* Restart Button */}
            <button onClick={onRestart} className="px-8 py-3.5 bg-[var(--text-primary)] text-[var(--bg-primary)] font-bold text-base rounded-xl hover:opacity-90 transition-transform active:scale-95 flex items-center justify-center gap-2 shadow-lg">
              <span>{buttonText}</span>
              <img src={restartIcon} alt="" className="w-4 h-4 invert dark:invert-0" style={{ filter: 'var(--icon-filter)' }} />
            </button>
            
            {/* Share/Copy Button */}
            <button onClick={handleShare} className="px-8 py-3.5 bg-transparent border border-[var(--text-secondary)]/50 text-[var(--text-primary)] font-bold text-base rounded-xl hover:bg-[var(--text-secondary)]/10 transition-all active:scale-95">
              {copied ? "Copied!" : "Share result"}
            </button>

            {/* Download Image Button */}
            <button 
              onClick={handleDownload} 
              disabled={isDownloading} 
              className="px-8 py-3.5 bg-[var(--accent)] text-[var(--bg-primary)] font-bold text-base rounded-xl hover:opacity-90 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isDownloading ? (
                 <span className="animate-pulse">Saving...</span>
              ) : (
                <>
                  <span>Image</span>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Hidden Card for Screenshot Generation */}
      <div className="fixed top-0 left-0 -z-50 opacity-0 pointer-events-none">
        <ResultCard 
          ref={cardRef} 
          wpm={wpm} 
          accuracy={accuracy} 
          mode="Typing Speed Test"
          date={new Date().toISOString()} 
        />
      </div>

    </div>
  );
};

export default ResultsModal;