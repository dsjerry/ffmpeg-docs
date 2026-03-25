# AV1

AV1 is the **newest open, royalty-free video codec** developed by the Alliance for Open Media. It offers better compression than H.265 with no licensing fees.

## Encoding with libsvtav1 (Fastest)

```bash
# Basic AV1 encoding
ffmpeg -i input.mp4 -c:v libsvtav1 -crf 40 \
  -c:a libopus -b:a 128k output_av1.mkv

# Higher quality
ffmpeg -i input.mp4 -c:v libsvtav1 -crf 30 \
  -preset 8 \
  -c:a libopus -b:a 192k output_av1_hq.mkv

# Small file
ffmpeg -i input.mp4 -c:v libsvtav1 -crf 50 \
  -preset 10 \
  -c:a libopus -b:a 64k output_av1_small.mkv
```

## Encoding with libaom (Slow but Best Quality)

```bash
# CPU-intensive, use for archival
ffmpeg -i input.mp4 -c:v libaom-av1 -crf 35 -cpu-used 0 \
  -c:a libopus -b:a 192k output_av1_aom.mkv
```

## Encoding Speed (libsvtav1)

| Preset | Speed | Best For |
|--------|-------|----------|
| 5-6 | Fastest | Live streaming |
| 8 | Default | VOD, web delivery |
| 10 | Slowest | Archival |

## Comparison

| Codec | Compression | Speed | Royalty | Browser Support |
|-------|-------------|-------|---------|----------------|
| H.264 | Baseline | Fastest | Patent pool | Universal |
| H.265 | Good | Fast | Patent pool | Growing |
| VP9 | Good | Medium | Free | Chrome, Firefox, Edge |
| AV1 | Best | Slow | Free | Chrome, Firefox, Edge (modern) |

## AV1 for Streaming

```bash
# AV1 for web delivery
ffmpeg -i input.mp4 -c:v libsvtav1 -crf 38 -preset 8 \
  -g 240 \
  -c:v libsvtav1 -crf 38 -svtav1-params "tune=0" \
  -c:a libopus -b:a 128k output_av1_streaming.mp4

# Adaptive bitrate with AV1
ffmpeg -i input.mp4 \
  -c:v libsvtav1 -crf 35 -preset 8 -b:v:0 3000k -maxrate:v:0 4500k \
  -c:v libsvtav1 -crf 40 -preset 8 -b:v:1 1500k -maxrate:v:1 2250k \
  -c:v libsvtav1 -crf 45 -preset 8 -b:v:2 800k -maxrate:v:2 1200k \
  -c:a libopus -b:a 128k \
  -f tee "[select=v:0,a:0]output_3000.mkv|[select=v:1,a:0]output_1500.mkv|[select=v:2,a:0]output_800.mkv"
```

## AV1 with HDR

```bash
# AV1 HDR10
ffmpeg -i input.mkv -c:v libsvtav1 -crf 30 \
  -pix_fmt yuv420p10le -svtav1-params "hdr=1" \
  -c:a eac3_at -b:a 384k \
  output_av1_hdr.mkv
```

::: tip Browser Support
AV1 hardware decoding is available in Chrome 107+, Firefox 118+, Edge 107+, and Safari 16.4+ (with some limitations). Software decoding works in all modern browsers but may be CPU-intensive on older devices.
:::
