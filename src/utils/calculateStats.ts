export const calculateAccuracy = (totalTyped: number, errors: number): number => {
    if (totalTyped === 0) return 100;

    const correctTyped = totalTyped - errors;
    const accuracy = (correctTyped / totalTyped) * 100;

    return Math.max(0, Math.round(accuracy));
};


export const calculateWPM = (
    correctCharCount: number,
    timeElapsedSeconds: number
): number => {
    if (timeElapsedSeconds === 0) return 0;

    const words = correctCharCount / 5;
    const minutes = timeElapsedSeconds / 60;

    const wpm = words / minutes;

    return Math.round(wpm);
};