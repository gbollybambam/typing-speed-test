interface TypingAreaProps {
  text: string;
  typed: string;
  className?: string;
}

const TypingArea = ({ text, typed, className = "" }: TypingAreaProps) => {
  return (
    <div className={`relative w-full max-w-5xl text-2xl md:text-3xl leading-relaxed font-medium tracking-wide text-neutral-500 break-words ${className}`}>
      {text.split('').map((char, index) => {
        const charTyped = typed[index];
        let color = 'text-neutral-600'; // Default (upcoming text)
        let decoration = '';
        let bg = '';

        // Color Logic
        if (charTyped != null) {
          if (charTyped === char) {
            color = 'text-green-500';
          } else {
            color = 'text-red-500';
            decoration = 'underline decoration-2 underline-offset-4';
            bg = 'bg-red-500/10'; // Subtle background for errors
          }
        }

        // Cursor Logic: The character we are currently trying to type
        const isCurrent = index === typed.length;

        return (
          <span 
            key={index} 
            className={`
              ${color} 
              ${decoration} 
              ${bg} 
              ${isCurrent ? 'bg-yellow-400 text-neutral-900 animate-pulse rounded-sm px-0.5' : ''}
              transition-colors duration-75
            `}
          >
            {char}
          </span>
        );
      })}
    </div>
  );
};

export default TypingArea;