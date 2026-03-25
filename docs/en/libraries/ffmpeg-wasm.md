# @ffmpeg/core (WASM)

`@ffmpeg/ffmpeg` brings FFmpeg into the **browser via WebAssembly**. No server, no FFmpeg installation — everything runs client-side.

## Installation

```bash
npm install @ffmpeg/ffmpeg @ffmpeg/util
```

## Core Concepts

### Single-Thread vs Multi-Thread

| Version | Package | SharedArrayBuffer | Speed | Setup |
|---------|---------|-------------------|-------|-------|
| Single-thread | `@ffmpeg/core` | Not needed | Moderate | Simpler |
| Multi-thread | `@ffmpeg/core-mt` | Required | Faster | Needs COOP/COEP headers |

This guide uses the **single-thread version** for simplicity.

### Limitations

- Cannot access local files directly (use File API)
- WASM binary is ~31 MB to download on first load
- Processing is CPU-bound (no GPU acceleration in browser)
- Some codecs may not be available in WASM builds

## Basic Setup

### Vite Configuration

```typescript
// vite.config.ts (no special headers needed for single-thread)
import { defineConfig } from 'vitepress'

export default defineConfig({
  server: {
    headers: {
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Embedder-Policy': 'require-corp',
    }
  }
})
```

### Load FFmpeg

```javascript
import { FFmpeg } from '@ffmpeg/ffmpeg'
import { toBlobURL } from '@ffmpeg/util'

const ffmpeg = new FFmpeg()

// Load WASM binaries from CDN
await ffmpeg.load({
  coreURL: await toBlobURL(
    'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd/ffmpeg-core.js',
    'text/javascript'
  ),
  wasmURL: await toBlobURL(
    'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd/ffmpeg-core.js',
    'application/wasm'
  )
})
```

### Complete Example

```javascript
import { FFmpeg } from '@ffmpeg/ffmpeg'
import { fetchFile, toBlobURL } from '@ffmpeg/util'

const ffmpeg = new FFmpeg()

ffmpeg.on('log', ({ message }) => {
  console.log(message)
})

ffmpeg.on('progress', ({ progress }) => {
  console.log(`Progress: ${Math.round(progress * 100)}%`)
})

await ffmpeg.load({
  coreURL: await toBlobURL(
    'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd/ffmpeg-core.js',
    'text/javascript'
  ),
  wasmURL: await toBlobURL(
    'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd/ffmpeg-core.wasm',
    'application/wasm'
  )
})

// Write input file to virtual filesystem
await ffmpeg.writeFile('input.mp4', await fetchFile(videoFile))

// Execute FFmpeg command
await ffmpeg.exec(['-i', 'input.mp4', '-c:v', 'libx264', '-crf', '22', 'output.mp4'])

// Read output from virtual filesystem
const data = await ffmpeg.readFile('output.mp4')
const url = URL.createObjectURL(new Blob([data.buffer], { type: 'video/mp4' }))
```

## API Reference

### Core Methods

| Method | Description |
|--------|-------------|
| `ffmpeg.load(options)` | Load WASM binaries |
| `ffmpeg.exec(args)` | Run FFmpeg command |
| `ffmpeg.writeFile(name, data)` | Write file to virtual FS |
| `ffmpeg.readFile(name)` | Read file from virtual FS |
| `ffmpeg.deleteFile(name)` | Delete file from virtual FS |
| `ffmpeg.createFS()` | Create virtual filesystem |
| `ffmpeg.terminate()` | Terminate FFmpeg instance |

### Events

| Event | Description |
|-------|-------------|
| `log` | FFmpeg log messages |
| `progress` | Encoding progress |
| `ready` | FFmpeg loaded and ready |

### Progress Event

```javascript
ffmpeg.on('progress', ({ progress, time }) => {
  const percent = Math.round(progress * 100)
  const currentTime = new Date(time * 1000).toISOString().substr(11, 8)
  console.log(`${percent}% — ${currentTime}`)
})
```

## Common Use Cases

### Video to GIF

```javascript
await ffmpeg.writeFile('input.mp4', await fetchFile(file))

await ffmpeg.exec([
  '-i', 'input.mp4',
  '-vf', 'fps=15,scale=480:-1:flags=lanczos,split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse',
  '-loop', '0',
  'output.gif'
])

const gifData = await ffmpeg.readFile('output.gif')
```

### Compress Video

```javascript
await ffmpeg.writeFile('input.mp4', await fetchFile(file))

await ffmpeg.exec([
  '-i', 'input.mp4',
  '-c:v', 'libx264',
  '-preset', 'medium',
  '-crf', '28',
  '-c:a', 'aac',
  '-b:a', '128k',
  'output.mp4'
])

const outputData = await ffmpeg.readFile('output.mp4')
```

### Extract Audio

```javascript
await ffmpeg.writeFile('input.mp4', await fetchFile(file))

await ffmpeg.exec([
  '-i', 'input.mp4',
  '-vn',
  '-c:a', 'aac',
  '-b:a', '192k',
  'audio.m4a'
])

const audioData = await ffmpeg.readFile('audio.m4a')
```

### Trim Video

```javascript
await ffmpeg.writeFile('input.mp4', await fetchFile(file))

await ffmpeg.exec([
  '-i', 'input.mp4',
  '-ss', '00:00:05',
  '-t', '10',
  '-c:v', 'libx264',
  '-crf', '22',
  '-c:a', 'aac',
  'clip.mp4'
])

const clipData = await ffmpeg.readFile('clip.mp4')
```

## Interactive Demo

Try the live demo on the [home page](/en/) — select a video, choose a preset, and run the conversion in your browser.

## Tips

- **Use CDN URLs** for WASM binaries in development; bundle them in production for offline support
- **Single-thread is fine** for most use cases — multi-thread only helps for heavy transcoding
- **File size limits**: Browsers limit Blob/File sizes; for large files, use `file.stream()` with `ReadableStream`
- **Terminate when done**: Call `ffmpeg.terminate()` to free memory when finished
- **Not all codecs available**: Some hardware-specific codecs (NVENC, VideoToolbox) are not available in WASM

## React Integration Example

```jsx
import { useState, useEffect } from 'react'
import { FFmpeg } from '@ffmpeg/ffmpeg'
import { fetchFile } from '@ffmpeg/util'

function VideoConverter() {
  const [ffmpeg, setFfmpeg] = useState(null)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const f = new FFmpeg()
    f.load().then(() => {
      setFfmpeg(f)
      setLoaded(true)
    })
  }, [])

  const convert = async (file) => {
    if (!ffmpeg) return
    await ffmpeg.writeFile('input.mp4', await fetchFile(file))
    await ffmpeg.exec(['-i', 'input.mp4', 'output.mp4'])
    const data = await ffmpeg.readFile('output.mp4')
    // handle output...
  }

  return loaded ? <button onClick={() => convert()}>Convert</button> : <p>Loading...</p>
}
```
