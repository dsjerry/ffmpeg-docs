# Quick Start

Get up and running with FFmpeg in minutes. This page covers the most common operations you'll need day-to-day.

## 1. Inspect a File

```bash
ffprobe -hide_banner input.mp4
```

You will see codec info, duration, bitrate, and stream details.

## 2. Convert to Web-Optimized MP4

The most common output format for web delivery:

```bash
ffmpeg -i input.mov -c:v libx264 -preset fast -crf 22 \
  -c:a aac -b:a 128k -movflags +faststart output.mp4
```

::: tip What each option does
- `libx264` — H.264 video encoder (most compatible)
- `preset fast` — encoding speed (ultrafast → veryslow, faster = bigger files)
- `crf 22` — quality (0=lossless, 23=default, 51=worst)
- `+faststart` — moves metadata to the front for faster web loading
:::

## 3. Trim a Clip

```bash
# Extract 10 seconds starting at 1 minute 30 seconds
ffmpeg -i input.mp4 -ss 00:01:30 -t 10 \
  -c:v libx264 -crf 22 -c:a aac clip.mp4
```

For frame-accurate cutting with `-ss` before the input (faster seeking):

```bash
ffmpeg -ss 00:01:30 -i input.mp4 -t 10 \
  -c:v libx264 -crf 22 -c:a aac -avoid_negative_ts make_zero clip.mp4
```

## 4. Resize Video

```bash
# Scale to 720p (maintains aspect ratio with -2)
ffmpeg -i input.mp4 -vf "scale=1280:-2" \
  -c:v libx264 -preset fast -crf 22 output_720p.mp4

# Scale to 50% of original
ffmpeg -i input.mp4 -vf "scale=iw*0.5:ih*0.5" \
  -c:v libx264 -preset fast -crf 22 output_half.mp4
```

## 5. Extract Audio

```bash
# As AAC in M4A container
ffmpeg -i input.mp4 -vn -c:a copy audio.m4a

# As MP3
ffmpeg -i input.mp4 -vn -c:a libmp3lame -b:a 192k audio.mp3
```

## 6. Create GIF

```bash
# Simple (larger file)
ffmpeg -i input.mp4 -vf "fps=15,scale=480:-1" -loop 0 output.gif

# High quality with palette
ffmpeg -i input.mp4 -vf "fps=15,scale=480:-1:flags=lanczos,split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse" -loop 0 output.gif
```

## 7. Video to Images

```bash
# Extract one frame per second as JPEG
ffmpeg -i input.mp4 -vf "fps=1" frame_%04d.jpg

# Extract every 30th frame
ffmpeg -i input.mp4 -vf "select=not(mod(n\,30))" -vsync vfr frame_%04d.png
```

## 8. Concatenate Clips

```bash
# Create list
cat > list.txt << 'EOF'
file 'intro.mp4'
file 'main.mp4'
file 'outro.mp4'
EOF

# Merge
ffmpeg -f concat -safe 0 -i list.txt -c copy merged.mp4
```

## 9. Add Watermark/Overlay

```bash
# Image watermark (top-right, 10px padding)
ffmpeg -i input.mp4 -i logo.png -filter_complex \
  "overlay=W-w-10:10" -c:a copy output.mp4

# Text watermark
ffmpeg -i input.mp4 -vf "drawtext=text='Copyright':fontsize=24:fontcolor=white:x=10:y=10" \
  -c:a copy output.mp4
```

## 10. Normalize Audio

```bash
ffmpeg -i input.wav -af "loudnorm=I=-16:TP=-1.5:LRA=11" output.wav
```

This is essential for podcasts and music — it brings the average loudness to a consistent level.

## Next Steps

- Explore [Commands](/en/commands/ffmpeg) for detailed reference
- Check the [Cheat Sheet](/en/cheat-sheet) for a quick reference
- Learn about [Filters](/en/filters/video-filters) for advanced processing
