# 🐾 Lil Companion

A tiny pixel-art cat that lives in your browser. It wanders around webpages, reacts to clicks and typing, gets sleepy, and has a secret emo mode.

## Install in Chrome
1. Download and extract this project.
2. Open `chrome://extensions`.
3. Turn on **Developer mode**.
4. Click **Load unpacked**.
5. Select the `lil-companion-v12` folder — the one containing `manifest.json`.

The secret Emo Cat now has its own idle, dizzy, music, typing, sad, angry and sleeping artwork.\n\n## Secret Easter egg
Open the extension popup and enter the Konami code:

`↑ ↑ ↓ ↓ ← → ← → B A`

This unlocks the secret Emo Cat.

## Project structure
```text
lil-companion-v12/
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
    │   ├── cat-orange.png\n│   ├── orange-walk.webp
    │   ├── street.png
    │   ├── cream.png
    │   ├── black.png
    │   ├── white.png
    │   ├── emo.png
    │   └── ...mood sprites
    └── icons/
        ├── icon16.png
        ├── icon32.png
        ├── icon48.png
        └── icon128.png
```

## Development
Edit the files in `src/` or `assets/`, then reload the extension at `chrome://extensions` and refresh the webpage.
