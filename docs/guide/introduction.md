# 介绍

FFmpeg 是**最强大的开源多媒体框架**，用于处理音频和视频。它可以解码、编码、转码、复用、解复用、流化、过滤和播放几乎任何媒体格式。

## 什么是 FFmpeg？

FFmpeg 是一套命令行工具，包含：

| 工具 | 用途 |
|------|------|
| **ffmpeg** | 在不同格式间转换、应用滤镜、编码媒体 |
| **ffprobe** | 分析媒体文件 — 流、编码器、时长、码率 |
| **ffplay** | 基于 SDL 和 FFmpeg 库的极简媒体播放器 |
| **libavcodec** | 驱动所有编码/解码的编解码器库 |
| **libavformat** | 处理容器格式的复用/解复用 |

## 为什么要学习 FFmpeg？

- **广泛支持** — FFmpeg 支持的格式和编码器比任何其他工具都多
- **批量处理** — 在大规模场景下自动化视频工作流
- **服务端** — 可在 Docker、云函数或边缘节点上运行
- **浏览器端** — @ffmpeg/core 通过 WebAssembly 将 FFmpeg 带入 Web
- **免费开源** — 无授权费用，无供应商锁定

## 本指南涵盖的工具

本站点涵盖三个主要领域：

1. **FFmpeg 命令行** — 直接使用 `ffmpeg`、`ffprobe` 和 `ffplay`
2. **fluent-ffmpeg** — Node.js 封装库，用于构建视频处理应用
3. **@ffmpeg/core** — 用于浏览器端处理的 WebAssembly 版本

## 快速示例

将视频转换为 MP4（H.264 + AAC）：

```bash
ffmpeg -i input.avi -c:v libx264 -preset medium -crf 23 \
  -c:a aac -b:a 128k -movflags +faststart output.mp4
```

## 下一步

通过侧边栏导航，或从 [安装](/guide/installation) 开始学习。
