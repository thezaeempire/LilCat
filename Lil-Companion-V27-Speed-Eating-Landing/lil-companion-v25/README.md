# 🐾 Lil Companion

A tiny pixel-art cat that lives in your browser. It wanders around webpages, reacts to clicks and typing, gets sleepy, and has a secret emo mode.

## Install in Chrome
1. Download and extract this ZIP.
2. Open `chrome://extensions`.
3. Turn on **Developer mode**.
4. Click **Load unpacked**.
5. Select the `lil-companion-v25` folder — the one containing `manifest.json`.

## Features
- Animated pixel cat with happy, sad, angry, dizzy, sleeping and typing moods.
- Random personality moments with a 30-second cooldown.
- Drag, throw and bounce physics.
- A draggable food bowl. Click it to call the cat over; the eating animation plays for 10 seconds.
- A clickable cat house. Click to send the cat inside, then click again to bring it back out.
- Secret Emo Cat mode.

## Project structure
```text
lil-companion-v25/
├── manifest.json
├── popup/
│   └── popup.html
├── src/
│   ├── content.js
│   ├── pet.css
│   ├── popup.js
│   └── popup.css
└── assets/
    ├── cats/
    ├── food/
    ├── home/
    ├── effects/
    └── icons/
```

## Development
Edit files in `src/` or `assets/`, then reload the extension at `chrome://extensions` and refresh the webpage.
