import { memo, useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// --- 1. The Refined Liquid Caret ---
const Caret = ({ top, left, height }: { top: number; left: number; height: number }) => {
  return (
    <motion.div
      initial={false}
      animate={{ top, left, height }}
      transition={{ 
        type: "spring", 
        stiffness: 450, // Slightly snappier
        damping: 30,    
        mass: 0.4       
      }}
      // Updates:
      // 1. w-0.5 (2px) instead of w-1 (4px) -> cleaner line on mobile
      // 2. animate-pulse -> helps you find it if you get lost
      className="absolute w-0.5 md:w-1 bg-yellow-400 rounded-full z-10 shadow-[0_0_8px_1px_rgba(250,204,21,0.6)] animate-pulse"
      style={{ pointerEvents: 'none' }} 
    />
  );
};

// --- 2. The Character Component ---
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

  useEffect(() => {
    if (isActive && charRef.current) {
      charRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "nearest"
      });
    }
  }, [isActive]);

  // Removed 'leading' classes here to let the parent control spacing more predictably
  let classes = "relative font-mono text-2xl md:text-3xl lg:text-4xl transition-colors duration-200 ";

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
      {/* The Marker: We place this explicitly to help us calculate position.
         We define height here to ensure the caret matches the FONT size, not the bounding box.
      */}
      {isActive && <span id="active-caret-marker" className="absolute left-0 top-0 bottom-0 w-full -z-10 opacity-0" />}
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

        // MATH FIX: Clean up the geometry
        // 1. Height: Scale it to 75% of the line height so it doesn't touch lines above/below
        const refinedHeight = markerRect.height * 0.75;
        
        // 2. Top: Center it vertically relative to the line
        const offsetY = (markerRect.height - refinedHeight) / 2;
        
        // 3. Left: No negative offset (-2px) on mobile. Stick to the edge.
        // We use a tiny -1px just to overlap the very edge of the letter's box
        const refinedLeft = markerRect.left - containerRect.left - 1;

        setCaretPos({
          top: (markerRect.top - containerRect.top) + offsetY,
          left: refinedLeft,
          height: refinedHeight
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
      
      {/* Caret Layer */}
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

      {/* Text Layer */}
      <div 
        ref={containerRef}
        // Added leading-relaxed here to enforce consistent line height for the whole block
        className="leading-relaxed break-words select-none pointer-events-none text-left max-h-[250px] overflow-hidden relative p-1"
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