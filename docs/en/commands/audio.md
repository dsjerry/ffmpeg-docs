# Audio Processing

FFmpeg provides a comprehensive set of audio processing capabilities through the `-af` (audio filter) option and codec-specific parameters.

## Extract & Convert Audio

```bash
# Extract audio track (no re-encode)
ffmpeg -i input.mp4 -vn -c:a copy audio.m4a

# Extract and convert to MP3
ffmpeg -i input.mp4 -vn -c:a libmp3lame -b:a 192k audio.mp3

# Extract and convert to FLAC (lossless)
ffmpeg -i input.mp4 -vn -c:a flac audio.flac

# Extract to WAV
ffmpeg -i input.mp4 -vn -c:a pcm_s16le audio.wav
```

## Resample Audio

```bash
# Change sample rate to 48kHz
ffmpeg -i input.mp4 -vn -c:a aac -ar 48000 output.mp4

# Convert to mono
ffmpeg -i input.mp4 -vn -c:a aac -ac 1 output_mono.mp4

# Convert to stereo
ffmpeg -i input.mp4 -vn -c:a aac -ac 2 output_stereo.mp4
```

## Volume & Gain

```bash
# Increase volume by 3dB
ffmpeg -i input.mp4 -af "volume=3dB" output.mp4

# Double the volume
ffmpeg -i input.mp4 -af "volume=2" output.mp4

# Reduce volume by 50%
ffmpeg -i input.mp4 -af "volume=0.5" output.mp4

# Normalize to -3dB
ffmpeg -i input.mp4 -af "volume=-3dB" output.mp4
```

## Loudness Normalization

Essential for podcasts and music to ensure consistent volume:

```bash
# Measure loudness first (two-pass for best results)
ffmpeg -i input.wav -af loudnorm=I=-16:TP=-1.5:LRA=11:print_format=summary -f null -

# Apply normalization (one-pass)
ffmpeg -i input.wav -af "loudnorm=I=-16:TP=-1.5:LRA=11" output.wav

# True two-pass normalization
ffmpeg -i input.wav -af loudnorm=I=-16:TP=-1.5:LRA=11:print_format=json -f null -
# (Use the output values in the second pass)
ffmpeg -i input.wav -af "loudnorm=I=-16:TP=-1.5:LRA=11:measured_I=-20:measured_TP=-2.5:measured_LRA=8:measured_thresh=-22" output.wav
```

## Audio Filters

```bash
# Apply fade in (2 seconds) and fade out (3 seconds)
ffmpeg -i input.mp3 -af "afade=t=in:ss=0:d=2,afade=t=out:st=57:d=3" output.mp3

# Apply high-pass filter (remove low frequencies below 80Hz)
ffmpeg -i input.mp4 -af "highpass=f=80" -c:a aac output.mp4

# Apply low-pass filter (remove high frequencies above 10kHz)
ffmpeg -i input.mp4 -af "lowpass=f=10000" -c:a aac output.mp4

# Equalizer (boost bass at 100Hz by 6dB)
ffmpeg -i input.mp3 -af "equalizer=f=100:width_type=h:width=200:g=6" output.mp3

# Apply compression (reduce dynamic range)
ffmpeg -i input.mp3 -af "acompressor=threshold=-20dB:ratio=4:attack=5:release=50" output.mp3

# Apply reverb
ffmpeg -i input.mp3 -af "aecho=0.8:0.9:1000:0.3" output.mp3
```

## Mix Audio Streams

```bash
# Mix two audio tracks with equal volume
ffmpeg -i video.mp4 -i audio1.mp3 -i audio2.mp3 \
  -filter_complex "[1:a][2:a]amix=inputs=2:duration=longest[aout]" \
  -map 0:v -map "[aout]" \
  -c:v copy output.mp4

# Mix with different volumes
ffmpeg -i video.mp4 -i audio1.mp3 -i audio2.mp3 \
  -filter_complex "[1:a]volume=0.7[bg];[2:a]volume=1.3[fg];[bg][fg]amix=inputs=2[aout]" \
  -map 0:v -map "[aout]" \
  -c:v copy output.mp4
```

## Delay / Offset Audio

```bash
# Delay audio by 1 second
ffmpeg -i input.mp4 -itsoffset 1 -i input.mp4 \
  -map 0:v -map 1:a \
  -c:v copy -c:a aac output_delayed.mp4
```

## Audio Channel Manipulation

```bash
# Convert 5.1 surround to stereo
ffmpeg -i input_51.mp4 -af "pan=stereo|c0=c0|c1=c1" -c:a aac output_stereo.mp4

# Extract left channel from stereo
ffmpeg -i input_stereo.mp3 -af "pan=mono|c0=c0" output_left.mp3

# Duplicate mono to stereo
ffmpeg -i input_mono.mp3 -af "pan=stereo|c0=c0|c1=c0" output_stereo.mp3
```
