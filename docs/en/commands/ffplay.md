# ffplay

`ffplay` is a simple, portable media player built using FFmpeg's libraries and the SDL library.

## Synopsis

```
ffplay [options] [input_url]
```

## Basic Usage

```bash
# Play a file
ffplay input.mp4

# Play from URL (streaming)
ffplay rtmp://server/live/stream

# Play with window title
ffplay -window_title "My Video" input.mp4
```

## Playback Controls

| Key | Action |
|-----|--------|
| `q` / `ESC` | Quit |
| `f` | Toggle fullscreen |
| `p` / `Space` | Pause/Resume |
| `m` | Toggle mute |
| `9` / `0` | Decrease/Increase volume |
| `/` / `*` | Decrease/Increase volume |
| `s` | Step frame by frame |
| `left` / `right` | Seek backward/forward 10 seconds |
| `up` / `down` | Seek forward/backward 1 minute |
| `mouse click` | Seek to position |

## Display Options

```bash
# Native resolution (no scaling)
ffplay -nodisp input.mp4

# Audio-only playback
ffplay -novideo input.mp3

# Loop playback
ffplay -loop 3 input.mp4    # Loop 3 times
ffplay -loop 0 input.mp4    # Loop infinitely

# Start at specific time
ffplay -ss 01:30 input.mp4

# Play for specific duration
ffplay -t 60 input.mp4
```

## Audio Visualization

```bash
# Show audio waveform
ffplay -showmode 1 input.mp3

# Show audio spectrum
ffplay -showmode 2 input.mp3
```

## Advanced Options

```bash
# Sync to audio (default)
ffplay -sync audio input.mp4

# Sync to video
ffplay -sync video input.mp4

# Sync to external clock
ffplay -sync ext input.mp4

# Set playback volume (0-100)
ffplay -volume 50 input.mp4

# Set video stream index
ffplay -ast 1 input.mp4

# Set audio stream index
ffplay -vst 0 input.mp4

# Buffer size (for network streams)
ffplay -buffersize 5000 input.mp4
```

## Common Use Cases

```bash
# Quick preview before encoding
ffplay -nodisp -autoexit input.mkv

# Test audio normalization
ffplay -af "loudnorm=I=-16:TP=-1.5:LRA=11" input.wav

# Watch stream with low latency
ffplay -fflags nobuffer -flags low_delay rtmp://server/live

# Play frame-by-frame (no audio)
ffplay -nodisp -loop 0 input.mp4
```
