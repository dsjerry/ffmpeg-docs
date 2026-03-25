# Contact Sheet (Thumbnails Grid)

A contact sheet (also called a thumbnail grid or filmstrip) generates a single image showing multiple frames from a video — useful for previewing video content.

## Basic Contact Sheet

```bash
ffmpeg -i input.mp4 -vf "fps=1/10,scale=320:-1,tile=4x4" -frames:v 1 sheet.png
```

This generates one image every 10 seconds (`fps=1/10`), scales each frame to 320px wide, and arranges them in a 4x4 grid.

## Parameters Explained

| Parameter | Description |
|-----------|-------------|
| `fps=1/n` | One frame every `n` seconds |
| `scale=w:-1` | Scale each thumbnail to width `w` |
| `tile=MxN` | Arrange in M columns and N rows |

## Common Grid Sizes

```bash
# 3x3 grid (9 thumbnails)
ffmpeg -i input.mp4 -vf "fps=1/10,scale=320:-1,tile=3x3" -frames:v 1 sheet_3x3.png

# 5x5 grid (25 thumbnails)
ffmpeg -i input.mp4 -vf "fps=1/10,scale=240:-1,tile=5x5" -frames:v 1 sheet_5x5.png

# 6x4 grid (24 thumbnails)
ffmpeg -i input.mp4 -vf "fps=1/15,scale=320:-1,tile=6x4" -frames:v 1 sheet_6x4.png
```

## With Labels (Frame Numbers)

```bash
ffmpeg -i input.mp4 -vf "fps=1/10,scale=320:-1,tile=4x4:color=black@0.8:margin_w=4:margin_h=4,drawtext=text='%{n}':fontsize=16:fontcolor=white:x=(w-text_w)/2:y=h-text_h-4" \
  -frames:v 1 sheet_labeled.png
```

## Filmstrip Style (1 Row)

```bash
# Horizontal strip of 10 frames
ffmpeg -i input.mp4 -vf "fps=1/5,scale=320:-1,tile=1x10:padding=4:color=black@0.5" \
  -frames:v 1 strip.png
```

## Custom Padding and Spacing

```bash
ffmpeg -i input.mp4 \
  -vf "fps=1/10,scale=320:-1,tile=4x4:margin=8:padding=4:color=black@0.3" \
  -frames:v 1 sheet_padded.png
```

## HD Contact Sheet

```bash
ffmpeg -i input.mp4 \
  -vf "fps=1/30,scale=640:-1,tile=8x6:color=black@0.5" \
  -frames:v 1 sheet_hd.png
```

## Extract at Specific Timestamps

```bash
# Thumbnails at 0s, 10s, 20s, 30s, 40s, 50s, 60s, 70s
ffmpeg -i input.mp4 \
  -vf "select=eq(n\,0)+eq(n\,100)+eq(n\,200)+eq(n\,300)+eq(n\,400)+eq(n\,500)+eq(n\,600)+eq(n\,700),scale=320:-1,tile=4x2" \
  -frames:v 1 sheet_custom.png
```

Or using scene detection:

```bash
ffmpeg -i input.mp4 \
  -vf "select='gt(scene,0.3)',scale=320:-1,tile=4x3" \
  -frames:v 1 sheet_scenes.png
```

## Batch Generation

```bash
# Create contact sheet for all videos in folder
for f in *.mp4; do
  ffmpeg -i "$f" -vf "fps=1/10,scale=320:-1,tile=4x4" -frames:v 1 "sheet_${f%.mp4}.png"
done
```

## Combine with Text Info

```bash
# Get duration for filename
DURATION=$(ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "$f")
THUMBNAILS=$(ffprobe -v error -select_streams v:0 -show_entries stream=nb_frames -of default=nokey=1:noprint_wrappers=1 "$f")

ffmpeg -i "$f" \
  -vf "fps=1/10,scale=320:-1,tile=4x4" \
  -frames:v 1 \
  -filename:"sheet_${f%.mp4}.png"
```

## High-Quality Thumbnails

```bash
ffmpeg -i input.mp4 \
  -vf "fps=1/10,scale=640:-2:flags=lanczos,tile=4x4:color=black@0.2" \
  -frames:v 1 \
  -q:v 1 \
  sheet_hq.png
```
