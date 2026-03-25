# 安装

## FFmpeg 命令行

### macOS

```bash
# 使用 Homebrew（推荐）
brew install ffmpeg

# 检查版本
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

**方式一：Winget（推荐）**
```powershell
winget install ffmpeg
```

**方式二：Chocolatey**
```powershell
choco install ffmpeg
```

**方式三：Scoop**
```powershell
scoop install ffmpeg
```

**方式四：手动安装**
1. 从 [gyan.dev](https://www.gyan.dev/ffmpeg/builds/) 或 [BtbN builds](https://github.com/BtbN/FFmpeg-Builds/releases) 下载
2. 解压到 `C:\ffmpeg`
3. 将 `C:\ffmpeg\bin` 添加到 PATH 环境变量

::: tip 验证安装
安装后，运行以下命令验证：

```bash
ffmpeg -version
ffprobe -version
```

两个命令都应该输出版本信息，无报错。
:::

## 常用依赖

要获得完整的编码器支持，安装完整套件：

```bash
# Ubuntu/Debian
sudo apt install ffmpeg libavcodec-extra

# macOS（Homebrew 自动包含大多数编码器）
brew install ffmpeg --with-all-codecs
```

## GPU 加速

### NVIDIA（Linux/Windows）

```bash
# Linux
sudo apt install nvidia-cuda-toolkit

# 验证硬件加速
ffmpeg -hide_banner -encoders | grep nvenc
```

### macOS VideoToolbox

```bash
# macOS 开箱即用支持硬件编码
ffmpeg -hide_banner -encoders | grep videotoolbox
```

## fluent-ffmpeg（Node.js）

```bash
npm install fluent-ffmpeg
# 或
yarn add fluent-ffmpeg
# 或
bun add fluent-ffmpeg
```

需要系统中已安装 FFmpeg CLI。

## @ffmpeg/core（浏览器/WASM）

```bash
npm install @ffmpeg/ffmpeg @ffmpeg/util
```

无需系统 FFmpeg —— 一切都在浏览器中通过 WebAssembly 运行。

对于 Vite 项目，添加 COOP/COEP 头以支持多线程：

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

::: warning 文件访问限制
浏览器版 FFmpeg 无法直接读取本地文件。使用 File API：

```javascript
const input = await fetchFile(fileInput.files[0])
await ffmpeg.writeFile('input.mp4', input)
```
:::
