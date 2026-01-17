import { memo, useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// --- 1. The Liquid Caret Component ---
const Caret = ({ top, left, height }: { top: number; left: number; height: number }) => {
  return (
    <motion.div
      initial={false}
      animate={{ top, left, height }}
      transition={{ 
        type: "spring", 
        stiffness: 400, 
        damping: 28,    
        mass: 0.5       
      }}
      className="absolute w-1 bg-yellow-400 rounded-full z-10 shadow-[0_0_10px_2px_rgba(250,204,21,0.5)]"
      style={{ pointerEvents: 'none' }} 
    />
  );
};

// --- 2. The Single Character Component ---
const Character = memo(({ 
  char, 
  status, 
  isActive 
}: { 
  char: string; 
  status: 'correct' | 'error' | 'pending'; 
  isActive: boolean 
}) => {
  const charRef = useRef<HTMLSpanElement>(null);

  // Auto-scroll logic
  useEffect(() => {
    if (isActive && charRef.current) {
      charRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "nearest"
      });
    }
  }, [isActive]);

  let classes = "relative font-mono text-2xl md:text-3xl lg:text-4xl leading-relaxed md:leading-loose transition-colors duration-200 ";

  // ✅ FIX: Restored the Green color for correct characters
  if (status === 'correct') {
    classes += "text-green-500"; 
  } else if (status === 'error') {
    classes += "text-red-500 underline decoration-2 underline-offset-4 decoration-red-500 bg-red-500/10 rounded-sm";
  } else {
    classes += "text-neutral-600"; 
  }

  return (
    <span ref={charRef} className={classes}>
      {char}
      {/* Invisible Marker for Caret Position */}
      {isActive && <span id="active-caret-marker" className="absolute left-0 top-1 bottom-1 w-full -z-10 opacity-0" />}
    </span>
  );
}, (prev, next) => {
  return prev.status === next.status && prev.isActive === next.isActive && prev.char === next.char;
});

// --- 3. The Main Area ---
interface TypingAreaProps {
  text: string;
  typed: string;
}

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

        setCaretPos({
          top: markerRect.top - containerRect.top,
          left: markerRect.left - containerRect.left - 2, 
          height: markerRect.height
        });
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
      
      {/* The Floating Caret Layer */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <AnimatePresence>
          {showCaret && (
            <Caret 
              top={caretPos.top} 
              left={caretPos.left} 
              height={caretPos.height} 
            />
          )}
        </AnimatePresence>
      </div>

      {/* The Text Layer */}
      <div 
        ref={containerRef}
        className="wrap-break-words select-none pointer-events-none text-left max-h-62.5 overflow-hidden relative p-1"
      >
        {text.split('').map((char, index) => {
          const isTyped = index < typed.length;
          const isCorrect = isTyped && typed[index] === char;
          const isError = isTyped && !isCorrect;
          const isActive = index === typed.length;
          
          let status: 'correct' | 'error' | 'pending' = 'pending';
          if (isCorrect) status = 'correct';
          if (isError) status = 'error';

          return (
            <Character 
              key={index} 
              char={char} 
              status={status} 
              isActive={isActive} 
            />
          );
        })}
      </div>
    </div>
  );
};

export default memo(TypingArea);