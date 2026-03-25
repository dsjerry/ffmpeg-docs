# 编码器概述

**编码器**（Codec）是指压缩和解压音视频数据的算法。FFmpeg 原生支持数百种编码器。

## 列出编码器

```bash
# 列出所有编码器
ffmpeg -codecs

# 仅列出编码器
ffmpeg -encoders

# 仅列出解码器
ffmpeg -decoders

# 搜索特定编码器
ffmpeg -encoders | grep h264
```

## 视频编码器分类

| 类别 | 描述 | 编码器 |
|------|------|--------|
| **H.264 系列** | 兼容性最广 | libx264, h264_nvenc, h264_videotoolbox |
| **H.265 系列** | 更好的压缩率，兼容性稍差 | libx265, hevc_nvenc, hevc_videotoolbox |
| **VPx** | 免版税 Web 编码器 | libvpx-vp8, libvpx-vp9 |
| **AV1** | 最新、压缩最好 | libaom-av1, libsvtav1 |
| **ProRes** | 专业剪辑 | prores, prores_ks |
| **DNxHD** | 专业剪辑 | dnxhd |
| **GIF** | 动画 | gif |
| **PNG/JPEG** | 图像 | mjpeg, png |

## 音频编码器分类

| 类别 | 描述 | 编码器 |
|------|------|--------|
| **AAC** | 最常见，Web 流媒体 | aac, libfdk_aac, aac_fixed |
| **MP3** | 通用兼容 | libmp3lame |
| **Opus** | 低延迟，语音/音乐 | libopus |
| **Vorbis** | 开放、Web | libvorbis |
| **FLAC** | 无损 | flac |
| **PCM** | 未压缩 | pcm_s16le, pcm_s24le |
| **AC3** | DVD/蓝光 | ac3 |
| **E-AC3** | 蓝光、流媒体 | eac3 |

## 复制模式

当编码格式不需要改变时，最快的转码方式是复制流：

```bash
# 复制所有流（仅转换容器）
ffmpeg -i input.mkv -c copy output.mp4

# 复制视频，重新编码音频
ffmpeg -i input.mkv -c:v copy -c:a aac output.mp4

# 复制音频，重新编码视频
ffmpeg -i input.mkv -c:v libx264 -preset fast -crf 22 -c:a copy output.mp4
```

## 选择编码器

| 用途 | 推荐视频编码器 | 推荐音频编码器 |
|------|--------------|--------------|
| Web (MP4) | libx264 | aac |
| Web (WebM) | libvpx-vp9 | libopus |
| 归档 | FFV1 | FLAC |
| 剪辑 | ProRes 422 HQ / DNxHD | PCM |
| 流媒体 | libx264 / h264_nvenc | aac / libopus |
| 移动端 | libx264 | aac |
| GIF | gif / palettegen | — |
| 超低延迟 | h264_nvenc | libopus |
