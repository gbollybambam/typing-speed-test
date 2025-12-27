import { useState, useRef, useEffect, useCallback } from 'react';
import { getRandomPassage, type Difficulty } from './utils/textGenerator';
import useTypingEngine, { type Mode } from './hooks/useTypingEngine';
import useLocalStorage from './hooks/useLocalStorage';
import useSoundEngine from './hooks/useSoundEngine'; // 👈 IMPORT

// Components
import Header from './components/layout/Header';
import Controls from './components/ui/Controls';
import StatsDisplay from './components/typing/StatsDisplay';
import TypingArea from './components/typing/TypingArea';
import ResultsModal from './components/ui/ResultsModal';
import restartIcon from './assets/images/icon-restart.svg';
// You might want a sound icon, e.g.
// import soundOnIcon from './assets/images/icon-sound-on.svg';
// import soundOffIcon from './assets/images/icon-sound-off.svg';

function App() {
  const [timeOption, setTimeOption] = useState(60);
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [mode, setMode] = useState<Mode>('timed');

  const [text, setText] = useState(() => getRandomPassage('medium').text);
  const [highScore, setHighScore] = useLocalStorage<number>('typing-speed-high-score', 0);
  const [resultMessage, setResultMessage] = useState('');

  const { 
    status, 
    timer, 
    typed, 
    wpm, 
    accuracy, 
    startGame, 
    handleInput, 
    resetEngine,
    errors 
  } = useTypingEngine(mode, timeOption);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsProcessed = useRef(false);

  // 🔊 SOUND ENGINE HOOK
  const { playClick, playError, playSuccess, toggleMute, isMuted } = useSoundEngine();

  // 🔊 EFFECT: Play sounds on typing
  // We track the previous length to know if we added a character
  const prevTypedLength = useRef(0);
  const prevErrors = useRef(0);

  useEffect(() => {
    // Only play if game is running or just finished
    if (status === 'idle') {
      prevTypedLength.current = 0;
      prevErrors.current = 0;
      return;
    }

    const currentLength = typed.length;
    const currentErrors = errors;

    // If we added a character
    if (currentLength > prevTypedLength.current) {
      // Check if it was an error
      if (currentErrors > prevErrors.current) {
        playError();
      } else {
        playClick();
      }
    }

    // Update refs
    prevTypedLength.current = currentLength;
    prevErrors.current = currentErrors;
  }, [typed, errors, status, playClick, playError]);

  // 🔊 EFFECT: Play success on finish
  useEffect(() => {
    if (status === 'finished' && !resultsProcessed.current) {
      playSuccess();
    }
  }, [status, playSuccess]);

  // ... (Existing useEffects for Focus and Results logic remain the same) ...

  useEffect(() => {
    if (status === 'running' && inputRef.current) {
      inputRef.current.focus();
      resultsProcessed.current = false;
    }
  }, [status]);

  useEffect(() => {
    if (status === 'finished') {
      if (resultsProcessed.current) return;

      if (highScore === 0 && wpm > 0) {
        setResultMessage('Baseline Established!');
        setHighScore(wpm);
      } 
      else if (wpm > highScore) {
        setResultMessage('High Score Smashed!');
        setHighScore(wpm);
      } 
      else {
        setResultMessage('Test Complete!');
      }

      resultsProcessed.current = true;
    }
  }, [status, wpm, highScore, setHighScore]);

  useEffect(() => {
    resetEngine();
  }, [timeOption, mode, resetEngine]);

  const handleDifficultyChange = (newDifficulty: Difficulty) => {
    setDifficulty(newDifficulty);
    setText(getRandomPassage(newDifficulty).text);
    resetEngine();
  };

  const handleRestart = useCallback(() => {
    setText(getRandomPassage(difficulty).text); 
    resetEngine(); 
  }, [difficulty, resetEngine]);

  return (
    <div 
      className="min-h-screen bg-neutral-900 text-neutral-200 flex flex-col items-center pt-8 md:pt-20 px-4 sm:px-6 font-sans selection:bg-yellow-400/30 touch-manipulation"
      onClick={() => inputRef.current?.focus()} 
    >
      
      {/* 1. Header */}
      <div className="relative z-50 w-full max-w-5xl flex justify-center">
        <Header highScore={highScore} />
        
        {/* OPTIONAL: Sound Toggle (Absolute positioned top right of container) */}
        <button 
           onClick={(e) => { e.stopPropagation(); toggleMute(); }}
           className="absolute right-0 top-0 mt-1 mr-1 p-2 text-neutral-600 hover:text-white transition-colors"
           title={isMuted ? "Unmute" : "Mute"}
        >
           {/* Simple SVG Speaker Icon */}
           {isMuted ? (
             <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73 4.27 3zM12 4L9.91 6.09 12 8.18V4z"/></svg>
           ) : (
             <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>
           )}
        </button>
      </div>

      {/* 2 & 3. DASHBOARD WRAPPER */}
      <div className="w-full max-w-5xl flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8 md:mb-12 relative z-40">
        <div className="w-full md:w-auto">
          <StatsDisplay 
            wpm={wpm} 
            accuracy={accuracy} 
            timer={timer} 
            mode={mode} 
          />
        </div>
        <div className="w-full md:w-auto flex justify-end">
          <Controls 
            difficulty={difficulty}
            setDifficulty={handleDifficultyChange}
            mode={mode}
            setMode={setMode}
            timeOption={timeOption}
            setTimeOption={setTimeOption}
            status={status}
          />
        </div>
      </div>

      {/* 4. Main Typing Area */}
      <div className="relative w-full max-w-5xl outline-none border-y border-neutral-800/50 py-10 md:py-14 min-h-[250px] mb-32 md:mb-8">
        <div className={`transition-all duration-500 ease-out ${status === 'idle' ? 'blur-[8px] opacity-40 scale-[0.98]' : 'blur-0 opacity-100 scale-100'}`}>
          <TypingArea text={text} typed={typed} />
        </div>

        {status === 'idle' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center z-10 -mt-12">
            <button
              onClick={(e) => {
                e.stopPropagation(); 
                startGame();
              }}
              className="px-8 py-4 bg-blue-600 text-white text-lg font-bold rounded-xl shadow-lg hover:bg-blue-500 transition-transform active:scale-95"
            >
              Start Typing Test
            </button>
            <p className="mt-4 text-neutral-300 font-medium text-lg sm:text-base animate-pulse">
              Or click the text and start typing
            </p>
          </div>
        )}
        
        {/* Hidden Input with Mobile Guards */}
        <input
          ref={inputRef}
          type="text"
          className="absolute opacity-0 w-0 h-0 top-0 left-0" 
          value={typed}
          onChange={(e) => handleInput(e, text)}
          autoFocus
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck="false"
          data-gramm="false"
        />
      </div>

      {/* 5. Restart Button */}
      {status === 'running' && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 md:translate-x-0 md:static md:mt-12 z-40 animate-in fade-in slide-in-from-bottom-4">
           <button
             onClick={(e) => {
               e.stopPropagation();
               handleRestart();
             }}
             className="px-6 py-3.5 bg-neutral-800 text-neutral-200 font-bold text-base rounded-xl hover:bg-neutral-700 hover:text-white transition-all border border-neutral-700/50 shadow-2xl flex items-center gap-3 active:scale-95"
           >
             <span>Restart Test</span>
             <img 
               src={restartIcon} 
               alt="Restart" 
               className="w-4 h-4 text-neutral-400 opacity-80" 
             />
           </button>
        </div>
      )}

      {/* 6. Results Modal */}
      <ResultsModal 
        status={status}
        wpm={wpm}
        accuracy={accuracy}
        correctChars={typed.length - errors} 
        errorChars={errors}
        resultMessage={resultMessage}
        onRestart={handleRestart}
      />

    </div>
  );
}

export default App;