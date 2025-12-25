import { useState, useEffect, useCallback } from 'react';

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

  // 2. Helper to start the game
  const startGame = useCallback(() => {
    setStatus('running');
    setTimeLeft(initialTime);
    setTyped('');
    setErrors(0);
  }, [initialTime]);

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
  }, [status])

  // 4. Return these values so the Component can use them
  return {
    status,
    timeLeft,
    typed,
    errors,
    startGame,
    setTyped, // We export this so the UI can update the input
  };
};

export default useTypingEngine;