import { useState, useEffect, useCallback } from 'react';
import { calculateAccuracy, calculateWPM } from '../utils/calculateStats';

export type GameStatus = 'idle' | 'running' | 'finished';
export type Mode = 'timed' | 'passage';

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

  // ✅ FIXED: The Robust handleInput with Mobile Guards
  const handleInput = useCallback((e: React.ChangeEvent<HTMLInputElement>, targetText: string) => {
    if (status === 'finished') return;
    
    const inputValue = e.target.value;

    // 1. Auto-start on first input
    if (status === 'idle') {
      setStatus('running');
    }

    // --- 🛡️ MOBILE KEYBOARD GUARD START ---
    
    // Guard 1: The "Double Space" Blocker
    // If user types a space, BUT the previous char was also a space,
    // AND the target text does NOT expect a space there...
    // The user is likely mashing space (which triggers 'period' auto-correct on phones).
    const lastChar = inputValue.slice(-1);
    if (lastChar === ' ' && typed.endsWith(' ') && targetText[typed.length] !== ' ') {
      // Reject this input entirely.
      return; 
    }

    // Guard 2: The "Period" Rejection
    // If the input length jumped (or didn't match expected +1) and ends in ". "
    // It means the phone just auto-replaced "  " with ". ".
    // We reject this change to prevent the text from desyncing.
    if (inputValue.endsWith('. ') && !typed.endsWith('.')) {
      // Double check if the text actually wanted a period there. If not, block it.
      const expectedChar = targetText[typed.length];
      if (expectedChar !== '.') {
         return;
      }
    }
    
    // --- 🛡️ GUARD END ---

    // 2. Only increment keystrokes if the input actually changed (and wasn't blocked)
    if (inputValue.length > typed.length) {
      setTotalKeystrokes((prev) => prev + 1);
      
      const charIndex = inputValue.length - 1;
      const charTyped = inputValue[charIndex];
      const charCorrect = targetText[charIndex];

      if (charTyped !== charCorrect) {
        setErrors((prev) => prev + 1);
      }
    }

    // 3. Update State
    setTyped(inputValue);

    // 4. Check for Finish (Passage Mode)
    if (mode === 'passage' && inputValue.length === targetText.length) {
      stopGame();
    }
  }, [status, typed, mode, startGame, stopGame]);

  // Calculate stats
  const timeElapsed = mode === 'timed' ? (timeOption - timer) : timer;
  
  // Prevent division by zero or negative time
  const safeTimeElapsed = timeElapsed <= 0 ? 1 : timeElapsed; 
  
  const accuracy = calculateAccuracy(typed.length, errors); // Use typed length for accuracy base
  const wpm = calculateWPM(typed.length, safeTimeElapsed);

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
