# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Static multi-page marketing site for "Alone Game", a French horror escape game. Content is in French. No build system, no package manager, no tests — it's plain HTML/CSS/JS served as files.

## Running locally

Open `index.html` directly in a browser, or serve the directory:

```
python3 -m http.server 8000
```

Then visit `http://localhost:8000/index.html`. There is nothing to build, lint, or test.

## Structure

- Five pages, each a standalone HTML file that duplicates the header/footer/scripts: `index.html`, `apropos.html`, `Nos aventures.html` (note the space), `Tarifs.html`, `Contact.html`.
- `style.css` (~2400 lines) holds all styling for every page.
- `script.js` contains the accordion toggle (used on `Tarifs.html`) and a jQuery-based AJAX handler for the contact form on `Contact.html`.
- Inline `<script>` in each page handles the scroll-reveal animation (`.scroll-reveal` → `.visible`) and the header music toggle button (`#play-music-btn` → `#site-music`).
- External deps are loaded via CDN: Bootstrap 5.3.3 CSS+JS and Google Fonts (Creepster, Special Elite, Lora, Playfair Display).

## Known gotchas (don't "fix" without checking first)

These look broken but reflect how the repo is laid out — verify before changing them:

- **Asset paths use phantom subfolders.** Pages reference `../alonegame-site/ACCUEIL/...`, `../alonegame-site/CONTACT/...`, `../alonegame-site/MUSIC/...`, but all image/audio files actually live at the repo root, and those subdirectories do not exist. The paths only resolve when the site is served from a parent directory that contains an `alonegame-site/ACCUEIL/` (etc.) folder. When adding new assets, match the existing pattern so behavior stays consistent across pages — or update every page together.
- **Filename casing.** Files are `Contact.html`, `Tarifs.html`, `Nos aventures.html`, but navigation links use lowercase (`contact.html`, `tarifs.html`). Works on case-insensitive filesystems (macOS default, Windows) and breaks on case-sensitive ones (most Linux web servers). Keep the convention or normalize all references together.
- **jQuery is not loaded.** `script.js` uses `$(...)` for the contact form AJAX, but no page includes a jQuery `<script>` tag — only Bootstrap. The contact form handler silently no-ops until jQuery is added.
- **Contact form backend is absent.** `script.js` POSTs to `php/contact.php`; that directory does not exist in the repo.
- **Header/footer are duplicated per page.** Edits to nav, footer, music button, or the inline scroll-reveal/music JS must be applied to all five HTML files.

## Branch

Development branch for Claude Code sessions: `claude/init-project-iGMh6`. Push there, not to `main`.
