# Video Filters

FFmpeg's filter system applies transformations to video during encoding. Use `-vf` (video filter) for simple chains and `-filter_complex` for multiple inputs/outputs.

## Color & Adjustment

```bash
# Brightness (-1.0 to 1.0)
ffmpeg -i input.mp4 -vf "eq=brightness=0.1" output.mp4

# Contrast (0.0 to 2.0)
ffmpeg -i input.mp4 -vf "eq=contrast=1.2" output.mp4

# Saturation (0.0 to 3.0)
ffmpeg -i input.mp4 -vf "eq=saturation=1.5" output.mp4

# Hue shift (-180 to 180 degrees)
ffmpeg -i input.mp4 -vf "eq=hue=30" output.mp4

# All adjustments combined
ffmpeg -i input.mp4 -vf "eq=brightness=0.05:contrast=1.1:saturation=1.2" output.mp4

# Color grading (color levels)
ffmpeg -i input.mp4 -vf "colorlevels=rimax=0.9:gimax=0.9:bimax=0.9" output.mp4
```

## Blur & Sharpen

```bash
# Gaussian blur
ffmpeg -i input.mp4 -vf "blur=10" output.mp4

# Selective blur (only blur a region)
ffmpeg -i input.mp4 -vf "boxblur=2:1" output.mp4

# Sharpen
ffmpeg -i input.mp4 -vf "unsharp=5:5:1.0" output.mp4

# Sharpen with parameters (luma x, luma y, amount, chroma x, chroma y, amount)
ffmpeg -i input.mp4 -vf "unsharp=7:7:0.5:7:7:0.5" output.mp4
```

## Deinterlace & Frame Rate

```bash
# Deinterlace (bob method — doubles frame rate)
ffmpeg -i input.mp4 -vf "bwdif=mode=1" output.mp4

# Yadif deinterlace
ffmpeg -i input.mp4 -vf "yadif=1:-1:0" output.mp4

# Change frame rate
ffmpeg -i input.mp4 -vf "fps=30" output.mp4

# Double frame rate (interpolate frames)
ffmpeg -i input.mp4 -vf "minterpolate=fps=60" output.mp4
```

## De-noise & Denoise

```bash
# Spatial denoise (fast)
ffmpeg -i input.mp4 -vf "denoise0n=0:0:3:0:0:3" output.mp4

# HQDN3D (temporal + spatial)
ffmpeg -i input.mp4 -vf "hqdn3d=4:3:4:3" output.mp4

# NRGB denoise
ffmpeg -i input.mp4 -vf "nlmeans=s=3" output.mp4
```

## Stabilization

```bash
# Analyze first (generate.trf file)
ffmpeg -i input.mp4 -vf "vidstabdetect=shakiness=5:accuracy=15:result=transforms.trf" -f null -

# Apply stabilization
ffmpeg -i input.mp4 -vf "vidstabtransform=input=transforms.trf:smoothing=10:crop=black:zoom=5" \
  -c:v libx264 -preset fast output_stabilized.mp4
```

## Crop & Pad

```bash
# Crop 100px from each side
ffmpeg -i input.mp4 -vf "crop=in_w-200:in_h-200:100:100" output.mp4

# Crop to 16:9 in center
ffmpeg -i input.mp4 -vf "crop=in_h*16/9:in_h" output_16_9.mp4

# Add padding (letterbox to 1920x1080)
ffmpeg -i input.mp4 -vf "pad=1920:1080:(ow-iw)/2:(oh-ih)/2:color=black" output.mp4
```

## Text & Graphics Overlay

```bash
# Simple text overlay
ffmpeg -i input.mp4 -vf "drawtext=text='Hello World':fontsize=48:fontcolor=white:x=20:y=20" \
  -c:v libx264 output.mp4

# Text with font and position
ffmpeg -i input.mp4 -vf "drawtext=text='Copyright 2024':fontsize=24:fontcolor=white:font=DejaVuSans:x=10:y=h-th-10" \
  -c:v libx264 output.mp4

# Text with timecode
ffmpeg -i input.mp4 -vf "drawtext=text='%{pts\\:hms}':fontsize=36:fontcolor=white:x=10:y=10" \
  -c:v libx264 output.mp4

# Logo overlay (top-right)
ffmpeg -i input.mp4 -i logo.png -filter_complex "[0:v][1:v]overlay=W-w-10:10" \
  -c:a copy output.mp4

# Logo overlay (bottom-left with padding)
ffmpeg -i input.mp4 -i logo.png -filter_complex "[0:v][1:v]overlay=10:H-h-10" \
  -c:a copy output.mp4
```
