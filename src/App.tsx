import { useState, useRef, useEffect } from 'react'; // Import useRef
import { getRandomPassage } from './utils/textGenerator';
import useTypingEngine from './hooks/useTypingEngine';

function App() {
  const [text, setText] = useState(getRandomPassage('medium').text);
  
  // Grab the new handler
  const { status, timeLeft, typed, errors, startGame, handleInput } = useTypingEngine(60);
  
  // Create a reference to the hidden input so we can focus it
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input automatically when game starts
  useEffect(() => {
    if (status === 'running' && inputRef.current) {
      inputRef.current.focus();
    }
  }, [status]);

  return (
    <div className="min-h-screen bg-neutral-900 text-neutral-0 flex flex-col items-center justify-center p-8 gap-6">
      <h1 className="text-3xl font-bold text-yellow-400">
        Typing Speed Test
      </h1>
      
      {/* Stats Bar */}
      <div className="flex gap-8 text-2xl font-mono">
        <p>Time: <span className="text-blue-400">{timeLeft}s</span></p>
        <p>Errors: <span className="text-red-500">{errors}</span></p>
      </div>

      {/* The Text Display Area */}
      <div 
        className="relative max-w-2xl text-lg leading-relaxed bg-neutral-800 p-6 rounded-xl cursor-text"
        onClick={() => inputRef.current?.focus()} // Clicking text focuses input
      >
        {/* Render Text with Colors */}
        {text.split('').map((char, index) => {
          const charTyped = typed[index];
          let color = 'text-neutral-400'; // Default gray

          if (charTyped != null) {
            color = charTyped === char ? 'text-green-500' : 'text-red-500';
          }
          
          return (
            <span key={index} className={color}>{char}</span>
          );
        })}
      </div>

      {/* Hidden Input Field - The Secret Sauce */}
      <input
        ref={inputRef}
        type="text"
        className="absolute opacity-0 w-0 h-0" // Hide it visually but keep it functional
        value={typed}
        onChange={(e) => handleInput(e, text)}
        autoFocus
      />

      <button 
        onClick={startGame}
        className="px-6 py-3 bg-blue-600 rounded-lg font-semibold hover:bg-blue-400 transition-colors cursor-pointer"
      >
        {status === 'idle' ? 'Start Test' : 'Restart'}
      </button>
    </div>
  )
}

export default App;