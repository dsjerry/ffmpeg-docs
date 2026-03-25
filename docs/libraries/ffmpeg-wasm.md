# @ffmpeg/core (WASM)

`@ffmpeg/ffmpeg` 通过 **WebAssembly** 将 FFmpeg 带入**浏览器**。无需服务器，无需安装 FFmpeg —— 一切都在客户端运行。

## 安装

```bash
npm install @ffmpeg/ffmpeg @ffmpeg/util
```

## 核心概念

### 单线程 vs 多线程

| 版本 | 包 | SharedArrayBuffer | 速度 | 配置 |
|------|------|-------------------|------|------|
| 单线程 | `@ffmpeg/core` | 不需要 | 中等 | 简单 |
| 多线程 | `@ffmpeg/core-mt` | 需要 | 更快 | 需要 COOP/COEP 头 |

本指南使用**单线程版本**，更简单。

### 限制

- 无法直接访问本地文件（需要使用 File API）
- WASM 二进制文件首次加载约 31 MB
- 处理是 CPU 密集的（浏览器中无 GPU 加速）
- 某些编码器可能不适用于 WASM 构建

## 基本设置

### Vite 配置

```typescript
// vite.config.ts（单线程不需要特殊头）
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

### 加载 FFmpeg

```javascript
import { FFmpeg } from '@ffmpeg/ffmpeg'
import { toBlobURL } from '@ffmpeg/util'

const ffmpeg = new FFmpeg()

// 从 CDN 加载 WASM 二进制文件
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

### 完整示例

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

// 将输入文件写入虚拟文件系统
await ffmpeg.writeFile('input.mp4', await fetchFile(videoFile))

// 执行 FFmpeg 命令
await ffmpeg.exec(['-i', 'input.mp4', '-c:v', 'libx264', '-crf', '22', 'output.mp4'])

// 从虚拟文件系统读取输出
const data = await ffmpeg.readFile('output.mp4')
const url = URL.createObjectURL(new Blob([data.buffer], { type: 'video/mp4' }))
```

## API 参考

### 核心方法

| 方法 | 描述 |
|------|------|
| `ffmpeg.load(options)` | 加载 WASM 二进制文件 |
| `ffmpeg.exec(args)` | 执行 FFmpeg 命令 |
| `ffmpeg.writeFile(name, data)` | 写入文件到虚拟 FS |
| `ffmpeg.readFile(name)` | 从虚拟 FS 读取文件 |
| `ffmpeg.deleteFile(name)` | 从虚拟 FS 删除文件 |
| `ffmpeg.createFS()` | 创建虚拟文件系统 |
| `ffmpeg.terminate()` | 终止 FFmpeg 实例 |

### 事件

| 事件 | 描述 |
|------|------|
| `log` | FFmpeg 日志消息 |
| `progress` | 编码进度 |
| `ready` | FFmpeg 加载就绪 |

### 进度事件

```javascript
ffmpeg.on('progress', ({ progress, time }) => {
  const percent = Math.round(progress * 100)
  const currentTime = new Date(time * 1000).toISOString().substr(11, 8)
  console.log(`${percent}% — ${currentTime}`)
})
```

## 常见用例

### 视频转 GIF

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

### 压缩视频

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

### 提取音频

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

### 裁剪视频

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

## 交互式演示

在[首页](/)尝试在线演示 —— 选择视频、选择预设，即可在浏览器中运行转换。

## 技巧

- **开发环境使用 CDN URL**；生产环境打包以支持离线
- **单线程对大多数用例足够** —— 多线程仅对重型转码有帮助
- **文件大小限制**：浏览器限制 Blob/File 大小；大文件使用 `file.stream()` 和 `ReadableStream`
- **完成后终止**：调用 `ffmpeg.terminate()` 释放内存
- **并非所有编码器都可用**：某些硬件特定编码器（NVENC、VideoToolbox）在 WASM 中不可用

## React 集成示例

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
    // 处理输出...
  }

  return loaded ? <button onClick={() => convert()}>转换</button> : <p>加载中...</p>
}
```
