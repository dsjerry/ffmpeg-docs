# Codec Overview

A **codec** (coder/decoder) compresses and decompresses audio and video data. FFmpeg supports hundreds of codecs natively.

## Listing Codecs

```bash
# List all codecs
ffmpeg -codecs

# List only encoders
ffmpeg -encoders

# List only decoders
ffmpeg -decoders

# Search for specific codec
ffmpeg -encoders | grep h264
```

## Video Codec Categories

| Category | Description | Codecs |
|----------|-------------|--------|
| **H.264 family** | Most widely compatible | libx264, h264_nvenc, h264_videotoolbox |
| **H.265 family** | Better compression, less compatibility | libx265, hevc_nvenc, hevc_videotoolbox |
| **VPx** | Royalty-free web codecs | libvpx-vp8, libvpx-vp9 |
| **AV1** | Newest, best compression | libaom-av1, libsvtav1 |
| **ProRes** | Professional editing | prores, prores_ks |
| **DNxHD** | Professional editing | dnxhd |
| **GIF** | Animation | gif |
| **PNG/JPEG** | Image | mjpeg, png |

## Audio Codec Categories

| Category | Description | Codecs |
|----------|-------------|--------|
| **AAC** | Most common, web streaming | aac, libfdk_aac, aac_fixed |
| **MP3** | Universal compatibility | libmp3lame |
| **Opus** | Low latency, voice/music | libopus |
| **Vorbis** | Open, web | libvorbis |
| **FLAC** | Lossless | flac |
| **PCM** | Uncompressed | pcm_s16le, pcm_s24le |
| **AC3** | DVD/Blu-ray | ac3 |
| **E-AC3** | Blu-ray, streaming | eac3 |

## Copy Mode

The fastest way to transcode is copying streams when the codec doesn't need to change:

```bash
# Copy all streams (container conversion only)
ffmpeg -i input.mkv -c copy output.mp4

# Copy video, re-encode audio
ffmpeg -i input.mkv -c:v copy -c:a aac output.mp4

# Copy audio, re-encode video
ffmpeg -i input.mkv -c:v libx264 -preset fast -crf 22 -c:a copy output.mp4
```

## Copy-Specific Options

```bash
# Copy with stream selection
ffmpeg -i input.mkv \
  -map 0:v:0 -map 0:a:1 -map 0:s \
  -c:v copy -c:a copy -c:s copy \
  output.mp4
```

## Choosing a Codec

| Use Case | Recommended Video | Recommended Audio |
|----------|------------------|-------------------|
| Web (MP4) | libx264 | aac |
| Web (WebM) | libvpx-vp9 | libopus |
| Archival | FFV1 | FLAC |
| Editing | ProRes 422 HQ / DNxHD | PCM |
| Streaming | libx264 / h264_nvenc | aac / libopus |
| Mobile | libx264 | aac |
| GIF | gif / palettegen | — |
| Ultra-low latency | h264_nvenc | libopus |
