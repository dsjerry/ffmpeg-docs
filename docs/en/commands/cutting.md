# Cutting & Trimming

FFmpeg offers several methods to trim videos, from fast stream-copy cuts to accurate re-encoded clips.

## Key Options

| Option | Description |
|--------|-------------|
| `-ss time` | Seek to position |
| `-t duration` | Duration to process |
| `-to time` | Stop at specific time |
| `-accuracy` | Set seeking accuracy (in seconds) |

## Fast Cut (Stream Copy)

Use `-c copy` to copy streams without re-encoding — very fast but less accurate.

```bash
# Copy first 30 seconds (before -i = fast seek)
ffmpeg -ss 0 -i input.mp4 -t 30 -c copy cut.mp4

# Copy from 1:00 to 1:30
ffmpeg -ss 60 -i input.mp4 -t 30 -c copy cut.mp4

# Use -to instead of -t
ffmpeg -ss 60 -i input.mp4 -to 90 -c copy cut.mp4
```

::: warning Inaccurate Cuts
Stream-copy cuts happen at keyframe boundaries, so the cut may not be frame-accurate. The actual start/end may differ slightly.
:::

## Accurate Cut (Re-encode)

For frame-accurate cuts, re-encode the video:

```bash
# Frame-accurate cut with re-encoding
ffmpeg -i input.mp4 -ss 00:01:30.500 -t 10 \
  -c:v libx264 -crf 22 -c:a aac \
  -avoid_negative_ts make_zero \
  cut.mp4

# Seek before input (fast analysis) + re-encode (accurate output)
ffmpeg -ss 00:01:30 -i input.mp4 -t 10 \
  -c:v libx264 -crf 22 -c:a aac \
  cut.mp4
```

## Cut by Scene (Using Filters)

```bash
# Detect scene changes and cut at each one
ffmpeg -i input.mp4 -vf "select='gt(scene,0.3)',setpts=N/FRAME_RATE/TB" \
  -c:v libx264 -crf 22 -c:a aac clip_%03d.mp4
```

## Split at Multiple Points

```bash
# Keep only first 60 seconds
ffmpeg -i input.mp4 -t 60 -c copy part1.mp4

# Skip first 30 seconds, keep rest
ffmpeg -ss 30 -i input.mp4 -c copy part2.mp4

# Remove middle section (re-encode required)
ffmpeg -i input.mp4 \
  -t 30 -c copy intro.mp4 \
  -ss 90 -t 60 -c copy middle_removed.mp4 \
  -i input.mp4 -ss 150 -c copy outro.mp4
```

## Timestamp Format

FFmpeg accepts timestamps in multiple formats:

```bash
# Seconds only
ffmpeg -i input.mp4 -ss 90 -t 30 output.mp4

# HH:MM:SS
ffmpeg -i input.mp4 -ss 00:01:30 -t 00:00:30 output.mp4

# HH:MM:SS.ms (milliseconds)
ffmpeg -i input.mp4 -ss 00:01:30.500 -t 10.250 output.mp4

# From end of file (negative)
ffmpeg -i input.mp4 -sseof -30 -c copy output.mp4
```

## Concatenate with Transitions

```bash
# Concat demuxer for multiple clips
cat > list.txt << 'EOF'
file 'intro.mp4'
file 'main.mp4'
file 'outro.mp4'
EOF

ffmpeg -f concat -safe 0 -i list.txt -c copy merged.mp4
```

## Trim Audio

```bash
# Extract first 30 seconds of audio
ffmpeg -i input.mp4 -ss 0 -t 30 -vn -c:a copy audio_cut.m4a

# Extract from 1:00 to 1:30
ffmpeg -i input.mp4 -ss 60 -t 30 -vn -c:a libmp3lame -b:a 192k audio.mp3
```
