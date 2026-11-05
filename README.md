# 🐾 Lil Companion

A tiny pixel-art cat that lives inside your browser. Lil Companion is an interactive browser pet that walks around webpages, reacts to user interactions, gets hungry and sleepy, and has its own little home.

## ✨ Features

### 🐈 Cat Companion
- Animated pixel-art cat that lives on your webpages.
- Multiple expressions and moods, including happy, sad, angry, dizzy, sleeping, typing, and love.
- Random personality moments with a cooldown.
- Cat reacts when you type into text fields.
- Drag, throw, and bounce physics.
- Landing effects with soft dust and dirt particles.
- The cat can walk into and out of its house.

### 🏠 Cat House
- A small house that stays visible on every browser tab.
- Click the house to summon the cat into the currently active tab.
- Click it again when the cat is already in that tab to send the cat inside.
- The cat walks in from the left or right when summoned.
- Draggable horizontally along the bottom of the webpage.

### 🍖 Food System
- Interactive food bowl.
- Click the bowl to call the cat over for food.
- Eating animation plays for 10 seconds.
- The bowl temporarily disappears while the cat is eating and returns afterwards.
- Food bowl can be dragged horizontally along the bottom of the page.

### 🌐 Multi-Tab Support
- Only one active cat exists across browser tabs at a time.
- The cat stays in the tab where it was last summoned.
- The house and food bowl remain available across tabs.
- Summoning the cat from another tab transfers its presence to that tab.
- Helps avoid multiple cats running simultaneously and reduces unnecessary resource usage.

### 🥚 Egg Hatch Intro
- The cat can appear through an animated egg-hatching introduction.
- The egg falls into the page, cracks open, and reveals the cat.

### 📀 Cat DVD Screensaver
- A secret animated DVD-style screensaver featuring the cat.
- Activates after 5 minutes of inactivity.
- Can also be activated using the Konami code:

  `↑ ↑ ↓ ↓ ← → ← → B A`

- Can be enabled or disabled in the extension's Behaviour settings.

### 🎨 Lite Mode
- Uses static PNG sprites instead of animated GIF/WebP cat expressions.
- Includes different expressions for happy, angry, sad, dizzy, sleeping, typing, eating, and music states.
- Reduces animated asset usage for lower-powered computers.
- The cat can still move and interact with the webpage.

### 🎵 Secret Emo Cat Mode
- Special alternative cat mode with its own personality.

## ⚙️ Installation

1. Download and extract the project ZIP.
2. Open Google Chrome.
3. Visit `chrome://extensions`.
4. Enable **Developer mode**.
5. Click **Load unpacked**.
6. Select the `lil-companion-v25` folder containing `manifest.json`.
7. Open or refresh a webpage to see your companion.

## 🛠️ Updating the Extension

1. Replace the old project folder with the updated version.
2. Open `chrome://extensions`.
3. Find Lil Companion.
4. Click **Reload**.
5. Refresh your open webpages.

## 📁 Project Structure

```text
lil-companion-v25/
├── manifest.json
├── popup/
│   └── popup.html
├── src/
│   ├── background.js
│   ├── content.js
│   ├── pet.css
│   ├── popup.js
│   └── popup.css
└── assets/
    ├── cats/
    ├── lite/
    ├── intro/
    ├── screensaver/
    ├── food/
    ├── home/
    ├── effects/
    └── icons/
```

## 💻 Development

- Built as a Chrome Extension using Manifest V3.
- JavaScript handles cat behaviour, interactions, and multi-tab coordination.
- CSS handles the companion's appearance and positioning.
- Image and animation assets are stored in the `assets/` directory.
- After modifying the source files, reload the extension from `chrome://extensions` and refresh the webpage.

## ❤️ About

Lil Companion started as a simple pixel cat and gradually grew into an interactive browser companion with its own home, food system, animations, personality, and multi-tab behaviour.

**A little companion for every browsing session.** 🐾