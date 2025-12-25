import { useState, useEffect, useCallback } from 'react';
import { calculateAccuracy, calculateWPM } from '../utils/calculateStats';

// 1. Define the possible states of the game
export type GameStatus = 'idle' | 'running' | 'finished';

const useTypingEngine = (initialTime: number = 60) => {
  // Status: Is the game waiting, running, or done?
  const [status, setStatus] = useState<GameStatus>('idle');
  // Timer: How many seconds are left?
  const [timeLeft, setTimeLeft] = useState(initialTime);
  // Input: What has the user typed so far?
  const [typed, setTyped] = useState<string>('');
  // Errors: simple counter for now
  const [errors, setErrors] = useState(0);
  // Tracks every singlekey press (even backspaces) for accurracy math
  const [totalKeystrokes, setTotalKeystrokes] = useState(0);


  // 2. Helper to start the game
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

  // 3. Countdown Logic
  useEffect(() => {
    // Only run if the game is actually running
    if (status !== 'running') return;

    // set up theinterval to tick every 1 seconds (1000ms)
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

    // Logic: Did the user add a character or backspace?
    // We only increment errors if they added a NEW character that is wrong
    if (val.length > typed.length) {
      // User typed acharacter
      const charIndex = val.length - 1;
      const charTyped = val[charIndex];
      const charCorrect = targetText[charIndex];

      setTotalKeystrokes((prev) => prev + 1);

      if (charTyped !== charCorrect) {
        setErrors((prev) => prev + 1);
      }
    }

    // update the visual state
    setTyped(val);

    // Auto-finish if they typed typed the whole paragraph
    if (val.length === targetText.length) {
      stopGame();
    }

  }, [status, typed, startGame, stopGame]);

  const timeElapsed = initialTime - timeLeft;
  const accuracy = calculateAccuracy(totalKeystrokes, errors);
  const wpm = calculateWPM(typed.length, timeElapsed);

  // 4. Return these values so the Component can use them
  return {
    status,
    timeLeft,
    typed,
    errors,
    accuracy,
    wpm,
    startGame,
    handleInput,
  };
};

export default useTypingEngine;