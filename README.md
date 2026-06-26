# AnimeGlow 🌟

An immersive, premium Cyberpunk and Anime-Inspired E-Commerce platform for teen skincare and exclusive faction merchandise. AnimeGlow merges futuristic tech aesthetics with functional utility, featuring interactive 3D product models, custom skincare diagnostic tools, responsive daily reward engines, and a state-of-the-art customizable Anime Voice Notification and Synthesizer system.

---

## 🚀 Live Demo & Preview

* **Live Development URL:** [https://ais-dev-i5kkf4n2onv4i4tnzqz4yd-668220888777.asia-southeast1.run.app](https://ais-dev-i5kkf4n2onv4i4tnzqz4yd-668220888777.asia-southeast1.run.app)
* **Shared Preview URL:** [https://ais-pre-i5kkf4n2onv4i4tnzqz4yd-668220888777.asia-southeast1.run.app](https://ais-pre-i5kkf4n2onv4i4tnzqz4yd-668220888777.asia-southeast1.run.app)

---

## ✨ Features Breakdown

### 🎙️ 1. Expressive Anime Voice & Synthesizer Core
The platform features an advanced client-side vocal synthesizer that triggers interactive, audible feedback for key user actions (order placement, cancellation, voice testing):
* **High-Quality Chip-Tune Chime Synthesizer:** Built using the raw **Web Audio API** oscillator system, generating cheerful arpeggios (success) or comforting warm minor chords (cancellation).
* **Four Expressive Archetypes:**
  * **Cute Fox 🦊 (`cute_heroine`):** Playful, high-pitched vocal sequence optimized for high energy.
  * **Elegant Lady 🌸 (`elegant_heroine`):** Polite, graceful, well-cadenced delivery.
  * **Confident Hero 🦸‍♂️ (`confident_hero`):** Bold, lower-pitch, energetic presentation.
  * **Calm Hermit 🍃 (`calm_hero`):** Comforting, slow, resonant baritone delivery.
* **Granular Adjustments:** Customize pitch, playback speed, volume, or select *Randomize Voice Core* for dynamic variety.

### 🛡️ 2. Secure Faction Authentication Node
A comprehensive and responsive authentication module featuring:
* **Terminal Node Login:** Input-validation secure form requiring password checking.
* **Profile Registration:** Build specialized profiles including custom gender settings (supporting Custom Input text fields), username identifiers, and elemental skin assessments.
* **Secure Forgot Password Recovery Flow:** Dynamic 3-step authorization reset using simulated OTP security verification codes (Demo active code: `GLOW-99X`) to overwrite existing ciphers securely.
* **Remember Me Integration:** Persists user authentication configurations locally for seamless follow-up sessions.

### 🔮 3. Interactive 3D Hologram Viewer
A beautiful, fully-interactive 3D rendering container powered by **Three.js**:
* **High-Quality Geometry:** Renders 3D custom cylindrical bottles with ambient emissive neon labels and wireframe backdrops.
* **Full Orbit Controls:** Click and drag to spin, rotate, or inspect products in real-time, accompanied by hovering technical metrics.
* **Fluid Lighting & Shadows:** Real-time directional, ambient, and point lights casting gorgeous metallic reflections.

### 📝 4. Diagnostic Skincare Quiz
An interactive diagnostic tool mapping skin vulnerabilities to custom skin-type factions:
* Staged, interactive questions with instant visual feedback.
* Automatically updates the user's bio-active skin profile upon completion.
* Provides tailored recommendations instantly redirecting to targeted solutions.

### 🎡 5. Lucky Wheel Rewards
A interactive daily spin wheel built with canvas styling:
* Grants free **Glow Points (GP)**, our futuristic loyalty token.
* Smooth physics deceleration and confetti effects upon winning.
* Synchronizes GP directly into the user's secure wallet.

### 🛒 6. High-Fidelity Shopping Cart & Chronology Tracker
* **Real-time Order Register:** Track historical purchases complete with specific status badges (Processing, Completed, Cancelled).
* **Instant Cancellations:** Cancel active orders dynamically, triggering customized comforting mascot voice messages.
* **Seamless Cart drawer:** Staggered additions, dynamic pricing calculations, and smooth item removals.

---

## 🛠️ Technology Stack

* **Core Framework:** React 19 (Functional Components, Hooks)
* **Build Tooling:** Vite 6
* **Language:** TypeScript
* **Styling:** Tailwind CSS (v4)
* **Animation Engine:** Motion (`motion/react`)
* **3D Rendering:** Three.js
* **Icons:** Lucide React
* **Synthesis Engine:** Web Audio API & Web Speech API

---

## 📂 Project Structure

```bash
animeglow/
├── public/                 # Static public assets
├── src/
│   ├── components/         # Modular user interface components
│   │   ├── CollectionsGrid.tsx    # Skin faction grids & product navigation
│   │   ├── Footer.tsx             # Interactive, themed multi-column footer
│   │   ├── HomeHero.tsx           # Immersive flagship display & landing zone
│   │   ├── LuckyWheel.tsx         # SVG daily rewards game loop
│   │   ├── MascotWidget.tsx       # Floating interactive virtual advisor
│   │   ├── Navbar.tsx             # Futuristic header with live cart counters
│   │   ├── ProductCard.tsx        # High-performance grid cards
│   │   ├── QuickViewModal.tsx     # Focused overlay displaying detailed specifications
│   │   ├── ThreeProductCanvas.tsx # 3D Three.js product hologram engine
│   │   └── UserProfileDashboard.tsx # Comprehensive terminal auth & order tracker
│   ├── context/
│   │   └── AppContext.tsx         # Central State Management (Cart, Wishlist, Auth)
│   ├── data/
│   │   └── products.ts            # High-fidelity products database
│   ├── index.css                  # Tailwinds (v4) global style declarations
│   ├── main.tsx                   # Render entry point
│   └── App.tsx                    # Layout structure and route coordinator
├── package.json            # Dependencies and script definitions
├── tsconfig.json           # Type configurations
└── metadata.json           # Applet configurations
```

---

## ⚙️ Installation & Local Setup

Ensure you have **Node.js (v18+)** installed.

### 1. Clone the repository
```bash
git clone <repository-url>
cd animeglow
```

### 2. Install dependencies
```bash
npm install
```

### 3. Start development server
```bash
npm run dev
```
The server will boot locally on [http://localhost:3000](http://localhost:3000).

### 4. Build for Production
```bash
npm run build
```
Static assets will compile cleanly inside the `dist/` directory.

---

## ⚙️ Environment Configuration

By default, the platform runs fully client-side and requires no external API keys or server configuration. To integrate with production notification databases, configure a standard `.env` at the project root:

```env
# Example configuration for production scaling
VITE_API_ENDPOINT=https://api.animeglow.com
VITE_ENABLE_ANALYTICS=false
```

---

## 🏎️ Performance Optimizations

* **Vite HMR & Fast Refresh:** Fine-tuned dev configurations for instant hot updates.
* **Three.js Cleanups:** Full resource deallocation (`dispose()`) on canvas unmount to prevent WebGL context memory leaks.
* **Component-Level State Partitioning:** Ensures cart and voice adjustments only re-render targeted interactive nodes, preserving high frame-rates throughout the general browsing flow.
* **SVG & Icon Bundling:** Lightweight vector pathways from `lucide-react` loaded on demand, minimizing primary script bundle weight.

---

## 🛡️ License

This project is licensed under the **MIT License**. Feel free to customize and expand!
