# Scaling & Resizing

FFmpeg's `scale` filter adjusts video dimensions. Always use `-2` for the output height to ensure dimensions are divisible by 2 (required by many codecs).

## Basic Scaling

```bash
# Scale to 720p (maintain aspect ratio)
ffmpeg -i input.mp4 -vf "scale=1280:-2" output.mp4

# Scale to 480p
ffmpeg -i input.mp4 -vf "scale=854:-2" output.mp4

# Scale to specific dimensions (ignore aspect ratio)
ffmpeg -i input.mp4 -vf "scale=1920:1080" output.mp4

# Scale to 50%
ffmpeg -i input.mp4 -vf "scale=iw*0.5:ih*0.5" output.mp4

# Scale to 2x
ffmpeg -i input.mp4 -vf "scale=iw*2:ih*2" output.mp4
```

## Scaling with Encoding

```bash
# Scale + encode with H.264
ffmpeg -i input.mp4 -vf "scale=1280:-2" \
  -c:v libx264 -preset fast -crf 22 \
  -c:a aac output_720p.mp4

# Scale to 480p with fast encoding
ffmpeg -i input.mp4 -vf "scale=854:-2" \
  -c:v libx264 -preset ultrafast -crf 28 \
  -c:a aac output_480p.mp4
```

## Upscaling vs Downscaling

```bash
# Upscale with fast bilinear (faster, lower quality)
ffmpeg -i input.mp4 -vf "scale=1920:1080:flags=bilinear" output.mp4

# Upscale with Lanczos (slower, better quality)
ffmpeg -i input.mp4 -vf "scale=1920:1080:flags=lanczos" output.mp4

# Scale to exactly 1920x1080 (crop or pad to fit)
ffmpeg -i input.mp4 -vf "scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2" output.mp4
```

## Letterbox / Pillarbox (Add Black Bars)

```bash
# Fit to 16:9 with black bars
ffmpeg -i input.mp4 -vf "scale=1280:720:force_original_aspect_ratio=decrease,pad=1280:720:(ow-iw)/2:(oh-ih)/2:setsar=1" \
  -c:v libx264 -preset fast -crf 22 output_padded.mp4
```

## Scale with Crop Detection

```bash
# Detect crop automatically
ffmpeg -i input.mp4 -vf "cropdetect=limit=0:round=2" -frames:v 50 -f null -

# Use detected crop values
ffmpeg -i input.mp4 -vf "crop=1920:800:0:140" -c:v libx264 -preset fast output_cropped.mp4
```

## Multiple Outputs at Once

```bash
# Create multiple resolutions
ffmpeg -i input.mp4 \
  -vf "scale=1920:-2" -c:v libx264 -preset fast -crf 22 -c:a aac -b:a 192k -sn -map 0:v:0 -map 0:a:0 output_1080p.mp4 \
  -vf "scale=1280:-2" -c:v libx264 -preset fast -crf 22 -c:a aac -b:a 128k -sn -map 0:v:0 -map 0:a:0 output_720p.mp4 \
  -vf "scale=854:-2" -c:v libx264 -preset fast -crf 24 -c:a aac -b:a 96k -sn -map 0:v:0 -map 0:a:0 output_480p.mp4
```

## Rotate / Flip

```bash
# Rotate 90 clockwise
ffmpeg -i input.mp4 -vf "rotate=PI/2" -c:a copy output.mp4

# Rotate 90 counter-clockwise
ffmpeg -i input.mp4 -vf "rotate=-PI/2" -c:a copy output.mp4

# Flip horizontally
ffmpeg -i input.mp4 -vf "hflip" -c:a copy output.mp4

# Flip vertically
ffmpeg -i input.mp4 -vf "vflip" -c:a copy output.mp4
```

## Scale Variables Reference

| Variable | Description |
|----------|-------------|
| `iw` | Input width |
| `ih` | Input height |
| `ow` | Output width |
| `oh` | Output height |
| `in` | Input frame number |
| `on` | Output frame number |
| `sar` | Input sample aspect ratio |
| `dar` | Input display aspect ratio |
