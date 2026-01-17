import { memo, useRef, useEffect } from 'react';

// 1. Extract the Single Character Component
// We wrap this in 'memo' so it ONLY re-renders if its specific state changes.
const Character = memo(({ 
  char, 
  status, 
  isCursor 
}: { 
  char: string; 
  status: 'correct' | 'error' | 'pending'; 
  isCursor: boolean 
}) => {
  const cursorRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (isCursor && cursorRef.current) {
      // smooth scroll into view
      cursorRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "nearest" // Prevents horizontal jumping
      });
    }
  }, [isCursor]);

  let classes = "transition-colors duration-75 relative font-mono "; // Added font-mono for better spacing

  if (status === 'correct') {
    classes += "text-green-500";
  } else if (status === 'error') {
    classes += "text-red-500 underline decoration-2 underline-offset-4 decoration-red-500 bg-red-500/10 rounded-sm";
  } else if (isCursor) {
    classes += "text-neutral-100 border-l-2 border-yellow-400 animate-pulse pl-[1px]";
  } else {
    classes += "text-neutral-500";
  }

  return (
    <span ref={isCursor ? cursorRef : null} className={classes}>
      {char}
    </span>
  );
}, (prev, next) => {
  // Custom comparison for maximum performance:
  // Only re-render if status changes or cursor state changes
  return prev.status === next.status && prev.isCursor === next.isCursor && prev.char === next.char;
});

interface TypingAreaProps {
  text: string;
  typed: string;
}

const TypingArea = ({ text, typed }: TypingAreaProps) => {
  // We don't need the containerRef scroll logic anymore because 
  // the Character component handles its own "scrollIntoView" 
  
  return (
    <div className="w-full px-1">
      <div 
        className="font-medium text-2xl md:text-3xl lg:text-4xl leading-relaxed md:leading-loose tracking-wide break-words select-none pointer-events-none text-left max-h-[250px] overflow-hidden relative"
      >
        {text.split('').map((char, index) => {
          const isTyped = index < typed.length;
          const isCorrect = isTyped && typed[index] === char;
          const isError = isTyped && !isCorrect;
          
          let status: 'correct' | 'error' | 'pending' = 'pending';
          if (isCorrect) status = 'correct';
          if (isError) status = 'error';

          const isCursor = index === typed.length;

          return (
            <Character 
              key={index} 
              char={char} 
              status={status} 
              isCursor={isCursor} 
            />
          );
        })}
      </div>
    </div>
  );
};

export default memo(TypingArea);