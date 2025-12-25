import { useState, useRef, useEffect } from 'react'; // Import useRef
import { getRandomPassage, type Difficulty } from './utils/textGenerator';
import useTypingEngine from './hooks/useTypingEngine';
import useLocalStorage from './hooks/useLocalStorage';

function App() {
  const [timeOption, setTimeOption] = useState(60);
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [text, setText] = useState(getRandomPassage(difficulty).text);
  const [highScore, setHighScore] = useLocalStorage<number>('typing-speed-high-score', 0);

  const { status, timeLeft, typed, wpm, accuracy, startGame, handleInput, resetEngine } = useTypingEngine(timeOption);
  
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (status === 'running' && inputRef.current) {
      inputRef.current.focus();
    }
  }, [status]);

  useEffect(() => {
    if (status === 'finished') {
      if (wpm > highScore) {
        setHighScore(wpm);
      }
    }
  }, [status, wpm, highScore, setHighScore]);


  useEffect(() => {
    resetEngine();
  }, [timeOption, resetEngine]);

  const handleDifficultyChange = (newDifficulty: Difficulty) => {
    setDifficulty(newDifficulty);
    setText(getRandomPassage(newDifficulty).text);
    resetEngine();
  };


  return (
    <div className="min-h-screen bg-neutral-900 text-neutral-0 flex flex-col items-center justify-center p-8 gap-6">
      <div className="flex w-full max-w-2xl justify-between items-end mb-8">
        <h1 className="text-3xl font-bold text-yellow-400">
          Typing Speed Test
        </h1>
        <div className="flex items-center gap-2 text-neutral-400 font-mono">
          <span>🏆 Best:</span>
          <span className="text-xl font-bold text-yellow-400">{highScore}</span>
          <span>WPM</span>
        </div>
      </div>

      {/* --- NEW: Settings Controls --- */}
      <div className="flex gap-4 p-4 bg-neutral-800 rounded-lg">
        {/* Difficulty Select */}
        <select 
          value={difficulty} 
          onChange={(e) => handleDifficultyChange(e.target.value as Difficulty)}
          className="bg-neutral-700 p-2 rounded text-white"
          disabled={status === 'running'}
        >
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>

        {/* Time Select */}
        <select 
          value={timeOption} 
          onChange={(e) => {
            const val = Number(e.target.value);
            setTimeOption(val);
          }}
          className="bg-neutral-700 p-2 rounded text-white"
          disabled={status === 'running'}
        >
          <option value="30">30s</option>
          <option value="60">60s</option>
          <option value="120">120s</option>
        </select>
      </div>

      {/* Stats Bar */}
      <div className="flex gap-12 text-3xl font-mono font-bold">
        <div className="flex flex-col items-center">
          <span className="text-neutral-500 text-sm uppercase tracking-wider">WPM</span>
          <span className="text-neutral-0">{wpm}</span>
        </div>

        <div className="flex flex-col items-center">
          <span className="text-neutral-500 text-sm uppercase tracking-wider">Accuracy</span>
          <span className={accuracy < 80 ? "text-red-500" : "text-neutral-0"}>
            {accuracy}%
          </span>
        </div>

        <div className="flex flex-col items-center">
          <span className="text-neutral-500 text-sm uppercase tracking-wider">Time</span>
          <span className="text-blue-400">
               {status === 'idle' ? timeOption : timeLeft}
             </span>
        </div>
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
  );
}

export default App;