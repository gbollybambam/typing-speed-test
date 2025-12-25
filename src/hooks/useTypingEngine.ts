import { useState, useEffect, useCallback } from 'react';
import { calculateAccuracy, calculateWPM } from '../utils/calculateStats';

// 1. Define the possible states of the game
export type GameStatus = 'idle' | 'running' | 'finished';

const useTypingEngine = (initialTime: number = 60) => {
  const [status, setStatus] = useState<GameStatus>('idle');
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const [typed, setTyped] = useState<string>('');
  const [errors, setErrors] = useState(0);
  const [totalKeystrokes, setTotalKeystrokes] = useState(0);


  // Helper to start the game
  const startGame = useCallback(() => {
    setStatus('running');
    setTimeLeft(initialTime);
    setTyped('');
    setErrors(0);
    setTotalKeystrokes(0);
  }, [initialTime]);

  const stopGame = useCallback(() => {
    setStatus('finished');
  }, []);

  const resetEngine = useCallback(() => {
    setStatus('idle');
    setTimeLeft(initialTime);
    setTyped('');
    setErrors(0);
    setTotalKeystrokes(0);
  }, [initialTime])


  // Countdown Logic
  useEffect(() => {
    if (status !== 'running') return;

    const intervalId = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(intervalId);
          setStatus('finished');
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    // cleanup: clear interval when component unmounts or time changes
    return () => clearInterval(intervalId);
  }, [status]);


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


  const timeElapsed = initialTime - timeLeft;
  const accuracy = calculateAccuracy(totalKeystrokes, errors);
  const wpm = calculateWPM(typed.length, timeElapsed);

  return {
    status,
    timeLeft,
    typed,
    errors,
    accuracy,
    wpm,
    startGame,
    resetEngine,
    handleInput,
  };
};

export default useTypingEngine;