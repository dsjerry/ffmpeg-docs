# FFmpeg Learning Site

A comprehensive guide to mastering FFmpeg, fluent-ffmpeg, and @ffmpeg/core (WASM), built with VitePress and Bun.

## Features

- **FFmpeg Command Line** — From basic transcoding to advanced filter graphs
- **fluent-ffmpeg** — Node.js wrapper for building video processing pipelines
- **@ffmpeg/core (WASM)** — Interactive browser-based FFmpeg demos
- **Full i18n Support** — Available in English and Chinese

## Quick Start

```bash
# Install dependencies
bun install

# Start dev server
bun run docs:dev

# Build for production
bun run docs:build

# Preview production build
bun run docs:preview
```

## Project Structure

```
docs/
├── .vitepress/
│   ├── config/
│   │   ├── nav.ts          # Navigation configuration
│   │   └── sidebar.ts     # Sidebar configuration
│   ├── config.ts           # Main VitePress config
│   └── theme/
│       ├── index.ts        # Theme entry
│       ├── Layout.vue      # Custom layout
│       ├── custom.css      # Theme overrides
│       └── components/
│           └── FfmpegDemo.vue  # WASM demo component
├── en/                     # English docs
└── zh/                     # Chinese docs
```

## Tech Stack

| Tool | Purpose |
|------|---------|
| [VitePress](https://vitepress.dev) | Documentation framework |
| [Bun](https://bun.sh) | Package manager & runtime |
| [@ffmpeg/ffmpeg](https://ffmpegwasm.netlify.app) | Browser FFmpeg (WASM) |
| [Vue 3](https://vuejs.org) | Interactive components |

## Content

| Section | Description |
|--------|-------------|
| Guide | Introduction, installation, basic concepts, quick start |
| Commands | ffmpeg, ffprobe, ffplay, transcoding, cutting, scaling, audio, subtitles |
| Filters | Video filters, audio filters, complex filter graphs |
| Codecs | Overview, H.264, HEVC, AV1 |
| Streaming | HLS, DASH, RTMP/SRT |
| Libraries | fluent-ffmpeg, @ffmpeg/core (WASM) |
| Examples | Video to GIF, contact sheets, watermarks, batch processing |
| Cheat Sheet | Quick command reference |

## License

MIT
