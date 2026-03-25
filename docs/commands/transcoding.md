# 转码

转码是指将媒体从一种格式/编码器转换为另一种格式/编码器。这是最常见的 FFmpeg 操作。

## 转码为 MP4（H.264 + AAC）

```bash
ffmpeg -i input.avi -c:v libx264 -preset fast -crf 23 \
  -c:a aac -b:a 192k \
  -movflags +faststart \
  output.mp4
```

::: tip +faststart
此标志将 `moov` 原子移到文件开头，使视频可渐进式下载（流式播放）。Web 发布时务必加上。
:::

## WebM（VP9 + Opus）

```bash
ffmpeg -i input.mp4 -c:v libvpx-vp9 -crf 30 -b:v 0 \
  -c:a libopus -b:a 128k \
  output.webm
```

`-b:v 0` 结合 `-crf` 可启用 VP9 的 VBR（可变码率）编码。

## ProRes（剪辑用）

```bash
# ProRes 422 Proxy（最快、最小）
ffmpeg -i input.mov -c:v prores_ks -profile:v 0 output.mov

# ProRes 422 LT
ffmpeg -i input.mov -c:v prores_ks -profile:v 1 output.mov

# ProRes 422（标准）
ffmpeg -i input.mov -c:v prores_ks -profile:v 2 output.mov

# ProRes 422 HQ（最高质量）
ffmpeg -i input.mov -c:v prores_ks -profile:v 3 output.mov
```

## DNxHD（剪辑用）

```bash
# 1080p 145 Mbps
ffmpeg -i input.mov -c:v dnxhd -b:v 145M -c:a pcm_s16le output.mov

# 1080p 36 Mbps（LT）
ffmpeg -i input.mov -c:v dnxhd -b:v 36M -pix_fmt yuv422p -c:a pcm_s16le output.mov
```

## 音频转换

```bash
# MP3（固定码率）
ffmpeg -i input.wav -c:a libmp3lame -b:a 320k output.mp3

# MP3（可变码率）
ffmpeg -i input.wav -c:a libmp3lame -q:a 2 output.mp3

# AAC
ffmpeg -i input.wav -c:a aac -b:a 256k output.m4a

# FLAC（无损）
ffmpeg -i input.wav -c:a flac output.flac

# Opus
ffmpeg -i input.wav -c:a libopus -b:a 128k output.opus
```

## 图片序列

```bash
# 视频转图片
ffmpeg -i input.mp4 frame_%04d.png

# 图片转视频
ffmpeg -framerate 30 -i frame_%04d.png -c:v libx264 -preset fast -pix_fmt yuv420p output.mp4
```

## 烧录字幕

```bash
# 从 SRT 文件烧录
ffmpeg -i input.mp4 -vf "subtitles=subs.srt" \
  -c:v libx264 -crf 22 -c:a aac output.mp4

# 从 ASS 文件烧录（带样式）
ffmpeg -i input.mp4 -vf "subtitles=subs.ass" \
  -c:v libx264 -crf 22 -c:a aac output.mp4
```
