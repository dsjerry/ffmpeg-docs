# ffprobe

`ffprobe` analyzes multimedia files and streams, extracting information about duration, codecs, bitrates, chapters, and more — without modifying the file.

## Synopsis

```
ffprobe [options] [input_url]
```

## Basic Usage

```bash
# Print all info (default human-readable output)
ffprobe input.mp4

# Hide banner
ffprobe -hide_banner input.mp4

# Show only errors
ffprobe -v error input.mp4
```

## Selectors

### Stream Selectors

```bash
# Select video streams only
ffprobe -v error -show_streams -select_streams v input.mp4

# Select audio streams only
ffprobe -v error -show_streams -select_streams a input.mp4

# Specific stream by index
ffprobe -v error -select_streams a:1 input.mp4
```

### Format Selector

```bash
# Show format info only
ffprobe -v error -show_format input.mp4
```

## Show Entries

Extract specific fields without full output:

```bash
# Duration
ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 input.mp4
# Output: 125.678000

# Bitrate
ffprobe -v error -show_entries format=bit_rate -of default=noprint_wrappers=1:nokey=1 input.mp4

# Video codec
ffprobe -v error -select_streams v:0 -show_entries stream=codec_name -of default=noprint_wrappers=1:nokey=1 input.mp4
# Output: h264

# Resolution
ffprobe -v error -select_streams v:0 -show_entries stream=width,height -of csv=p=0 input.mp4
# Output: 1920,1080

# Frame rate
ffprobe -v error -select_streams v:0 -show_entries stream=r_frame_rate -of default=noprint_wrappers=1:nokey=1 input.mp4
# Output: 30/1
```

## Output Formats

```bash
# Default (human-readable)
ffprobe input.mp4

# Compact (key=value)
ffprobe -of compact input.mp4

# CSV
ffprobe -of csv input.mp4

# INI
ffprobe -of ini input.mp4

# JSON (most useful for scripting)
ffprobe -v error -show_format -show_streams -of json input.mp4

# XML
ffprobe -v error -show_format -show_streams -of xml input.mp4
```

## Practical Examples

### Get video duration in seconds
```bash
ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 input.mp4
```

### Check if file has audio
```bash
ffprobe -v error -select_streams a -show_entries stream=codec_type -of csv=p=0 input.mp4
```

### List all streams
```bash
ffprobe -v error -show_streams -of json input.mkv
```

### Find specific codec info
```bash
ffprobe -v error -select_streams v:0 -show_entries stream=codec_name,profile,level,width,height,pix_fmt -of json input.mp4
```

### Count frames
```bash
ffprobe -v error -select_streams v:0 -count_frames -show_entries stream=nb_read_frames -of default=noprint_wrappers=1:nokey=1 input.mp4
```
