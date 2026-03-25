# Basic Concepts

## Key Terminology

### Codec

A **codec** (coder/decoder) is an algorithm that compresses and decompresses audio or video data.

| Category | Codecs |
|----------|--------|
| Video | H.264, H.265/HEVC, VP8, VP9, AV1, ProRes, DNxHD |
| Audio | AAC, MP3, Opus, FLAC, AC3, PCM |

### Container Format

A **container** holds encoded audio/video data along with metadata, subtitles, and chapter information.

Common containers: **MP4**, **MKV**, **MOV**, **WebM**, **AVI**, **TS**, **MPEG**

### Bitrate

The amount of data per second. Higher bitrate = better quality = larger file.

- **CBR** (Constant Bitrate) — fixed rate throughout
- **VBR** (Variable Bitrate) — adapts quality to content complexity
- **CRF** (Constant Rate Factor) — quality-based encoding (FFmpeg-specific)

### Frame Rate

The number of frames per second (fps). Common values: 24, 25, 30, 60.

## Understanding FFmpeg Command Structure

The core rule: **Options apply to the next specified input or output file.**

```
ffmpeg [global_options] [input_options] -i input [output_options] output
```

```bash
ffmpeg -hide_banner          # global: suppress startup banner
     -y                      # global: overwrite output without asking
     -i input.mkv            # input file
     -c:v libx264            # output video codec
     -preset fast            # output video option
     -crf 22                 # output video option
     -c:a aac                # output audio codec
     -b:a 192k               # output audio option
     output.mp4              # output file
```

## Stream Selection

FFmpeg processes streams (video, audio, subtitle tracks) independently.

```bash
# Copy video stream, transcode audio
ffmpeg -i input.mkv -c:v copy -c:a aac output.mp4

# Extract only the first video stream
ffmpeg -i input.mkv -map 0:v:0 -c copy output.mp4

# Extract video + audio track 2
ffmpeg -i input.mkv -map 0:v:0 -map 0:a:1 -c copy output.mkv
```

## Two-Pass Encoding

For the best quality at a target bitrate, use two passes:

```bash
# Pass 1: analyze
ffmpeg -i input.mp4 -c:v libx264 -preset slow -bitrate 5M \
  -pass 1 -f rawvideo -y /dev/null

# Pass 2: encode
ffmpeg -i input.mp4 -c:v libx264 -preset slow -bitrate 5M \
  -pass 2 output.mp4
```

## Key Concepts Summary

| Concept | Description |
|---------|-------------|
| Codec | Compression/decompression algorithm |
| Container | File format holding streams + metadata |
| Bitrate | Data rate (quality vs. file size) |
| FPS | Frames per second |
| CRF | FFmpeg quality-based encoding (0=lossless, 23=default, 51=worst) |
| Preset | Encoding speed vs. compression tradeoff (ultrafast → veryslow) |
| Filter | Audio/video transformation applied during encoding |
| Stream | Individual video/audio/subtitle track in a container |
