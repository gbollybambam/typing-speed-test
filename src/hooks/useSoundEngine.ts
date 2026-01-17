import { useState, useCallback } from 'react';
import useSound from 'use-sound';

// Ensure these files exist in your public/sounds folder!
const SOUND_PATHS = {
  click: '/sounds/click.wav',
  error: '/sounds/error.wav',
  success: '/sounds/success.wav',
};

export default function useSoundEngine() {
  const [isMuted, setIsMuted] = useState(false);

  // 1. Setup the "Click" (Main typing sound)
  // 'interrupt: true' allows sounds to overlap (essential for fast typing)
  const [playClickRaw] = useSound(SOUND_PATHS.click, { 
    volume: 0.5,
    interrupt: true 
  });

  // 2. Setup Error sound (Slightly louder)
  const [playErrorRaw] = useSound(SOUND_PATHS.error, { 
    volume: 0.6,
    interrupt: true 
  });

  // 3. Setup Success sound
  const [playSuccessRaw] = useSound(SOUND_PATHS.success, { 
    volume: 0.7 
  });

  // --- Wrapper Functions with Logic ---

  const playClick = useCallback(() => {
    if (isMuted) return;
    
    // THE SECRET SAUCE: Randomize pitch slightly (0.95 to 1.05)
    // This makes it sound like a real mechanical keyboard, not a robot.
    const playbackRate = 0.95 + Math.random() * 0.1;
    
    playClickRaw({ playbackRate });
  }, [isMuted, playClickRaw]);

  const playError = useCallback(() => {
    if (isMuted) return;
    playErrorRaw();
  }, [isMuted, playErrorRaw]);

  const playSuccess = useCallback(() => {
    if (isMuted) return;
    playSuccessRaw();
  }, [isMuted, playSuccessRaw]);

  const toggleMute = useCallback(() => {
    setIsMuted(prev => !prev);
  }, []);

  return { playClick, playError, playSuccess, isMuted, toggleMute };
}