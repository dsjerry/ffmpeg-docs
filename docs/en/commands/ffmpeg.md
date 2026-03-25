# ffmpeg

The `ffmpeg` command is the core tool for converting, encoding, decoding, and processing audio and video.

## Synopsis

```
ffmpeg [global_options] {[input_file_options] -i input_url} ... {[output_file_options] output_url} ...
```

## Most Common Options

| Option | Description |
|--------|-------------|
| `-i url` | Input file URL |
| `-c[:stream] codec` | Codec for a stream (copy, libx264, aac, etc.) |
| `-c:v` | Video codec shorthand |
| `-c:a` | Audio codec shorthand |
| `-c:s` | Subtitle codec shorthand |
| `-codecs` | List all codecs |
| `-encoders` | List all encoders |
| `-decoders` | List all decoders |
| `-filters` | List all filters |
| `-formats` | List all formats |
| `-bsf[:stream] bitstream_filter` | Apply a bitstream filter to a stream |
| `-map [-]input_file_id[:stream_index][:sync_file_id[:sync_stream_index]]` | Manual stream mapping |
| `-t duration` | Restrict transcoded/captured audio/video to duration |
| `-ss position` | Seek to position (before `-i` = fast, after = accurate) |
| `-to position` | Stop writing at position |
| `-f fmt` | Force input/output format |
| `-y` | Overwrite output files without asking |
| `-n` | Never overwrite output files |
| `-loglevel loglevel` | Set logging level |
| `-hide_banner` | Hide startup banner |
| `-stats` | Print encoding progress |

## Codec Copy Mode

Use `-c copy` to copy streams without re-encoding (fastest, lossless):

```bash
# Copy all streams (fastest possible)
ffmpeg -i input.mkv -c copy output.mp4

# Copy video, re-encode audio
ffmpeg -i input.mkv -c:v copy -c:a aac output.mp4

# Copy audio, re-encode video
ffmpeg -i input.mkv -c:v libx264 -preset fast -crf 22 -c:a copy output.mp4
```

## Encoding Quality

### CRF (Constant Rate Factor) — Recommended

```bash
# CRF range: 0 (lossless) to 51 (worst)
# 18-23: perceptually lossless / high quality
# 23-28: good quality for streaming
# 28-35: smaller files, visible artifacts
ffmpeg -i input.mp4 -c:v libx264 -crf 22 output.mp4
```

### Preset (Encoding Speed)

| Preset | Speed | Use Case |
|--------|-------|----------|
| `ultrafast` | Fastest | Live streaming, real-time |
| `superfast` | | |
| `veryfast` | | |
| `faster` | | |
| `fast` | | High-quality encoding |
| `medium` | | Default |
| `slow` | | |
| `slower` | | Best compression |
| `veryslow` | Slowest | Archive/master files |

```bash
ffmpeg -i input.mp4 -c:v libx264 -preset veryslow -crf 18 output.mp4
```

## Hardware Acceleration

```bash
# NVIDIA NVENC
ffmpeg -i input.mp4 -c:v h264_nvenc -preset p7 -cq 23 output.mp4

# Intel VAAPI (Linux)
ffmpeg -hwaccel vaapi -hwaccel_output_format vaapi -i input.mp4 \
  -c:v h264_vaapi output.mp4

# macOS VideoToolbox
ffmpeg -i input.mp4 -c:v h264_videotoolbox -b:v 6M output.mp4
```

## Input/Output Options

```bash
# Limit duration
ffmpeg -i input.mp4 -t 60 output.mp4

# Limit output size
ffmpeg -i input.mp4 -fs 10M output.mp4

# Seek to position (before input = faster seek)
ffmpeg -ss 01:30 -i input.mp4 -t 30 -c copy output.mp4

# Multiple inputs
ffmpeg -i video.mp4 -i audio.mp3 -c:v copy -c:a aac output.mp4

# Skip input streams
ffmpeg -i input.mkv -map 0:v -map 0:a:1 -c copy output.mp4
```
