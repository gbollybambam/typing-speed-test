import { useState, useEffect, useCallback, useRef } from 'react';
import { calculateAccuracy, calculateWPM } from '../utils/calculateStats';

export type GameStatus = 'idle' | 'running' | 'finished';
export type Mode = 'timed' | 'passage';

// Define the shape of our graph data
export interface WpmPoint {
  time: number;
  wpm: number;
}

const useTypingEngine = (mode: Mode, timeOption: number, onFinish?: (finalWpm: number, finalAccuracy: number, history: WpmPoint[]) => void) => {
  const [status, setStatus] = useState<GameStatus>('idle');
  const [timer, setTimer] = useState(mode === 'timed' ? timeOption : 0);
  const [typed, setTyped] = useState<string>('');
  const [errors, setErrors] = useState(0);
  const [totalKeystrokes, setTotalKeystrokes] = useState(0);
  
  // NEW: Store WPM every second for the graph
  const [wpmHistory, setWpmHistory] = useState<WpmPoint[]>([]);

  const hasFinished = useRef(false);

  const getInitialTimer = useCallback(() => {
    return mode === 'timed' ? timeOption : 0;
  }, [mode, timeOption]);

  const startGame = useCallback(() => {
    setStatus('running');
    setTimer(getInitialTimer());
    setTyped('');
    setErrors(0);
    setTotalKeystrokes(0);
    setWpmHistory([]); // Reset history
    hasFinished.current = false;
  }, [getInitialTimer]);

  const stopGame = useCallback(() => {
    setStatus('finished');
    
    if (!hasFinished.current) {
        hasFinished.current = true;
        
        const timeElapsed = mode === 'timed' ? (timeOption - timer) : timer;
        const finalWpm = calculateWPM(typed.length, timeElapsed);
        const finalAccuracy = calculateAccuracy(totalKeystrokes, errors);

        if (onFinish) {
            // Pass the captured history to the finish handler
            onFinish(finalWpm, finalAccuracy, wpmHistory);
        }
    }
  }, [mode, timeOption, timer, typed.length, totalKeystrokes, errors, onFinish, wpmHistory]);

  const resetEngine = useCallback(() => {
    setStatus('idle');
    setTimer(getInitialTimer());
    setTyped('');
    setErrors(0);
    setTotalKeystrokes(0);
    setWpmHistory([]);
    hasFinished.current = false;
  }, [getInitialTimer]);

  // Timer & Recorder Logic
  useEffect(() => {
    if (status !== 'running') return;

    const intervalId = setInterval(() => {
      setTimer((prevTimer) => {
        // 1. Record WPM for this second
        // We calculate "current" elapsed time to get the WPM *right now*
        let currentElapsed = 0;
        if (mode === 'timed') {
            currentElapsed = timeOption - prevTimer;
        } else {
            currentElapsed = prevTimer;
        }

        // Avoid division by zero at the very start
        if (currentElapsed > 0) {
            const currentWpm = calculateWPM(typed.length, currentElapsed);
            setWpmHistory(prev => [...prev, { time: currentElapsed, wpm: currentWpm }]);
        }

        // 2. Update Timer
        if (mode === 'timed') {
          if (prevTimer <= 1) {
            clearInterval(intervalId);
            stopGame();
            return 0;
          }
          return prevTimer - 1;
        } 
        return prevTimer + 1; 
      });
    }, 1000);

    return () => clearInterval(intervalId);
  }, [status, mode, stopGame, typed.length, timeOption]); // Added dependencies to capture current typed length

  const handleInput = useCallback((e: React.ChangeEvent<HTMLInputElement>, targetText: string) => {
    if (status === 'finished') return;
    
    const val = e.target.value;
    if (status === 'idle') startGame();

    setTotalKeystrokes((prev) => prev + 1);

    if (val.length > typed.length) {
        const charIndex = val.length - 1;
        if (val[charIndex] !== targetText[charIndex]) {
            setErrors((prev) => prev + 1);
        }
    }

    setTyped(val);

    if (val.length === targetText.length) {
      stopGame();
    }
  }, [status, typed, startGame, stopGame]);

  const timeElapsed = mode === 'timed' ? (timeOption - timer) : timer;
  const accuracy = calculateAccuracy(totalKeystrokes, errors);
  const wpm = calculateWPM(typed.length, timeElapsed);

  return { status, timer, typed, errors, accuracy, wpm, totalKeystrokes, wpmHistory, startGame, resetEngine, handleInput };
};

export default useTypingEngine;