# Minecraft Pocket Edition 0.6.1 Alpha (Web Assembly / emscripten / WASM port)

Fully playable Minecraft PE 0.6.1 alpha in the browser with full multi-touch support, keyboard and mouse inputs, offline PWA support, and local storage map saves & Audio.

[**PLAY NOW**](https://jakesubway.github.io/MCPEweb/)

Open **Settings → Install app** to install the website from a supported browser. If the browser does not show an install prompt, use its install or Add to Home Screen menu. Open the site online once to cache the game for offline use.

**Website language** switches settings and installation text between English, Traditional Chinese, and Simplified Chinese. The choice is saved in the browser. The bundled game uses English.


## Build

1. Install dependencies: `.\install_deps.ps1`
2. Build: `.\build.ps1`

Output: `project/emscripten/index.html`, `index.js`, `index.wasm`. Serve that folder to run.
