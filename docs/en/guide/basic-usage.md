# Basic Usage

## Getting Media Info

### ffprobe

Inspect any media file without modifying it:

```bash
# Quick info
ffprobe video.mp4

# Detailed stream info
ffprobe -v error -show_streams -show_format video.mp4

# JSON format (for scripting)
ffprobe -v error -show_streams -show_format -of json video.mp4

# Specific stream info
ffprobe -v error -select_streams v:0 -show_entries stream=codec_name,width,height -of csv=p=0 video.mp4
```

## Converting Between Formats

### Lossless Remux

No re-encoding — just change the container:

```bash
# MKV to MP4 (lossless)
ffmpeg -i input.mkv -c copy output.mp4
```

### Re-encode for Compatibility

```bash
# AVI to MP4 with H.264
ffmpeg -i input.avi -c:v libx264 -preset fast -crf 23 \
  -c:a aac -b:a 128k output.mp4

# WebM (VP9 + Opus)
ffmpeg -i input.mp4 -c:v libvpx-vp9 -crf 30 -b:v 0 \
  -c:a libopus -b:a 128k output.webm

# MOV with ProRes for editing
ffmpeg -i input.mov -c:v prores_ks -profile:v 3 \
  -c:a pcm_s16le output.mov
```

## Working with Video

### Extract Frames

```bash
# Extract single frame at timestamp
ffmpeg -ss 00:01:23 -i input.mp4 -frames:v 1 screenshot.jpg

# Extract every nth frame
ffmpeg -i input.mp4 -vf "select=not(mod(n\,100))" -vsync vfr frame_%04d.png
```

### Concatenate Videos

**Method 1: concat demuxer (reliable)**
```bash
# Create a file list
echo "file 'part1.mp4'" > files.txt
echo "file 'part2.mp4'" >> files.txt
echo "file 'part3.mp4'" >> files.txt

# Concatenate
ffmpeg -f concat -safe 0 -i files.txt -c copy merged.mp4
```

**Method 2: concat protocol (for streams of same codec)**
```bash
ffmpeg -i "concat:part1.mp4|part2.mp4|part3.mp4" -c copy merged.mp4
```

## Working with Audio

### Extract Audio

```bash
# Extract audio track (copy)
ffmpeg -i input.mp4 -vn -c:a copy audio.m4a

# Extract and re-encode
ffmpeg -i input.mp4 -vn -c:a libmp3lame -b:a 192k audio.mp3
```

### Add Audio to Video

```bash
ffmpeg -i video.mp4 -i audio.mp3 -c:v copy \
  -c:a aac -b:a 192k -shortest output.mp4
```

### Replace Audio Track

```bash
ffmpeg -i video_with_audio.mp4 -i new_audio.aac \
  -c:v copy -c:a aac -map 0:v:0 -map 1:a:0 output.mp4
```

## Useful Global Flags

| Flag | Description |
|------|-------------|
| `-y` | Overwrite output without asking |
| `-n` | Never overwrite (exit if exists) |
| `-hide_banner` | Suppress version/copyright info |
| `-loglevel level` | Control verbosity (quiet, fatal, error, warning, info, verbose, debug) |
| `-threads n` | Limit CPU threads used |
| `-progress url` | Write progress to file or URL |
