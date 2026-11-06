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


## New in this build
- Drag the cat house and food bowl horizontally along the bottom edge of the page.
- The cat renders above the house overlay.
- The cat starts in the centre of the page when the extension loads.
- The food bowl is smaller and sits against the bottom edge.
- The Cat DVD screensaver uses the supplied animated rainbow cat: it starts after 5 minutes without activity, or with the Konami code (↑ ↑ ↓ ↓ ← → ← → B A).
- Turn the Cat DVD screensaver on or off in the extension's Behaviour settings.


### Lite mode
Open the extension menu and enable **Lite mode** to use static PNG cat sprites instead of animated GIF/WebP assets. The cat still moves around the page, but animated sprite decoding and extra visual motion are reduced for lower-powered computers. Turn it off to restore the full animated experience.


### V33 visual updates
- Ground landings now use soft brown dirt particles and a low dust cloud instead of bright spark-like particles.
- Lite mode uses the original static expression PNGs for happy, angry, sad, dizzy, sleeping, typing and music states.
- Removed extra CSS bobbing/shaking so the regular cat stays planted; the supplied animated sprites still animate on their own.


### V34.1 updates
- Transparent grooming animation after eating and occasionally at random.
- Animated sleeping hut while the cat is inside.
- Pick up and drop the hut; gravity returns it to the bottom while keeping it upright.
- Dropping the occupied hut makes the cat tumble out dizzy.
- Hut and bowl positions are remembered and synchronized across tabs.

### V34.2 fixes
- Grooming now uses cropped transparent animated WebP and is protected from idle-loop image resets; it plays after eating and can be interrupted by other cat states.
- Random emotions now have a 15-second normal/idle cooldown after each emotion and a longer initial delay.
- Increased the hut display size and cropped transparent margins from its sleeping animation.

### V34.4 corrections
- Corrected hut dimensions and floor collision bounds together.
- Removed sad-state bobbing and cropped the eating animation to its visible pixels.
- Grooming animation now remains active to completion and blocks conflicting idle/mood updates.
- Eating begins only after checking the cat is actually aligned with the food bowl at floor level.
