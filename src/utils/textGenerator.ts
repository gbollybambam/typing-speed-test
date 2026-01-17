import data from '../data/data.json';

// 1. Define the shape of a single passage
export interface Passage {
    id: string;
    text: string;
}

// 2. Define valid difficulty levels
export type Difficulty = 'easy' | 'medium' | 'hard';

// 3. Define the shape of the entire JSON file
interface Data {
    easy: Passage[];
    medium: Passage[];
    hard: Passage[];
    [key: string]: Passage[];
}

// Cast the imported JSON to our Data type
const passageData = data as Data;

export const getRandomPassage = (difficulty: Difficulty = 'easy'): Passage => {
    // Select the array based on difficulty
    const passages = passageData[difficulty]

    // Fallback check: if something goes wrong, return the first easy passage
    if (!passages || passages.length === 0) {
        console.error(`No passages found for difficulty: ${difficulty}`);
        return passageData['easy'][0];
    }

    const randomIndex = Math.floor(Math.random() * passages.length);
    return passages[randomIndex];
};