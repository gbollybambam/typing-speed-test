# ⌨️ TypeMaster - Ultimate Typing Speed Test

![Design Preview](./src/assets/images/desktop-preview.jpg)

> **Note to Judges:** This is my submission for the **Frontend Mentor FM30 Hackathon**. I went beyond the basic requirements to build a "Pro-Tier" tool for developers, featuring **Code Syntax Practice**, **Visual Analytics**, and **Social Certificates**.

## 🔗 Links

-   **Live Site URL:** [https://typing-speed-test-blik.vercel.app/](https://typing-speed-test-blik.vercel.app/)
-   **Repo URL:** [https://github.com/gbollybambam/typing-speed-test](https://github.com/gbollybambam/typing-speed-test)

## 📝 The Challenge

The goal was to build a functional Typing Speed Test app that tracks **Words Per Minute (WPM)**, **Accuracy**, and **Characters**.

**Core Requirements:**
-   Real-time typing feedback (Green for correct, Red for errors).
-   Calculate WPM and Accuracy dynamically.
-   Filter by Difficulty (Easy, Medium, Hard).
-   Responsiveness (Mobile & Desktop).
-   Persist High Score using `localStorage`.

**✨ My "Pro" Features:**
-   **👨‍💻 Code Mode:** Practice typing actual **JavaScript, Python, and CSS** syntax instead of just random English words. Great for developers!
-   **🌗 Dynamic Theming:** A robust Light/Dark mode system built with semantic CSS variables.
-   **📸 Social Certificates:** Generates a downloadable, high-quality PNG "Certificate" of your result to share on social media.
-   **📈 Visual Analytics:** A real-time graph showing your WPM performance curve over the duration of the test.
-   **📜 History Drawer:** A mobile-optimized side drawer to browse your last 10 test results.
-   **🔊 Sound Engine:** Mechanical keyboard sounds (Click/Clack) for tactile feedback.
-   **⚡ Mobile Guard:** Disabled mobile auto-correct and capitalization for a raw, competitive input experience.

---

## 🛠️ Built With

-   **React 18** - Component-based UI architecture.
-   **TypeScript** - Strict type safety for the typing engine logic.
-   **Vite** - Lightning-fast build tool.
-   **Tailwind CSS (v4)** - Styling with the new `@theme` and CSS variables.
-   **Framer Motion** - Smooth animations for the caret, modals, and history drawer.
-   **Recharts** - For rendering the WPM performance graph.
-   **html-to-image** - For generating the downloadable result certificates.

---

## 🧠 My Process

### 1. The Architecture (Custom Hooks)
I separated logic from UI using a custom `useTypingEngine` hook. This handles:
-   Keystroke validation & WPM calculation.
-   Timer state management (`idle` -> `running` -> `finished`).
-   **Code Mode Support:** Handling special characters (`{`, `}`, `;`) and indentation differently than standard text.

### 2. Theming with Semantic Variables
Instead of hardcoding colors (e.g., `bg-neutral-900`), I architected a **Semantic Variable System** in CSS:
```css
:root {
  --bg-primary: hsl(0, 0%, 7%);
  --text-primary: hsl(0, 0%, 100%);
  --accent: hsl(49, 85%, 70%);
}
[data-theme="light"] {
  --bg-primary: hsl(0, 0%, 96%);
  --text-primary: hsl(0, 0%, 7%);
  --accent: hsl(49, 100%, 40%);
}

### 3. Generating Result Images
One of the hardest challenges was creating the "Download Image" feature.

Problem: I couldn't just take a screenshot of the modal because it has buttons and scrollbars.

Solution: I created a hidden component <ResultCard /> that renders off-screen. When the user clicks "Download", I use html-to-image to target that specific hidden node, convert it to a Blob, and trigger a browser download. This ensures the shared image is always pixel-perfect, regardless of the user's screen size.

### 4. Solving the "Rules of Hooks"
During development, I encountered a critical React error: "Rendered more hooks than during the previous render."

Cause: I had a conditional return if (status !== 'finished') return null; placed before my useCallback hooks.

Fix: I learned that all hooks must run unconditionally. I moved all logic and hooks to the top of the component and placed the conditional return statement at the very bottom, just before the JSX render.

### 5. Mobile-First History Drawer
For the history feature, a standard modal felt cramped on mobile.

Design Decision: I implemented a Side Drawer pattern. On mobile, it slides in from the right, taking up 100% of the height, making it easy to scroll through history with a thumb. On desktop, it behaves like a sleek sidebar.

---

## 📚 What I Learned

Coming from a Pure Mathematics background, I enjoyed the logic behind the WPM calculation. However, this project pushed me to master Browser APIs:

AudioContext: Managing low-latency sound playback.

Clipboard API: Writing text to the user's clipboard for sharing.

Canvas/Blob API: Converting DOM nodes into PNG images.

It also taught me the importance of Layout Stability. Adding the Light Mode initially broke some contrast ratios, forcing me to audit every single color usage and standardize them into my index.css variables.

---

## 🔮 Continued Development

In the future, I plan to:

Backend Integration: Connect to a Django/PostgreSQL backend to save user history permanently.

Global Leaderboard: Allow users to compete for the top spot on a daily/weekly basis.

Multiplayer: Real-time 1v1 typing races using WebSockets.

---

## 🚀 Setup Project Locally

1.  **Clone the repository**
    ```bash
    git clone [https://github.com/gbollybambam/typing-speed-test.git](https://github.com/gbollybambam/typing-speed-test.git)
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