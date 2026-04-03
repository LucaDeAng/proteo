# Genesis — The History of Artificial Intelligence

An interactive scrollytelling experience that tells the history of AI as the evolution of the universe.

**[Live Demo](https://lucadeang.github.io/proteo/)**

## The Experience

13 full-viewport slides, each with unique Canvas animations, telling the story from Turing (1950) to the AI agents era (2026):

| Slide | Era | Visual |
|-------|-----|--------|
| Hero | — | Orbital rings, pulsing singularity |
| The Void | Pre-1950 | Floating mathematical symbols |
| Big Bang | 1950-1956 | Particle explosion |
| First Stars | 1956-1974 | Stars igniting, warm nebulae |
| Ice Ages | 1974-1993 | Ice crystals, dying stars |
| Cambrian Explosion | 1993-2012 | Bioluminescent organisms |
| Intelligence | 2012-2022 | Neural network mycelium |
| Singularity | 2022-2026 | Planet with city lights |
| Tree of Knowledge | — | Interactive model-to-discovery lineage |
| The Horizon | — | Flickering future themes |
| The Numbers | — | Animated counters |
| Galaxy Map | — | Explorable star map of 65+ milestones |
| Credits | — | Attribution |

## Features

- **Bilingual** IT/EN toggle
- **9 visual layers**: film grain, vignette, shooting stars, transition particles, ambient glow, canvas zoom, per-slide animations, word-by-word text reveal, cursor glow
- **Scroll-linked particles** that shift color and react to scroll velocity
- **Interactive slides**: Tree of Knowledge (hover to explore model ancestry), Galaxy Map (hover milestones)
- **Cinematic preloader** with letter-by-letter GENESIS reveal
- **Ambient audio** player (add your own `public/audio/ambient.mp3`)
- **65+ AI milestones** from Llull (1305) to AGI Debate (2026)
- **Responsive** mobile support

## Tech Stack

- React 18 + TypeScript
- Vite
- Tailwind CSS
- Framer Motion
- Canvas API + simplex-noise
- Zero heavy dependencies (no D3, no Three.js)

## Development

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # Production build in dist/
```

## Audio

Drop a cosmic ambient MP3 into `public/audio/ambient.mp3` and the player appears automatically. Recommended: [Pixabay cosmic ambient](https://pixabay.com/music/search/cosmic%20ambient/) (free, no copyright).

## Credits

Concept & Development: **Luca De Angelis**
Built with: **Claude Code** + React + Canvas + Framer Motion
