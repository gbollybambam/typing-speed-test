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

  const statBoxClass = "bg-transparent border border-neutral-800 rounded-xl p-5 w-full md:w-48 flex flex-col items-start gap-1";

  return (
    <div className="fixed inset-0 bg-[#0A0A0A] z-40 flex flex-col items-center justify-center p-6 animate-in fade-in duration-200 overflow-hidden">
      
      {/* --- BACKGROUND DECORATIONS --- */}
      <img 
        src={star2} 
        alt="" 
        className="absolute top-32 left-8 w-8 h-8 opacity-80 animate-pulse" 
        style={{ animationDuration: '3s' }}
      />
      <img 
        src={star1} 
        alt="" 
        className="absolute bottom-40 right-8 w-10 h-10 opacity-80 animate-pulse" 
        style={{ animationDuration: '4s' }}
      />
      
      {isHighScore && (
        <img 
          src={confettiPattern} 
          alt="Confetti" 
          className="absolute bottom-0 inset-x-0 w-full object-cover opacity-90 pointer-events-none animate-in slide-in-from-bottom-10 duration-700"
        />
      )}

      {/* --- CONTENT --- */}
      <div className="w-full max-w-sm md:max-w-3xl flex flex-col items-center text-center relative z-10 pt-10">
        
        {/* ICON */}
        <div className="mb-6">
          {isHighScore ? (
            <img 
              src={newPbIcon} 
              alt="New High Score!" 
              className="w-16 h-16 animate-bounce"
            />
          ) : (
            <img 
              src={completedIcon} 
              alt="Completed" 
              className="w-16 h-16 animate-in zoom-in duration-300 drop-shadow-[0_0_15px_rgba(34,197,94,0.3)]"
            />
          )}
        </div>

        <h2 className="text-3xl font-bold text-white mb-3">
          {resultMessage}
        </h2>
        
        <p className="text-neutral-400 text-sm md:text-base leading-relaxed mb-10 px-4">
          {subtitle}
        </p>
        
        {/* STATS GRID */}
        <div className="w-full flex flex-col md:flex-row justify-center gap-4 mb-12">
          
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
          className="w-auto px-8 py-3.5 bg-white text-black font-bold text-base rounded-xl hover:bg-neutral-200 transition-transform active:scale-95 flex items-center gap-2 shadow-lg"
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