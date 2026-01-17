import { useState, useRef, useEffect, useCallback } from 'react';
import { getRandomPassage, type Difficulty } from './utils/textGenerator';
import { getRandomCodeSnippet, type CodeLanguage } from './utils/codeGenerator';
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
import SettingsModal from './components/ui/SettingsModal';
import restartIcon from './assets/images/icon-restart.svg';

function App() {
  const [timeOption, setTimeOption] = useState(60);
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [mode, setMode] = useState<Mode>('timed');
  
  // Settings
  const [contentType, setContentType] = useLocalStorage<'text' | 'code'>('typing-speed-content-type', 'text');
  const [codeLanguage, setCodeLanguage] = useLocalStorage<CodeLanguage>('typing-speed-code-lang', 'javascript');
  const [theme, setTheme] = useLocalStorage<'dark' | 'light'>('typing-speed-theme', 'dark');

  // Helper to generate content
  const getNewContent = useCallback(() => {
    if (contentType === 'code') {
      return getRandomCodeSnippet(codeLanguage);
    }
    return getRandomPassage(difficulty).text;
  }, [contentType, difficulty, codeLanguage]);

  // Init text
  const [text, setText] = useState(() => getNewContent());

  // Stats & History
  const [highScore, setHighScore] = useLocalStorage<number>('typing-speed-high-score', 0);
  const [history, setHistory] = useLocalStorage<HistoryItem[]>('typing-speed-history', []);
  const [graphData, setGraphData] = useState<WpmPoint[]>([]);
  
  // Modals
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [resultMessage, setResultMessage] = useState('');

  // Apply Theme
  useEffect(() => {
    document.body.setAttribute('data-theme', theme);
  }, [theme]);

  // Update text when settings change
  useEffect(() => {
    setText(getNewContent());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contentType, codeLanguage]); // Also listen for codeLanguage changes

  const handleGameFinish = useCallback((finalWpm: number, finalAccuracy: number, historyData: WpmPoint[]) => {
    setGraphData(historyData);
    const newEntry: HistoryItem = {
      wpm: finalWpm,
      accuracy: finalAccuracy,
      date: new Date().toISOString(),
      mode: contentType === 'code' ? `Code (${codeLanguage})` : (mode === 'timed' ? `timed-${timeOption}` : 'passage')
    };
    setHistory(prev => [...prev, newEntry]);

    if (highScore === 0 && finalWpm > 0) {
      setResultMessage('Baseline Established!');
      setHighScore(finalWpm);
    } else if (finalWpm > highScore) {
      setResultMessage('High Score Smashed!');
      setHighScore(finalWpm);
    } else {
      setResultMessage('Test Complete!');
    }
  }, [highScore, mode, timeOption, contentType, codeLanguage, setHistory, setHighScore]);

  const { status, timer, typed, wpm, accuracy, startGame, handleInput, resetEngine, errors } = useTypingEngine(
    mode, 
    timeOption, 
    handleGameFinish
  );
  
  const inputRef = useRef<HTMLInputElement>(null);
  const { playClick, playError, playSuccess, toggleMute, isMuted } = useSoundEngine();
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
    if (status === 'finished') playSuccess();
  }, [status, playSuccess]);

  useEffect(() => {
    if (status === 'running' && inputRef.current) inputRef.current.focus();
  }, [status]);

  useEffect(() => {
    resetEngine();
  }, [timeOption, mode, contentType, codeLanguage, resetEngine]);

  // Handlers
  const handleDifficultyChange = useCallback((newDifficulty: Difficulty) => {
    setDifficulty(newDifficulty);
    if (contentType === 'text') {
      setText(getRandomPassage(newDifficulty).text);
    }
    resetEngine();
  }, [resetEngine, contentType]);

  const handleLanguageChange = useCallback((newLang: CodeLanguage) => {
    setCodeLanguage(newLang);
    // Text update is handled by the useEffect above
    resetEngine();
  }, [setCodeLanguage, resetEngine]);

  const handleRestart = useCallback(() => {
    setText(getNewContent());
    resetEngine(); 
  }, [getNewContent, resetEngine]);

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-[var(--bg-primary)] text-[var(--text-primary)] flex flex-col items-center pt-8 md:pt-20 px-4 sm:px-6 font-sans selection:bg-[var(--accent)]/30 touch-manipulation transition-colors duration-300" onClick={() => inputRef.current?.focus()}>
      
      {status !== 'finished' && (
        <div className="relative z-50 w-full max-w-5xl flex justify-center">
          <Header 
            highScore={highScore} 
            onOpenHistory={() => setIsHistoryOpen(true)}
            onOpenSettings={() => setIsSettingsOpen(true)}
          />
        </div>
      )}

      <div className="w-full max-w-5xl flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8 md:mb-12 relative z-40">
        <div className="w-full md:w-auto">
          <StatsDisplay wpm={wpm} accuracy={accuracy} timer={timer} mode={mode} />
        </div>
        <div className="w-full md:w-auto flex justify-end">
          <Controls 
            // Normal Props
            difficulty={difficulty} 
            setDifficulty={handleDifficultyChange} 
            mode={mode} 
            setMode={setMode} 
            timeOption={timeOption} 
            setTimeOption={setTimeOption} 
            status={status}
            // Code Props
            contentType={contentType}
            codeLanguage={codeLanguage}
            setCodeLanguage={handleLanguageChange}
          />
        </div>
      </div>

      <div className="relative w-full max-w-5xl outline-none border-y border-[var(--text-secondary)]/20 py-10 md:py-14 min-h-62.5 mb-32 md:mb-8">
        <div className={`transition-all duration-500 ease-out ${status === 'idle' ? 'blur-sm opacity-40 scale-[0.98]' : 'blur-0 opacity-100 scale-100'}`}>
          <TypingArea text={text} typed={typed} />
        </div>
        
        {status === 'idle' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center z-10 -mt-12">
            <button 
              onClick={(e) => { e.stopPropagation(); startGame(); }} 
              className="px-8 py-4 bg-blue-600 text-white text-lg font-bold rounded-xl shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:bg-blue-500 transition-all active:scale-95"
            >
              Start {contentType === 'code' ? 'Code' : 'Typing'} Test
            </button>
            <p className="mt-4 text-[var(--text-secondary)] font-medium text-lg sm:text-base animate-pulse">Or click the text and start typing</p>
          </div>
        )}
        <input ref={inputRef} type="text" className="absolute opacity-0 w-0 h-0 top-0 left-0" value={typed} onChange={(e) => handleInput(e, text)} autoFocus autoComplete="off" autoCorrect="off" autoCapitalize="off" spellCheck="false" data-gramm="false" />
      </div>

      {status === 'running' && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 md:translate-x-0 md:static md:mt-12 z-40 animate-in fade-in slide-in-from-bottom-4">
           <button 
             onClick={(e) => { e.stopPropagation(); handleRestart(); }} 
             className="px-6 py-3.5 bg-[var(--bg-secondary)] text-[var(--text-primary)] font-bold text-base rounded-xl hover:bg-[var(--text-secondary)]/10 transition-all border border-[var(--text-secondary)]/30 shadow-2xl flex items-center gap-3 active:scale-95"
           >
             <span>Restart Test</span>
             <img src={restartIcon} alt="Restart" className="w-4 h-4 opacity-60 invert dark:invert-0" style={{ filter: 'var(--icon-filter)' }} />
           </button>
        </div>
      )}

      <ResultsModal status={status} wpm={wpm} accuracy={accuracy} correctChars={typed.length - errors} errorChars={errors} history={graphData} resultMessage={resultMessage} onRestart={handleRestart} />
      
      <HistoryModal isOpen={isHistoryOpen} onClose={() => setIsHistoryOpen(false)} history={history} />
      
      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)}
        theme={theme}
        setTheme={setTheme}
        isMuted={isMuted}
        toggleMute={toggleMute}
        contentType={contentType}
        setContentType={setContentType}
      />

    </div>
  );
}

export default App;