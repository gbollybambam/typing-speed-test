import restartIcon from './assets/images/icon-restart.svg';

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
    resetEngine,
    errors
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
      <div className="relative z-50 w-full flex justify-center">
        <Header highScore={highScore} />
      </div>

      {/* 2. Stats Dashboard */}
      <StatsDisplay 
        wpm={wpm} 
        accuracy={accuracy} 
        timer={timer} 
        mode={mode} 
      />

      {/* 3. Controls */}
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
      {/* ✅ FIXED: Removed 'flex-1'. Added 'min-h-[300px]' and 'mb-32' so the bottom border shows clearly. */}
      <div className="relative w-full max-w-5xl outline-none mt-6 border-y border-neutral-700/50 py-8 min-h-[300px] mb-32">
        
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
        
        {/* Hidden Input */}
        <input
          ref={inputRef}
          type="text"
          className="absolute opacity-0 w-0 h-0" 
          value={typed}
          onChange={(e) => handleInput(e, text)}
          autoFocus
        />
      </div>

      {/* 5. Floating Restart Button */}
      {status === 'running' && (
        <div className="fixed bottom-8 z-40 animate-in fade-in slide-in-from-bottom-4">
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
      {/* 6. Results Modal */}
      <ResultsModal 
        status={status}
        wpm={wpm}
        accuracy={accuracy}
        correctChars={typed.length - errors} // Logic: Total length - errors = Correct
        errorChars={errors}
        resultMessage={resultMessage}
        onRestart={handleRestart}
      />

    </div>
  );
}

export default App;