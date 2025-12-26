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
    resetEngine 
  } = useTypingEngine(mode, timeOption);
  
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (status === 'running' && inputRef.current) {
      inputRef.current.focus();
    }
  }, [status]);

  useEffect(() => {
    if (status === 'finished') {
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
      className="min-h-screen bg-neutral-900 text-neutral-0 flex flex-col items-center pt-8 px-4 sm:px-6 font-sans selection:bg-yellow-400/30 touch-manipulation"
      onClick={() => inputRef.current?.focus()} 
    >
      
      {/* 1. Header */}
      <Header highScore={highScore} />

      {/* 2. Stats Dashboard (Moved UP to match screenshot) */}
      <StatsDisplay 
        wpm={wpm} 
        accuracy={accuracy} 
        timer={timer} 
        mode={mode} 
      />

      {/* 3. Controls (Moved DOWN to match screenshot) */}
      <Controls 
        difficulty={difficulty}
        setDifficulty={handleDifficultyChange}
        mode={mode}
        setMode={setMode}
        timeOption={timeOption}
        setTimeOption={setTimeOption}
        status={status}
      />

      {/* 4. Main Typing Area */}
      <div className="relative w-full max-w-5xl flex-1 outline-none mt-4">
        
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
            <p className="mt-4 text-neutral-300 font-medium text-sm sm:text-base animate-pulse">
              Or click the text and start typing
            </p>
          </div>
        )}
        
        {/* Hidden Input (The Engine) */}
        <input
          ref={inputRef}
          type="text"
          className="absolute opacity-0 w-0 h-0" 
          value={typed}
          onChange={(e) => handleInput(e, text)}
          autoFocus
        />
      </div>

      {/* 5. Floating Restart Button (Visible ONLY during run) */}
      {status === 'running' && (
        <div className="fixed bottom-8 z-40 animate-in fade-in slide-in-from-bottom-4">
           <button
             onClick={(e) => {
               e.stopPropagation();
               handleRestart();
             }}
             className="px-6 py-3 bg-neutral-800 text-neutral-300 font-bold text-sm rounded-lg hover:bg-neutral-700 hover:text-white transition-colors border border-neutral-700 shadow-xl flex items-center gap-2"
           >
             <span>↻</span> Restart Test
           </button>
        </div>
      )}

      {/* 6. Results Modal */}
      <ResultsModal 
        status={status}
        wpm={wpm}
        accuracy={accuracy}
        resultMessage={resultMessage}
        onRestart={handleRestart}
      />

    </div>
  );
}

export default App;