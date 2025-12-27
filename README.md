# ⌨️ Typing Speed Test - FM30 Hackathon Submission

![Design Preview](./src/assets/images/desktop-preview.jpg)

> **Note to Judges:** This is my submission for the **Frontend Mentor FM30 Hackathon**. I focused heavily on "Mobile-First" performance and creating a "Game-like" feel with sound effects and animations.

## 🔗 Links

-   **Live Site URL:** [Add your Vercel/Netlify Link Here]
-   **Frontend Mentor Solution:** [Add your FM Solution Link Here]

## 📝 The Challenge

The goal was to build a functional Typing Speed Test app that tracks **Words Per Minute (WPM)**, **Accuracy**, and **Characters**.

**Core Requirements:**
-   Real-time typing feedback (Green for correct, Red for errors).
-   Calculate WPM and Accuracy dynamically.
-   Filter by Difficulty (Easy, Medium, Hard).
-   Responsiveness (Mobile & Desktop).
-   Persist High Score using `localStorage`.

**✨ My Extra Features:**
-   **Sound Engine:** Mechanical keyboard clicks, error thuds, and victory chimes.
-   **Auto-Scroll:** The text area automatically scrolls to keep the active line centered (crucial for long passages).
-   **Mobile Guard:** Disabled mobile auto-correct, capitalization, and suggestions for a raw input experience.
-   **Confetti Celebration:** A visual reward for breaking a high score.
-   **Extended Modes:** Added 30s, 60s, 120s options alongside the standard Passage mode.

---

## 🛠️ Built With

-   **React 18** - For component-based UI architecture.
-   **TypeScript** - For type safety, especially with the intricate Typing Engine logic.
-   **Vite** - For lightning-fast development and build.
-   **Tailwind CSS** - For pixel-perfect styling and complex responsive layouts.
-   **HTML5 Audio API** - For the custom sound engine.
-   **Figma** - Followed the design system strictly for pixel perfection.

---

## 🧠 My Process

### 1. The Architecture (Custom Hooks)
I decided early on to separate the logic from the UI. I built a custom hook `useTypingEngine.ts` that handles:
-   Keystroke validation.
-   WPM calculation (Standardized: 5 characters = 1 word).
-   Timer state management.
-   Status transitions (`idle` -> `running` -> `finished`).

This made the `App.tsx` component clean and focused purely on layout composition.

### 2. The Sound Engine
A typing test feels "dead" without feedback. I created a `useSoundEngine.ts` hook using `useCallback` to preload audio files (`click.wav`, `error.wav`).
* **Challenge:** Audio lag on rapid typing.
* **Solution:** I reset `audio.currentTime = 0` before every play call to ensure instant feedback even when typing 100+ WPM.

### 3. Solving the "Mobile Keyboard" Problem
Testing on my phone revealed a huge issue: Auto-correct would change "teh" to "the", ruining the accuracy score.
* **Solution:** I implemented aggressive input guarding on the hidden input field:
    ```jsx
    <input
      autoComplete="off"
      autoCorrect="off"
      autoCapitalize="off"
      spellCheck="false"
    />
    ```
    This forces the mobile keyboard into a "dumb" mode, perfect for speed testing.

### 4. Auto-Scrolling Logic
For the "Passage" mode, the text often exceeded the visible container. I used React `refs` to track the active character's position relative to the container.
* **Math:** `cursorTop - (containerHeight / 2) + offset`
* **Result:** The text smoothly scrolls to keep the user's eyes focused on the center of the screen.

### 5. Pixel-Perfect Responsiveness
The design for Desktop and Mobile was drastically different.
* **Mobile:** Uses a stacked layout with Dropdown menus for controls.
* **Desktop:** Uses a Dashboard layout with "Pill-shaped" inline buttons.
* I used Tailwind's `md:` and `lg:` breakpoints to completely swap navigation styles based on the viewport, ensuring the app looks native on both devices.

---

## 📚 What I Learned

Coming from a **Pure Mathematics** background, I enjoyed the logic behind the WPM calculation and the state management of the timer.

However, the biggest takeaway was **DOM manipulation via Refs**. Building the Auto-Scroll feature required me to calculate offset positions of specific `span` elements dynamically. It gave me a much deeper appreciation for how the browser renders layout.

I also learned the importance of **Z-Index management**. I initially had the Results Modal conflict with the Header. Debugging the stacking context taught me how to properly layer UI elements (Header `z-50` > Modal `z-40` > Content `z-0`).

---

## 🔮 Continued Development

In the future, I plan to:
1.  **Backend Integration:** Connect this to a Django REST Framework (DRF) backend to save user history permanently, not just in LocalStorage.
2.  **Multiplayer Mode:** Use WebSockets to allow users to race against each other in real-time.

---

## 🚀 Setup Project Locally

1.  **Clone the repository**
    ```bash
    git clone [your-repo-link]
    cd typing-speed-test
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Run the development server**
    ```bash
    npm run dev
    ```

---

## 👤 Author

-   **Frontend Mentor** - [@gbollybambam](https://www.frontendmentor.io/profile/gbollybambam)
-   **GitHub** - [@gbollybambam](https://github.com/gbollybambam)
