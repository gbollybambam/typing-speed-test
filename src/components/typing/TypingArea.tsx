import { useMemo, useRef, useEffect } from 'react';

interface TypingAreaProps {
  text: string;
  typed: string;
}

const TypingArea = ({ text, typed }: TypingAreaProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLSpanElement>(null);

  // Auto-Scroll Logic
  useEffect(() => {
    if (containerRef.current && cursorRef.current) {
      const container = containerRef.current;
      const cursor = cursorRef.current;

      // Calculate where the cursor is relative to the container
      const cursorTop = cursor.offsetTop;
      const containerHeight = container.clientHeight;
      const scrollOffset = cursorTop - (containerHeight / 2) + 20; // +20 centers it nicely visually

      // Scroll the container smoothly
      container.scrollTo({
        top: Math.max(0, scrollOffset),
        behavior: 'smooth'
      });
    }
  }, [typed]); // Re-run every time the user types a character

  const renderedText = useMemo(() => {
    return text.split('').map((char, index) => {
      const isTyped = index < typed.length;
      const isCorrect = isTyped && typed[index] === char;
      const isError = isTyped && !isCorrect;
      const isCursor = index === typed.length;

      // Base classes
      let classes = "transition-colors duration-75 relative ";

      if (isCorrect) {
        classes += "text-green-500"; 
      } 
      else if (isError) {
        classes += "text-red-500 underline decoration-2 underline-offset-4 decoration-red-500 bg-red-500/10 rounded-sm";
      } 
      else if (isCursor) {
        classes += "text-neutral-100 border-l-2 border-yellow-400 animate-pulse pl-[1px]"; 
      } 
      else {
        classes += "text-neutral-500";
      }

      return (
        <span 
          key={index} 
          ref={isCursor ? cursorRef : null}
          className={classes}
        >
          {char}
        </span>
      );
    });
  }, [text, typed]);

  return (
    <div className="w-full px-1">

      <div 
        ref={containerRef}
        className="font-medium text-2xl md:text-3xl lg:text-4xl leading-relaxed md:leading-loose tracking-wide break-words select-none pointer-events-none text-left max-h-[250px] overflow-hidden relative"
      >
        {renderedText}
      </div>
    </div>
  );
};

export default TypingArea;