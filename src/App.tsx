import { useState } from 'react';
import { getRandomPassage } from './utils/textGenerator';

function App() {
  // Test state to hold our text
  const [text, setText] = useState(getRandomPassage('medium').text);

  return (
    <div className="min-h-screen bg-neutral-900 text-neutral-0 flex flex-col items-center justify-center p-8 gap-6">
      <h1 className="text-3xl font-bold text-yellow-400">
        Typing Speed Test Data Check
      </h1>
      
      {/* Display the text to ensure font and colors work */}
      <p className="max-w-2xl text-lg leading-relaxed text-neutral-400 text-center">
        {text}
      </p>

      {/* Quick button to test randomization */}
      <button 
        onClick={() => setText(getRandomPassage('hard').text)}
        className="px-6 py-3 bg-blue-600 rounded-lg font-semibold hover:bg-blue-400 transition-colors cursor-pointer"
      >
        Load New Hard Passage
      </button>
    </div>
  )
}

export default App