# Watermarks

Adding watermarks (text, logos, or images) to videos is a common requirement for branding and copyright protection.

## Image Watermark (Logo)

### Top-Right Corner

```bash
ffmpeg -i input.mp4 -i logo.png \
  -filter_complex "overlay=W-w-10:10" \
  -c:a copy output.mp4
```

### Bottom-Right Corner

```bash
ffmpeg -i input.mp4 -i logo.png \
  -filter_complex "overlay=W-w-10:H-h-10" \
  -c:a copy output.mp4
```

### Bottom-Left Corner

```bash
ffmpeg -i input.mp4 -i logo.png \
  -filter_complex "overlay=10:H-h-10" \
  -c:a copy output.mp4
```

### Center

```bash
ffmpeg -i input.mp4 -i logo.png \
  -filter_complex "overlay=(W-w)/2:(H-h)/2" \
  -c:a copy output.mp4
```

## Text Watermark

### Simple Text

```bash
ffmpeg -i input.mp4 -vf "drawtext=text='Copyright 2024':fontsize=24:fontcolor=white:x=10:y=10" \
  -c:a copy output.mp4
```

### Text with Border (More Visible)

```bash
ffmpeg -i input.mp4 -vf "drawtext=text='Copyright 2024':fontsize=24:fontcolor=white:borderw=2:bordercolor=black:x=10:y=10" \
  -c:a copy output.mp4
```

### Text with Background

```bash
ffmpeg -i input.mp4 -vf "drawtext=text='Copyright 2024':fontsize=24:fontcolor=white:box=1:boxcolor=black@0.5:boxborderw=4:x=10:y=10" \
  -c:a copy output.mp4
```

### Text with Timestamp

```bash
ffmpeg -i input.mp4 -vf "drawtext=text='%{pts\\:hms}':fontsize=20:fontcolor=white:x=10:y=h-th-10" \
  -c:a copy output.mp4
```

### Dynamic Text (Changing Over Time)

```bash
ffmpeg -i input.mp4 -vf "drawtext=text='Recording':fontsize=36:fontcolor=white:x=10:y=10:enable='between(t,0,10)'" \
  -c:a copy output.mp4
```

## Watermark Size and Opacity

### Resize Logo

```bash
ffmpeg -i input.mp4 -i logo.png \
  -filter_complex "[1:v]scale=100:100[wm];[0:v][wm]overlay=W-w-20:20" \
  -c:a copy output.mp4
```

### Semi-Transparent Logo

```bash
# Create semi-transparent version first
ffmpeg -i logo.png -vf "format=rgba,colorchannelmixer=aa=0.5" logo_alpha.png

# Apply
ffmpeg -i input.mp4 -i logo_alpha.png \
  -filter_complex "overlay=W-w-20:20" \
  -c:a copy output.mp4
```

## Position Formulas

| Position | Formula |
|----------|---------|
| Top-Left | `10:10` |
| Top-Right | `W-w-10:10` |
| Bottom-Left | `10:H-h-10` |
| Bottom-Right | `W-w-10:H-h-10` |
| Center | `(W-w)/2:(H-h)/2` |
| Top-Center | `(W-w)/2:10` |
| Bottom-Center | `(W-w)/2:H-h-10` |

## Multiple Watermarks

```bash
# Logo + Text
ffmpeg -i input.mp4 -i logo.png \
  -filter_complex "[0:v]drawtext=text='Channel':fontsize=18:fontcolor=white:borderw=1:bordercolor=black:x=10:y=10[bg];[bg][1:v]overlay=W-w-10:10" \
  -c:a copy output.mp4
```

## Animated Watermark (Moving)

```bash
# Logo moves from left to right
ffmpeg -i input.mp4 -i logo.png \
  -filter_complex "[1:v]scale=80:80[wm];[0:v][wm]overlay='x=mod(t*50,n*W)':y=20" \
  -c:a copy output.mp4

# Fade-in watermark
ffmpeg -i input.mp4 -i logo.png \
  -filter_complex "[1:v]scale=80:80,fade=t=out:st=10:d=2:alpha=1[wm];[0:v][wm]overlay=W-w-20:20:enable='between(t,0,10)'" \
  -c:a copy output.mp4
```

## Tile Watermark (Repeated Grid)

```bash
ffmpeg -i input.mp4 -i logo.png \
  -filter_complex "[1:v]scale=50:50[tile];[tile][tile][tile][tile]hstack=4[tiles];[0:v][tiles]overlay='(W-w)/2:(H-h)/2'" \
  -c:a copy output.mp4
```

## Semi-Transparent Video (Branding Overlay)

```bash
# Entire video with semi-transparent overlay
ffmpeg -i input.mp4 -f lavfi -i "color=black@0.3:s=1280x720" \
  -filter_complex "[0:v][1:v]blend=all_mode=overlay:all_opacity=0.1" \
  -c:a copy output.mp4
```

## Batch Add Watermark

```bash
for f in *.mp4; do
  ffmpeg -i "$f" -i logo.png \
    -filter_complex "overlay=W-w-10:10" \
    -c:a copy "watermarked_${f}"
done
```
