# FFmpeg Cheat Sheet

A quick reference for the most commonly used FFmpeg commands.

## Inspect Files

```bash
# File info
ffprobe -hide_banner input.mp4

# JSON metadata
ffprobe -v error -show_format -show_streams -of json input.mp4

# Duration only
ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 input.mp4

# Video codec, resolution, fps
ffprobe -v error -select_streams v:0 -show_entries stream=codec_name,width,height,r_frame_rate -of csv=p=0 input.mp4
```

## Convert Formats

```bash
# MKV → MP4 (lossless remux)
ffmpeg -i input.mkv -c copy output.mp4

# Any → MP4 (H.264 + AAC, web optimized)
ffmpeg -i input.avi -c:v libx264 -preset fast -crf 22 \
  -c:a aac -b:a 128k -movflags +faststart output.mp4

# Any → WebM (VP9 + Opus)
ffmpeg -i input.mp4 -c:v libvpx-vp9 -crf 30 -b:v 0 \
  -c:a libopus -b:a 128k output.webm

# Any → GIF (simple)
ffmpeg -i input.mp4 -vf "fps=15,scale=480:-1" -loop 0 output.gif

# Any → GIF (high quality)
ffmpeg -i input.mp4 -vf "fps=15,scale=480:-1:flags=lanczos,split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse" -loop 0 output.gif
```

## Video Processing

```bash
# Scale to 720p
ffmpeg -i input.mp4 -vf "scale=1280:-2" -c:v libx264 -preset fast output_720p.mp4

# Trim 30 seconds from 1:00
ffmpeg -ss 60 -i input.mp4 -t 30 -c copy output.mp4

# Accurate trim (re-encode)
ffmpeg -ss 60 -i input.mp4 -t 30 -c:v libx264 -crf 22 -c:a aac output.mp4

# Concatenate videos
ffmpeg -f concat -safe 0 -i list.txt -c copy merged.mp4

# Extract frames
ffmpeg -ss 00:01:00 -i input.mp4 -frames:v 1 screenshot.jpg

# Extract one frame per second
ffmpeg -i input.mp4 -vf "fps=1" frame_%04d.jpg
```

## Audio Processing

```bash
# Extract audio (copy)
ffmpeg -i input.mp4 -vn -c:a copy audio.m4a

# Extract & convert to MP3
ffmpeg -i input.mp4 -vn -c:a libmp3lame -b:a 192k audio.mp3

# Add audio to video
ffmpeg -i video.mp4 -i audio.mp3 -c:v copy -c:a aac -b:a 128k -shortest output.mp4

# Normalize loudness
ffmpeg -i input.wav -af "loudnorm=I=-16:TP=-1.5:LRA=11" output.wav

# Fade in/out
ffmpeg -i input.mp3 -af "afade=t=in:ss=0:d=2,afade=t=out:st=57:d=3" output.mp3
```

## Subtitles

```bash
# Extract subtitles
ffmpeg -i input.mp4 -map 0:s:0 output.srt

# Burn subtitles into video
ffmpeg -i input.mp4 -vf "subtitles=subs.srt" \
  -c:v libx264 -crf 22 -c:a aac output_with_subs.mp4

# Add soft subtitles (track)
ffmpeg -i input.mp4 -i subs.srt -c:v copy -c:a copy \
  -c:s srt -metadata:s:s:0 language=eng output.mp4
```

## Watermarks & Overlays

```bash
# Image watermark (top-right)
ffmpeg -i input.mp4 -i logo.png \
  -filter_complex "overlay=W-w-10:10" -c:a copy output.mp4

# Text watermark
ffmpeg -i input.mp4 -vf "drawtext=text='Copyright':fontsize=24:fontcolor=white:x=10:y=10" \
  -c:a copy output.mp4
```

## Streaming

```bash
# HLS (VOD)
ffmpeg -i input.mp4 -c:v libx264 -preset fast -crf 22 \
  -c:a aac -b:a 128k -hls_time 6 \
  -hls_playlist_type vod -hls_segment_filename "seg_%03d.ts" \
  stream.m3u8

# RTMP publish
ffmpeg -re -i input.mp4 -c:v libx264 -preset veryfast -b:v 4500k \
  -c:a aac -b:a 160k -f flv rtmp://server/live/stream_key
```

## Encoding Quality

| CRF Value | Quality | Use Case |
|-----------|---------|----------|
| 18-20 | Near lossless | High-quality archival |
| 20-23 | High | Default high quality |
| 23-26 | Good | Streaming |
| 26-29 | Acceptable | Low bandwidth |
| 29+ | Low | Minimum quality |

## H.264 Presets (Speed vs Compression)

| Preset | Speed | Compression |
|--------|-------|-------------|
| `ultrafast` | Fastest | Lowest |
| `superfast` | | |
| `veryfast` | | |
| `faster` | | |
| `fast` | | |
| `medium` | Default | |
| `slow` | | |
| `slower` | | |
| `veryslow` | Slowest | Best |

## Useful Flags

| Flag | Description |
|------|-------------|
| `-y` | Overwrite without asking |
| `-n` | Never overwrite |
| `-hide_banner` | Hide startup banner |
| `-c copy` | Copy streams (no re-encode) |
| `-c:v copy` | Copy video only |
| `-c:a copy` | Copy audio only |
| `-vn` | No video |
| `-an` | No audio |
| `-threads n` | Limit CPU threads |
| `-progress url` | Log progress |
