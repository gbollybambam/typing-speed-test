import { useState } from 'react';
import { getRandomPassage } from './utils/textgenerator.ts';
import useTypingEngine from './hooks/useTypingEngine.ts';

function App() {
  // Test state to hold our text
  const [text, setText] = useState(getRandomPassage('medium').text);

  // Initialize the hook
  const { status, timeLeft, startGame } = useTypingEngine(60);

  return (
    <div className="min-h-screen bg-neutral-900 text-neutral-0 flex flex-col items-center justify-center p-8 gap-6">
      <h1 className="text-3xl font-bold text-yellow-400">
        Typing Speed Test
      </h1>
      
      {/* Display Timer and Status */}
      <div className='flex gap-8 text-2xl font mono'>
        <p>Time: <span className='text-blue-400'>{timeLeft}s</span></p>
        <p>Status: <span className='text-green-500'>{ status }</span></p>
      </div>

      {/* Display the text to ensure font and colors work */}
      <p className="max-w-2xl text-lg leading-relaxed text-neutral-400 text-center">
        {text}
      </p>

      {/* Button now triggers the hook's startGame function */}
      <button 
        onClick={startGame}
        className="px-6 py-3 bg-blue-600 rounded-lg font-semibold hover:bg-blue-400 transition-colors cursor-pointer"
      >
        Start Test
      </button>
    </div>
  )
};

export default App;