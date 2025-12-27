import { useState, useRef, useEffect, useCallback } from 'react';
import { getRandomPassage, type Difficulty } from './utils/textGenerator';
import useTypingEngine, { type Mode } from './hooks/useTypingEngine';
import useLocalStorage from './hooks/useLocalStorage';

// Components
import Header from './components/layout/Header';
import Controls from './components/ui/Controls';
import StatsDisplay from './components/typing/StatsDisplay';
import TypingArea from './components/typing/TypingArea';
import ResultsModal from './components/ui/ResultsModal';
import restartIcon from './assets/images/icon-restart.svg';

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
      {/* Removed px-1 to ensure exact alignment with Stats below */}
      <div className="relative z-50 w-full max-w-5xl flex justify-center">
        <Header highScore={highScore} />
      </div>

      {/* 2 & 3. DASHBOARD WRAPPER (Stats + Controls) */}
      <div className="w-full max-w-5xl flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8 md:mb-12 relative z-40">
        
        {/* Stats Section */}
        <div className="w-full md:w-auto">
          <StatsDisplay 
            wpm={wpm} 
            accuracy={accuracy} 
            timer={timer} 
            mode={mode} 
          />
        </div>

        {/* Controls Section */}
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

        {/* Blur Effect when Idle */}
        <div className={`transition-all duration-500 ease-out ${status === 'idle' ? 'blur-[8px] opacity-40 scale-[0.98]' : 'blur-0 opacity-100 scale-100'}`}>
          <TypingArea text={text} typed={typed} />
        </div>

        {/* Start Button Overlay */}
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

        <input
          ref={inputRef}
          type="text"
          className="absolute opacity-0 w-0 h-0 top-0 left-0" // Fixed position to prevent page jump on focus
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