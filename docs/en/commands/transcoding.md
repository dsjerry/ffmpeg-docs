# Transcoding

Transcoding means converting media from one format/codec to another. This is the most common FFmpeg operation.

## Transcode to MP4 (H.264 + AAC)

```bash
ffmpeg -i input.avi -c:v libx264 -preset fast -crf 23 \
  -c:a aac -b:a 192k \
  -movflags +faststart \
  output.mp4
```

::: tip +faststart
This flag moves the `moov` atom to the beginning of the file, enabling progressive download (streaming) on the web. Always include this for web delivery.
:::

## WebM (VP9 + Opus)

```bash
ffmpeg -i input.mp4 -c:v libvpx-vp9 -crf 30 -b:v 0 \
  -c:a libopus -b:a 128k \
  output.webm
```

`-b:v 0` combined with `-crf` enables VBR (variable bitrate) encoding for VP9.

## ProRes for Editing

```bash
# ProRes 422 Proxy (fastest, smallest)
ffmpeg -i input.mov -c:v prores_ks -profile:v 0 output.mov

# ProRes 422 LT
ffmpeg -i input.mov -c:v prores_ks -profile:v 1 output.mov

# ProRes 422 (standard)
ffmpeg -i input.mov -c:v prores_ks -profile:v 2 output.mov

# ProRes 422 HQ (highest quality)
ffmpeg -i input.mov -c:v prores_ks -profile:v 3 output.mov
```

## DNxHD for Editing

```bash
# 1080p 145 Mbps
ffmpeg -i input.mov -c:v dnxhd -b:v 145M -c:a pcm_s16le output.mov

# 1080p 36 Mbps (LT)
ffmpeg -i input.mov -c:v dnxhd -b:v 36M -pix_fmt yuv422p -c:a pcm_s16le output.mov
```

## Convert Audio

```bash
# MP3 (constant bitrate)
ffmpeg -i input.wav -c:a libmp3lame -b:a 320k output.mp3

# MP3 (variable bitrate)
ffmpeg -i input.wav -c:a libmp3lame -q:a 2 output.mp3

# AAC
ffmpeg -i input.wav -c:a aac -b:a 256k output.m4a

# FLAC (lossless)
ffmpeg -i input.wav -c:a flac output.flac

# Opus
ffmpeg -i input.wav -c:a libopus -b:a 128k output.opus
```

## Image Sequence

```bash
# Video to images
ffmpeg -i input.mp4 frame_%04d.png

# Images to video
ffmpeg -framerate 30 -i frame_%04d.png -c:v libx264 -preset fast -pix_fmt yuv420p output.mp4
```

## Burn-in Subtitles

```bash
# From SRT file
ffmpeg -i input.mp4 -vf "subtitles=subs.srt" \
  -c:v libx264 -crf 22 -c:a aac output.mp4

# From ASS file with style
ffmpeg -i input.mp4 -vf "subtitles=subs.ass" \
  -c:v libx264 -crf 22 -c:a aac output.mp4
```
