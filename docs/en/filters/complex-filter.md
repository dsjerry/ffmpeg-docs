# Complex Filter Graphs

For advanced operations involving multiple inputs, multiple outputs, or complex signal routing, use `-filter_complex`.

## Basic Concepts

- **Filter graph** — a directed graph of filters
- **Input pads** — filter inputs (labeled `[0:v]`, `[0:a]`, etc.)
- **Output pads** — filter outputs (labeled `[out_v]`, `[out_a]`)
- **Labels** — user-defined names for intermediate streams

## Syntax

```
ffmpeg -filter_complex "[input]filter[output]" [output options]
```

## Split & Overlay

```bash
# Picture-in-Picture (small video in corner)
ffmpeg -i main.mp4 -i overlay.mp4 -filter_complex \
  "[0:v][1:v]overlay=10:10[out]" \
  -map "[out]" -map 0:a output.mp4

# Side-by-side (2 videos)
ffmpeg -i left.mp4 -i right.mp4 -filter_complex \
  "[0:v][1:v]hstack[out]" \
  -map "[out]" -map 0:a output.mp4

# Grid layout (2x2)
ffmpeg -i top_left.mp4 -i top_right.mp4 -i bottom_left.mp4 -i bottom_right.mp4 \
  -filter_complex \
  "[0:v][1:v]hstack=inputs=2[top];[2:v][3:v]hstack=inputs=2[bottom];[top][bottom]vstack=inputs=2[out]" \
  -map "[out]" output_grid.mp4
```

## Alpha Channel Processing

```bash
# Overlay with alpha (green screen removal)
ffmpeg -i video.mp4 -i overlay.png -filter_complex \
  "[0:v]format=rgba,gt催alpha=0[a];[1:v]format=rgba[ovr];[a][ovr]overlay=0:0[out]" \
  -map "[out]" output.mp4
```

## Audio/Video Separation

```bash
# Split video and process separately
ffmpeg -i input.mp4 -filter_complex \
  "[0:v]scale=1280:720[v];[0:a]volume=2[a]" \
  -map "[v]" -map "[a]" \
  -c:v libx264 -preset fast -c:a aac output.mp4

# Extract audio, process, and mix back
ffmpeg -i input.mp4 -filter_complex \
  "[0:a]aecho=0.8:0.9:500|250:0.3|0.1[echo];[0:a][echo]amix=inputs=2:duration=longest[mixed]" \
  -map 0:v -map "[mixed]" \
  -c:v copy output.mp4
```

## Concatenate Multiple Videos

```bash
# Concatenate with transitions (crossfade)
ffmpeg -i 1.mp4 -i 2.mp4 -i 3.mp4 -filter_complex \
  "[0:v][1:v]xfade=transition=fade:duration=1:offset=4[v];[0:a][1:a]acrossfade=d=1[a]" \
  "[v][2:v]xfade=transition=fade:duration=1:offset=4[v2];[a][2:a]acrossfade=d=1[a2]" \
  -map "[v2]" -map "[a2]" output.mp4
```

## Timeline Editing

```bash
# Enable timeline editing to apply filter at specific time
ffmpeg -i input.mp4 -vf \
  "[0:v]split=2[v1][v2];[v1]negate[out1];[v2]hue=s=0[out2]" \
  -filter_complex "[0:v]split=2[1]enable='between(t,0,3)'[v1];[v1]negate[out]" \
  output.mp4
```

## Multipass with Split

```bash
# Deblock and sharpen
ffmpeg -i input.mp4 -filter_complex \
  "[0:v]hqdn3d=4:3:4:3,unsharp=5:5:0.5[out]" \
  -map "[out]" -c:v libx264 -preset fast output_denoise_sharp.mp4
```

## Null/Sink (Measure Audio)

```bash
# Measure audio loudness without creating output
ffmpeg -i input.mp4 -af "volumedetect" -f null -

# Show audio spectrum
ffmpeg -i input.mp4 -af "showspectrum=mode=combined:color=rainbow:s=1280x720" \
  -c:v rawvideo -f rawvideo - | head -c 100000
```

## Labeled Filter Chains

```bash
# Complex routing with labels
ffmpeg -i input.mp4 -filter_complex \
  "[0:v]scale=1280:720[v720];[v720]setsar=1[v720s]" \
  -map "[v720s]" -map 0:a \
  -c:v libx264 -preset fast -c:a aac \
  output_720p.mp4
```

## Sidechaining (Duck Audio)

```bash
# Reduce music volume when voice is present (sidechain compression)
ffmpeg -i music.mp3 -i voiceover.mp3 -filter_complex \
  "[0:a][1:a]sidechcompress=threshold=-20dB:ratio=3:attack=5:release=50[ducked]" \
  -map "[ducked]" output_ducked.mp3
```

## Masked Operations

```bash
# Apply filter only to a region (masked blur)
ffmpeg -i input.mp4 -filter_complex \
  "[0:v]split=2[base][blurred];[blurred]boxblur=10[blur];[base][blur]overlay=200:200[out]" \
  -map "[out]" output.mp4
```
