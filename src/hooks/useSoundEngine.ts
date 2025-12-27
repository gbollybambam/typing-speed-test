import { useCallback, useRef, useState } from 'react';

export default function useSoundEngine() {
  const [isMuted, setIsMuted] = useState(false);
  
  // We use refs to keep the audio objects in memory without re-rendering
  const clickRef = useRef<HTMLAudioElement | null>(null);
  const errorRef = useRef<HTMLAudioElement | null>(null);
  const successRef = useRef<HTMLAudioElement | null>(null);

  // Initialize sounds (Lazy load)
  const loadSounds = useCallback(() => {
    if (!clickRef.current) {
      clickRef.current = new Audio('/sounds/click.wav');
      clickRef.current.volume = 0.5; // Subtle volume
    }
    if (!errorRef.current) {
      errorRef.current = new Audio('/sounds/error.wav');
      errorRef.current.volume = 0.4;
    }
    if (!successRef.current) {
      successRef.current = new Audio('/sounds/success.mp3');
      successRef.current.volume = 0.6;
    }
  }, []);

  const playClick = useCallback(() => {
    if (isMuted) return;
    loadSounds();
    if (clickRef.current) {
      // Reset time to 0 to allow rapid fire typing
      clickRef.current.currentTime = 0;
      clickRef.current.play().catch(() => {}); // Catch error if user hasn't interacted yet
    }
  }, [isMuted, loadSounds]);

  const playError = useCallback(() => {
    if (isMuted) return;
    loadSounds();
    if (errorRef.current) {
      errorRef.current.currentTime = 0;
      errorRef.current.play().catch(() => {});
    }
  }, [isMuted, loadSounds]);

  const playSuccess = useCallback(() => {
    if (isMuted) return;
    loadSounds();
    if (successRef.current) {
      successRef.current.currentTime = 0;
      successRef.current.play().catch(() => {});
    }
  }, [isMuted, loadSounds]);

  const toggleMute = useCallback(() => {
    setIsMuted(prev => !prev);
  }, []);

  return { playClick, playError, playSuccess, isMuted, toggleMute };
}