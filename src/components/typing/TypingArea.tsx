import { memo, useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// --- 1. The Refined Liquid Caret ---
const Caret = ({ top, left, height }: { top: number; left: number; height: number }) => {
  return (
    <motion.div
      initial={false}
      animate={{ top, left, height }}
      transition={{ type: "spring", stiffness: 450, damping: 30, mass: 0.4 }}
      // Uses var(--accent) so it is Yellow in Dark Mode and Darker Yellow in Light Mode
      className="absolute w-0.5 md:w-1 bg-[var(--accent)] rounded-full z-10 shadow-[0_0_8px_1px_var(--accent)] animate-pulse"
      style={{ pointerEvents: 'none' }} 
    />
  );
};

// --- 2. The Character Component ---
const Character = memo(({ char, status, isActive }: { char: string; status: 'correct' | 'error' | 'pending'; isActive: boolean }) => {
  const charRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (isActive && charRef.current) {
      charRef.current.scrollIntoView({ behavior: "smooth", block: "center", inline: "nearest" });
    }
  }, [isActive]);

  let classes = "relative font-mono text-2xl md:text-3xl lg:text-4xl transition-colors duration-200 ";

  if (status === 'correct') {
    // ✅ FIX: Restored the Green color for correct characters
    classes += "text-green-500"; 
  } else if (status === 'error') {
    // Uses var(--error) so it adapts to Light/Dark mode automatically
    classes += "text-[var(--error)] underline decoration-2 underline-offset-4 decoration-[var(--error)] bg-[var(--error)]/10 rounded-sm";
  } else {
    // Untyped text
    classes += "text-[var(--text-secondary)] opacity-60"; 
  }

  return (
    <span ref={charRef} className={classes}>
      {char}
      {isActive && <span id="active-caret-marker" className="absolute left-0 top-0 bottom-0 w-full -z-10 opacity-0" />}
    </span>
  );
}, (prev, next) => prev.status === next.status && prev.isActive === next.isActive && prev.char === next.char);

// --- 3. The Main Area ---
interface TypingAreaProps { text: string; typed: string; }

const TypingArea = ({ text, typed }: TypingAreaProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [caretPos, setCaretPos] = useState({ top: 0, left: 0, height: 0 });
  const [showCaret, setShowCaret] = useState(false);

  useEffect(() => {
    const updateCaretPosition = () => {
      const marker = document.getElementById('active-caret-marker');
      const container = containerRef.current;
      if (marker && container) {
        const markerRect = marker.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();
        const refinedHeight = markerRect.height * 0.75;
        const offsetY = (markerRect.height - refinedHeight) / 2;
        const refinedLeft = markerRect.left - containerRect.left - 1;
        setCaretPos({ top: (markerRect.top - containerRect.top) + offsetY, left: refinedLeft, height: refinedHeight });
        setShowCaret(true);
      } else {
        setShowCaret(false);
      }
    };
    updateCaretPosition();
    window.addEventListener('resize', updateCaretPosition);
    return () => window.removeEventListener('resize', updateCaretPosition);
  }, [typed, text]); 

  return (
    <div className="w-full px-1 relative">
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <AnimatePresence>
          {showCaret && <Caret top={caretPos.top} left={caretPos.left} height={caretPos.height} />}
        </AnimatePresence>
      </div>
      <div ref={containerRef} className="leading-relaxed break-words select-none pointer-events-none text-left max-h-[250px] overflow-hidden relative p-1">
        {text.split('').map((char, index) => {
          const isTyped = index < typed.length;
          const isCorrect = isTyped && typed[index] === char;
          const isError = isTyped && !isCorrect;
          const isActive = index === typed.length;
          let status: 'correct' | 'error' | 'pending' = 'pending';
          if (isCorrect) status = 'correct';
          if (isError) status = 'error';
          return <Character key={index} char={char} status={status} isActive={isActive} />;
        })}
      </div>
    </div>
  );
};

export default memo(TypingArea);