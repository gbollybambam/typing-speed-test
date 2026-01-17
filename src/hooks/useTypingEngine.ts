import { useState, useEffect, useCallback, useRef } from 'react';
import { calculateAccuracy, calculateWPM } from '../utils/calculateStats';

export type GameStatus = 'idle' | 'running' | 'finished';
export type Mode = 'timed' | 'passage';

const useTypingEngine = (mode: Mode, timeOption: number, onFinish?: (finalWpm: number, finalAccuracy: number) => void) => {
  const [status, setStatus] = useState<GameStatus>('idle');
  const [timer, setTimer] = useState(mode === 'timed' ? timeOption : 0);
  const [typed, setTyped] = useState<string>('');
  const [errors, setErrors] = useState(0);
  const [totalKeystrokes, setTotalKeystrokes] = useState(0);
  
  // Ref to track if we already finished (prevents double calls)
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
            onFinish(finalWpm, finalAccuracy);
        }
    }
  }, [mode, timeOption, timer, typed.length, totalKeystrokes, errors, onFinish]);

  const resetEngine = useCallback(() => {
    setStatus('idle');
    setTimer(getInitialTimer());
    setTyped('');
    setErrors(0);
    setTotalKeystrokes(0);
    hasFinished.current = false;
  }, [getInitialTimer]);

  useEffect(() => {
    if (status !== 'running') return;

    const intervalId = setInterval(() => {
      setTimer((prev) => {
        if (mode === 'timed') {
          if (prev <= 1) {
            clearInterval(intervalId);
            stopGame();
            return 0;
          }
          return prev - 1;
        } 
        return prev + 1; 
      });
    }, 1000);

    return () => clearInterval(intervalId);
  }, [status, mode, stopGame]);

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

  return { status, timer, typed, errors, accuracy, wpm, totalKeystrokes, startGame, resetEngine, handleInput };
};

export default useTypingEngine;