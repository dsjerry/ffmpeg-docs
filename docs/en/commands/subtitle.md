# Subtitles

FFmpeg supports extracting, burning-in, and converting subtitles between formats.

## Extract Subtitles

```bash
# Extract SRT from MP4
ffmpeg -i input.mp4 -map 0:s:0 output.srt

# Extract all subtitle tracks
ffmpeg -i input.mkv -map 0:s output_%d.srt

# Extract with language filter
ffmpeg -i input.mkv -map 0:s:m:language:eng output_eng.srt
```

## Convert Subtitles

```bash
# SRT to ASS (with style)
ffmpeg -i input.srt output.ass

# ASS to SRT (strip formatting)
ffmpeg -i input.ass output.srt

# Convert to WebVTT (for HTML5)
ffmpeg -i input.srt output.vtt
```

## Burn Subtitles into Video

```bash
# Burn SRT into video
ffmpeg -i input.mp4 -vf "subtitles=input.srt" \
  -c:v libx264 -crf 22 -c:a aac output.mp4

# Burn ASS with custom styles
ffmpeg -i input.mp4 -vf "subtitles=input.ass" \
  -c:v libx264 -crf 22 -c:a aac output.mp4

# Burn subtitles from embedded track
ffmpeg -i input.mkv -vf "subtitles=input.mkv" \
  -c:v libx264 -crf 22 -c:a aac output.mp4

# Burn subtitle at specific time offset
ffmpeg -i input.mp4 -vf "subtitles=input.srt:force_style='FontSize=24,PrimaryColour=&H00FFFF&'" \
  -c:v libx264 -crf 22 output.mp4
```

## Hardcoded Subtitles (Image-based)

```bash
# Convert text subtitles to image-based (for players without subtitle support)
ffmpeg -i input.mp4 -vf "subtitles=input.srt:stream_index=0" \
  -c:v libx264 -crf 22 output_hardsub.mp4
```

## Add Soft Subtitles (Track)

```bash
# Copy subtitles without burning in (player chooses to show)
ffmpeg -i input.mp4 -i subs.srt -c:v copy -c:a copy \
  -c:s srt -metadata:s:s:0 language=eng \
  output_with_subs.mp4

# Add multiple subtitle tracks
ffmpeg -i input.mp4 -i eng.srt -i spa.srt -i fra.srt \
  -c:v copy -c:a copy \
  -c:s srt \
  -metadata:s:s:0 language=eng \
  -metadata:s:s:1 language=spa \
  -metadata:s:s:2 language=fra \
  output_multilang.mp4
```

## Subtitle Bitstream Filters

```bash
# Convert ASS subtitles for MP4 (mov_text codec)
ffmpeg -i input.mp4 -i subs.ass \
  -c:v copy -c:a copy \
  -c:s mov_text \
  -bss:v filter_codec_tags -metadata:s:s:0 codec_tag=0x0000 \
  output_mp4.mp4
```

## Common Subtitle Formats

| Format | FFmpeg Codec | Description |
|--------|-------------|-------------|
| SRT | subrip | Plain text, most compatible |
| ASS/SSA | ass | Advanced styling, animated |
| WebVTT | webvtt | HTML5 web standard |
| VOBSub | dvdsub | Image-based (DVD subtitles) |
| MovText | mov_text | MP4 soft subtitles |
| HDMV PGS | hdmv_pgs_subtitle | Blu-ray image subtitles |

## Subtitle Filters

```bash
# Adjust subtitle position
ffmpeg -i input.mp4 -vf "subtitles=input.srt:force_style='MarginV=50'" \
  -c:v libx264 output.mp4

# Change subtitle appearance
ffmpeg -i input.mp4 -vf "subtitles=input.srt:force_style='FontName=Arial,FontSize=18,PrimaryColour=&H00FFFFFF&,OutlineColour=&H00000000&,Bold=1'" \
  -c:v libx264 output.mp4

# Scale subtitle font
ffmpeg -i input.mp4 -vf "subtitles=input.srt:force_style='FontSize=36'" \
  -c:v libx264 output.mp4
```
