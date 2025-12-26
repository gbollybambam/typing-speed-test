import { useState, useEffect, useCallback } from 'react';
import { calculateAccuracy, calculateWPM } from '../utils/calculateStats';

export type GameStatus = 'idle' | 'running' | 'finished';
export type Mode = 'timed' | 'passage'; // 👈 New Type

const useTypingEngine = (mode: Mode, timeOption: number) => {
  const [status, setStatus] = useState<GameStatus>('idle');
  
  // In 'timed' mode, this tracks time remaining.
  // In 'passage' mode, this tracks total time elapsed (starts at 0).
  const [timer, setTimer] = useState(mode === 'timed' ? timeOption : 0);
  
  const [typed, setTyped] = useState<string>('');
  const [errors, setErrors] = useState(0);
  const [totalKeystrokes, setTotalKeystrokes] = useState(0);

  // Helper to determine initial timer value based on mode
  const getInitialTimer = useCallback(() => {
    return mode === 'timed' ? timeOption : 0;
  }, [mode, timeOption]);

  const startGame = useCallback(() => {
    setStatus('running');
    setTimer(getInitialTimer());
    setTyped('');
    setErrors(0);
    setTotalKeystrokes(0);
  }, [getInitialTimer]);

  const stopGame = useCallback(() => {
    setStatus('finished');
  }, []);

  const resetEngine = useCallback(() => {
    setStatus('idle');
    setTimer(getInitialTimer());
    setTyped('');
    setErrors(0);
    setTotalKeystrokes(0);
  }, [getInitialTimer]);

  // Timer Logic - Handles both Count Down and Count Up
  useEffect(() => {
    if (status !== 'running') return;

    const intervalId = setInterval(() => {
      setTimer((prev) => {
        // TIMED MODE: Count Down
        if (mode === 'timed') {
          if (prev <= 1) {
            clearInterval(intervalId);
            setStatus('finished');
            return 0;
          }
          return prev - 1;
        } 
        
        // PASSAGE MODE: Count Up
        return prev + 1; 
      });
    }, 1000);

    return () => clearInterval(intervalId);
  }, [status, mode]);

  const handleInput = useCallback((e: React.ChangeEvent<HTMLInputElement>, targetText: string) => {
    if (status === 'finished') return;
    
    const val = e.target.value;

    if (status === 'idle') {
      startGame();
    }

    setTotalKeystrokes((prev) => prev + 1);

    if (val.length > typed.length) {
      const charIndex = val.length - 1;
      const charTyped = val[charIndex];
      const charCorrect = targetText[charIndex];

      if (charTyped !== charCorrect) {
        setErrors((prev) => prev + 1);
      }
    }

    setTyped(val);

    if (val.length === targetText.length) {
      stopGame();
    }
  }, [status, typed, startGame, stopGame]);

  // Calculate elapsed time for WPM math
  const timeElapsed = mode === 'timed' ? (timeOption - timer) : timer;
  
  const accuracy = calculateAccuracy(totalKeystrokes, errors);
  const wpm = calculateWPM(typed.length, timeElapsed);

  return {
    status,
    timer,
    typed,
    errors,
    accuracy,
    wpm,
    totalKeystrokes,
    startGame,
    resetEngine,
    handleInput,
  };
};

export default useTypingEngine;