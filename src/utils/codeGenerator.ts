export type CodeLanguage = 'javascript' | 'python' | 'css';

export interface CodeSnippet {
  id: number;
  language: CodeLanguage;
  code: string;
}

const snippets: CodeSnippet[] = [
  // --- JAVASCRIPT / REACT ---
  { id: 1, language: 'javascript', code: "const [state, setState] = useState(null);" },
  { id: 2, language: 'javascript', code: "export default function App() { return <div />; }" },
  { id: 3, language: 'javascript', code: "array.reduce((acc, curr) => acc + curr, 0);" },
  { id: 4, language: 'javascript', code: "document.querySelector('.btn').addEventListener('click', () => {});" },
  { id: 5, language: 'javascript', code: "const { data, error } = useSWR('/api/user', fetcher);" },
  { id: 6, language: 'javascript', code: "return new Promise((resolve) => setTimeout(resolve, 1000));" },
  { id: 7, language: 'javascript', code: "import { useEffect, useCallback, useMemo } from 'react';" },
  { id: 8, language: 'javascript', code: "const copy = [...original, { ...newItem }];" },
  { id: 9, language: 'javascript', code: "JSON.stringify(value, null, 2);" },
  { id: 10, language: 'javascript', code: "const filtered = list.filter(item => item.isActive);" },
  { id: 11, language: 'javascript', code: "async function fetchData() { const res = await fetch(url); }" },
  { id: 12, language: 'javascript', code: "module.exports = { extends: ['eslint:recommended'] };" },
  { id: 13, language: 'javascript', code: "const sorted = items.sort((a, b) => a.id - b.id);" },
  { id: 14, language: 'javascript', code: "localStorage.setItem('theme', 'dark');" },
  { id: 15, language: 'javascript', code: "const { id } = useParams();" },

  // --- PYTHON ---
  { id: 16, language: 'python', code: "def __init__(self, name): self.name = name" },
  { id: 17, language: 'python', code: "numbers = [x for x in range(10) if x % 2 == 0]" },
  { id: 18, language: 'python', code: "with open('file.txt', 'r') as f: content = f.read()" },
  { id: 19, language: 'python', code: "if __name__ == '__main__': main()" },
  { id: 20, language: 'python', code: "import pandas as pd; df = pd.read_csv('data.csv')" },
  { id: 21, language: 'python', code: "try: result = 10 / 0 except ZeroDivisionError: pass" },
  { id: 22, language: 'python', code: "class Dog(Animal): def speak(self): return 'Woof'" },
  { id: 23, language: 'python', code: "lambda x: x * 2" },
  { id: 24, language: 'python', code: "print(f'Hello, {name}!')" },
  { id: 25, language: 'python', code: "data = {'key': 'value', 'list': [1, 2, 3]}" },
  { id: 26, language: 'python', code: "def factorial(n): return 1 if n == 0 else n * factorial(n-1)" },
  { id: 27, language: 'python', code: "from flask import Flask, jsonify, request" },

  // --- CSS ---
  { id: 28, language: 'css', code: "display: grid; grid-template-columns: repeat(3, 1fr);" },
  { id: 29, language: 'css', code: "@media (min-width: 768px) { .container { padding: 2rem; } }" },
  { id: 30, language: 'css', code: "background: linear-gradient(45deg, #ff00cc, #333399);" },
  { id: 31, language: 'css', code: "transform: translate(-50%, -50%) scale(0.95);" },
  { id: 32, language: 'css', code: "justify-content: center; align-items: center;" },
  { id: 33, language: 'css', code: ":root { --primary-color: #3b82f6; --text: #1f2937; }" },
  { id: 34, language: 'css', code: "box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);" },
  { id: 35, language: 'css', code: "animation: spin 1s linear infinite;" },
  { id: 36, language: 'css', code: ".card:hover { transform: translateY(-5px); }" },
  { id: 37, language: 'css', code: "z-index: 9999; position: fixed; top: 0;" },
  { id: 38, language: 'css', code: "flex-direction: column; gap: 1.5rem;" },
];

export const getRandomCodeSnippet = (language: CodeLanguage): string => {
  const filtered = snippets.filter(s => s.language === language);
  const randomIndex = Math.floor(Math.random() * filtered.length);
  return filtered[randomIndex].code;
};