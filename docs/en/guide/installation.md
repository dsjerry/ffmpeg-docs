# Installation

## FFmpeg CLI

### macOS

```bash
# Using Homebrew (recommended)
brew install ffmpeg

# Check version
ffmpeg -version
```

### Linux

```bash
# Debian / Ubuntu
sudo apt update && sudo apt install ffmpeg

# Fedora
sudo dnf install ffmpeg

# Arch Linux
sudo pacman -S ffmpeg
```

### Windows

**Option 1: Winget (recommended)**
```powershell
winget install ffmpeg
```

**Option 2: Chocolatey**
```powershell
choco install ffmpeg
```

**Option 3: Scoop**
```powershell
scoop install ffmpeg
```

**Option 4: Manual**
1. Download from [gyan.dev](https://www.gyan.dev/ffmpeg/builds/) or [BtbN builds](https://github.com/BtbN/FFmpeg-Builds/releases)
2. Extract to `C:\ffmpeg`
3. Add `C:\ffmpeg\bin` to PATH

::: tip Verify Installation
After installing, verify with:

```bash
ffmpeg -version
ffprobe -version
```

Both should output version information without errors.
:::

## Common Dependencies

For full codec support, install the full suite:

```bash
# Ubuntu/Debian
sudo apt install ffmpeg libavcodec-extra

# macOS (Homebrew automatically includes most codecs)
brew install ffmpeg --with-all-codecs
```

## GPU Acceleration

### NVIDIA (Linux/Windows)

```bash
# Linux
sudo apt install nvidia-cuda-toolkit

# Verify hardware acceleration
ffmpeg -hide_banner -encoders | grep nvenc
```

### macOS VideoToolbox

```bash
# macOS supports hardware encoding out of the box
ffmpeg -hide_banner -encoders | grep videotoolbox
```

## fluent-ffmpeg (Node.js)

```bash
npm install fluent-ffmpeg
# or
yarn add fluent-ffmpeg
# or
bun add fluent-ffmpeg
```

Requires FFmpeg CLI to be installed on the system (the above packages).

## @ffmpeg/core (Browser/WASM)

```bash
npm install @ffmpeg/ffmpeg @ffmpeg/util
```

No system FFmpeg required — everything runs in the browser via WebAssembly.

For Vite projects, add COOP/COEP headers for multi-thread support:

```typescript
// vite.config.ts
export default {
  server: {
    headers: {
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Embedder-Policy': 'require-corp',
    }
  }
}
```

::: warning File Access
Browser FFmpeg cannot read local files directly. Use the File API:

```javascript
const input = await fetchFile(fileInput.files[0])
await ffmpeg.writeFile('input.mp4', input)
```
:::
