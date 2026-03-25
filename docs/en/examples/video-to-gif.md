# Video to GIF

Converting video to GIF is one of the most common FFmpeg operations. There are two approaches: simple (faster, larger file) and high-quality (slower, smaller file).

## Simple Method

```bash
# Basic GIF from first 10 seconds
ffmpeg -i input.mp4 -t 10 -vf "fps=15,scale=480:-1" -loop 0 output.gif
```

## High-Quality Method (Recommended)

The palette method generates a custom color palette for better quality:

```bash
# Step 1: Generate palette
ffmpeg -i input.mp4 -vf "fps=15,scale=480:-1:flags=lanczos,palettegen=stats_mode=diff" palette.png

# Step 2: Create GIF using palette
ffmpeg -i input.mp4 -i palette.png -t 10 \
  -lavfi "fps=15,scale=480:-1:flags=lanczos[x];[x][1:v]paletteuse=dither=bayer:bayer_scale=5:diff_mode=rectangle" \
  -loop 0 output.gif
```

## One-Liner (Using Palette)

```bash
# Optimized one-liner
ffmpeg -i input.mp4 -vf "fps=15,scale=480:-1:flags=lanczos,split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse=dither=bayer:bayer_scale=5" \
  -loop 0 output.gif
```

## GIF Parameters Explained

| Parameter | Description |
|-----------|-------------|
| `fps=n` | Frames per second (15-20 recommended for GIF) |
| `scale=w:-1` | Scale width to `w`, height auto (-2 keeps divisible by 2) |
| `flags=lanczos` | High-quality downscaling filter |
| `-loop 0` | Infinite loop (use `-loop N` for N loops) |
| `-t n` | Duration in seconds |

## Extract Specific Portion

```bash
# GIF from 5s to 15s
ffmpeg -ss 5 -t 10 -i input.mp4 \
  -vf "fps=15,scale=480:-1:flags=lanczos,split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse" \
  -loop 0 output.gif
```

## Trim by Frame Count

```bash
# First 100 frames
ffmpeg -i input.mp4 -vframes 100 \
  -vf "fps=15,scale=480:-1:flags=lanczos,split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse" \
  -loop 0 output.gif
```

## Mobile-Friendly (Small Size)

```bash
ffmpeg -i input.mp4 -t 5 \
  -vf "fps=10,scale=320:-1:flags=fast_bilinear,split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse" \
  -loop 0 output_small.gif
```

## Text Overlay on GIF

```bash
ffmpeg -i input.mp4 -t 5 \
  -vf "fps=15,scale=480:-1:flags=lanczos,drawtext=text='Hello':fontsize=24:fontcolor=white:borderw=2:bordercolor=black,split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse" \
  -loop 0 output_text.gif
```

## Batch Convert All Videos in Folder

```bash
for f in *.mp4; do
  ffmpeg -i "$f" -vf "fps=15,scale=480:-1:flags=lanczos,split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse" \
    -loop 0 "${f%.mp4}.gif"
done
```

## Output Quality Comparison

| Method | FPS | Resolution | Typical Size (10s) |
|--------|-----|------------|-------------------|
| Simple | 10 | 320p | 3-5 MB |
| High-quality | 15 | 480p | 1-3 MB |
| High-quality | 20 | 480p | 2-5 MB |
| Low-quality | 10 | 240p | 0.5-1 MB |
