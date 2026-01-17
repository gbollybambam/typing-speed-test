import { useState, useRef, useEffect, useCallback } from 'react';
import { getRandomPassage, type Difficulty } from './utils/textGenerator';
import useTypingEngine, { type Mode, type WpmPoint } from './hooks/useTypingEngine';
import useLocalStorage from './hooks/useLocalStorage';
import useSoundEngine from './hooks/useSoundEngine';

// Components
import Header from './components/layout/Header';
import Controls from './components/ui/Controls';
import StatsDisplay from './components/typing/StatsDisplay';
import TypingArea from './components/typing/TypingArea';
import ResultsModal from './components/ui/ResultsModal';
import HistoryModal, { type HistoryItem } from './components/ui/HistoryModal';
import restartIcon from './assets/images/icon-restart.svg';

function App() {
  const [timeOption, setTimeOption] = useState(60);
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [mode, setMode] = useState<Mode>('timed');

  const [text, setText] = useState(() => getRandomPassage('medium').text);
  const [highScore, setHighScore] = useLocalStorage<number>('typing-speed-high-score', 0);
  const [history, setHistory] = useLocalStorage<HistoryItem[]>('typing-speed-history', []);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [resultMessage, setResultMessage] = useState('');
  
  // ✅ NEW: State to hold the graph data for the modal
  const [graphData, setGraphData] = useState<WpmPoint[]>([]);

  // 1. UPDATED: Finish Handler now accepts historyData
  const handleGameFinish = useCallback((finalWpm: number, finalAccuracy: number, historyData: WpmPoint[]) => {
    // Save Graph Data to State
    setGraphData(historyData);

    // Save to History (Local Storage)
    const newEntry: HistoryItem = {
      wpm: finalWpm,
      accuracy: finalAccuracy,
      date: new Date().toISOString(),
      mode: mode === 'timed' ? `timed-${timeOption}` : 'passage'
    };
    setHistory(prev => [...prev, newEntry]);

    // Check High Score
    if (highScore === 0 && finalWpm > 0) {
      setResultMessage('Baseline Established!');
      setHighScore(finalWpm);
    } else if (finalWpm > highScore) {
      setResultMessage('High Score Smashed!');
      setHighScore(finalWpm);
    } else {
      setResultMessage('Test Complete!');
    }
  }, [highScore, mode, timeOption, setHistory, setHighScore]);

  // 2. Engine Hook
  const { status, timer, typed, wpm, accuracy, startGame, handleInput, resetEngine, errors } = useTypingEngine(
    mode, 
    timeOption, 
    handleGameFinish
  );
  
  const inputRef = useRef<HTMLInputElement>(null);
  const { playClick, playError, playSuccess, toggleMute, isMuted } = useSoundEngine();

  // Sound Effect Logic
  const prevTypedLength = useRef(0);
  const prevErrors = useRef(0);

  useEffect(() => {
    if (status === 'idle') {
      prevTypedLength.current = 0;
      prevErrors.current = 0;
      return;
    }
    const currentLength = typed.length;
    const currentErrors = errors;
    if (currentLength > prevTypedLength.current) {
      if (currentErrors > prevErrors.current) playError();
      else playClick();
    }
    prevTypedLength.current = currentLength;
    prevErrors.current = currentErrors;
  }, [typed, errors, status, playClick, playError]);

  useEffect(() => {
    if (status === 'finished') {
      playSuccess();
    }
  }, [status, playSuccess]);

  // Focus Input on Start
  useEffect(() => {
    if (status === 'running' && inputRef.current) {
      inputRef.current.focus();
    }
  }, [status]);

  useEffect(() => {
    resetEngine();
  }, [timeOption, mode, resetEngine]);

  const handleDifficultyChange = useCallback((newDifficulty: Difficulty) => {
    setDifficulty(newDifficulty);
    setText(getRandomPassage(newDifficulty).text);
    resetEngine();
  }, [resetEngine]);

  const handleRestart = useCallback(() => {
    setText(getRandomPassage(difficulty).text); 
    resetEngine(); 
  }, [difficulty, resetEngine]);

  return (
    <div className="min-h-screen bg-neutral-900 text-neutral-200 flex flex-col items-center pt-8 md:pt-20 px-4 sm:px-6 font-sans selection:bg-yellow-400/30 touch-manipulation" onClick={() => inputRef.current?.focus()}>
      
      {/* Header with History & Sound Buttons - Hides when finished */}
      {status !== 'finished' && (
        <div className="relative z-50 w-full max-w-5xl flex justify-center">
          <Header 
            highScore={highScore} 
            onOpenHistory={() => setIsHistoryOpen(true)}
            isMuted={isMuted}
            onToggleMute={toggleMute}
          />
        </div>
      )}

      <div className="w-full max-w-5xl flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8 md:mb-12 relative z-40">
        <div className="w-full md:w-auto">
          <StatsDisplay wpm={wpm} accuracy={accuracy} timer={timer} mode={mode} />
        </div>
        <div className="w-full md:w-auto flex justify-end">
          <Controls difficulty={difficulty} setDifficulty={handleDifficultyChange} mode={mode} setMode={setMode} timeOption={timeOption} setTimeOption={setTimeOption} status={status} />
        </div>
      </div>

      <div className="relative w-full max-w-5xl outline-none border-y border-neutral-800/50 py-10 md:py-14 min-h-62.5 mb-32 md:mb-8">
        <div className={`transition-all duration-500 ease-out ${status === 'idle' ? 'blur-sm opacity-40 scale-[0.98]' : 'blur-0 opacity-100 scale-100'}`}>
          <TypingArea text={text} typed={typed} />
        </div>
        {status === 'idle' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center z-10 -mt-12">
            <button onClick={(e) => { e.stopPropagation(); startGame(); }} className="px-8 py-4 bg-blue-600 text-white text-lg font-bold rounded-xl shadow-lg hover:bg-blue-500 transition-transform active:scale-95">
              Start Typing Test
            </button>
            <p className="mt-4 text-neutral-300 font-medium text-lg sm:text-base animate-pulse">Or click the text and start typing</p>
          </div>
        )}
        <input ref={inputRef} type="text" className="absolute opacity-0 w-0 h-0 top-0 left-0" value={typed} onChange={(e) => handleInput(e, text)} autoFocus autoComplete="off" autoCorrect="off" autoCapitalize="off" spellCheck="false" data-gramm="false" />
      </div>

      {status === 'running' && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 md:translate-x-0 md:static md:mt-12 z-40 animate-in fade-in slide-in-from-bottom-4">
           <button onClick={(e) => { e.stopPropagation(); handleRestart(); }} className="px-6 py-3.5 bg-neutral-800 text-neutral-200 font-bold text-base rounded-xl hover:bg-neutral-700 hover:text-white transition-all border border-neutral-700/50 shadow-2xl flex items-center gap-3 active:scale-95">
             <span>Restart Test</span>
             <img src={restartIcon} alt="Restart" className="w-4 h-4 text-neutral-400 opacity-80" />
           </button>
        </div>
      )}

      {/* ✅ UPDATED: Passing history data to the Results Modal */}
      <ResultsModal 
        status={status} 
        wpm={wpm} 
        accuracy={accuracy} 
        correctChars={typed.length - errors} 
        errorChars={errors} 
        history={graphData} // <--- This connects the graph!
        resultMessage={resultMessage} 
        onRestart={handleRestart} 
      />
      
      <HistoryModal isOpen={isHistoryOpen} onClose={() => setIsHistoryOpen(false)} history={history} />

    </div>
  );
}

export default App;