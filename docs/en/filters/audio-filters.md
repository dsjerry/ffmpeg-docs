# Audio Filters

FFmpeg's audio filter (`-af`) system handles all audio transformations — from simple volume adjustment to complex multi-band processing.

## Volume & Gain

```bash
# Adjust volume (dB)
ffmpeg -i input.mp4 -af "volume=3dB" output.mp4

# Double volume
ffmpeg -i input.mp4 -af "volume=2" output.mp4

# Reduce to 50%
ffmpeg -i input.mp4 -af "volume=0.5" output.mp4

# Silence first 5 seconds
ffmpeg -i input.mp4 -af "adelay=5000|5000" -c:a aac output.mp4
```

## Normalization

```bash
# Loudness normalization (EBU R128)
ffmpeg -i input.wav -af "loudnorm=I=-16:TP=-1.5:LRA=11" output.wav

# EBU R128 loudness normalization (two-pass)
ffmpeg -i input.wav -af loudnorm=I=-16:TP=-1.5:LRA=11:print_format=json -f null -
# (use output values in second pass)
ffmpeg -i input.wav -af "loudnorm=I=-16:TP=-1.5:LRA=11:measured_I=-20:measured_TP=-2:measured_LRA=8" output.wav
```

## Channel Manipulation

```bash
# Convert to mono
ffmpeg -i input.mp4 -af "pan=mono|c0=c0" output_mono.mp4

# Convert to stereo (duplicate)
ffmpeg -i input.mp4 -af "pan=stereo|c0=c1|c1=c0" output_stereo.mp4

# 5.1 to stereo downmix
ffmpeg -i input_51.mp4 -af "pan=stereo|c0=c0+c2|c1=c1+c3" output_stereo.mp4

# Extract left channel
ffmpeg -i input.mp4 -af "pan=mono|c0=c0" output_left.mp4

# Extract right channel
ffmpeg -i input.mp4 -af "pan=mono|c0=c1" output_right.mp4
```

## Frequency Filters

```bash
# High-pass filter (remove bass below 80Hz)
ffmpeg -i input.mp4 -af "highpass=f=80" output.mp4

# Low-pass filter (remove treble above 10kHz)
ffmpeg -i input.mp4 -af "lowpass=f=10000" output.mp4

# Band-pass filter (keep only 300Hz-3000Hz)
ffmpeg -i input.mp4 -af "bandpass=f=1000:t=o:width=0.5" output.mp4
```

## Equalizer

```bash
# Bass boost (+6dB at 100Hz)
ffmpeg -i input.mp3 -af "equalizer=f=100:width_type=h:width=200:g=6" output.mp3

# Treble boost (+4dB at 8kHz)
ffmpeg -i input.mp3 -af "equalizer=f=8000:width_type=h:width=2000:g=4" output.mp3

# Parametric EQ (full control)
ffmpeg -i input.mp3 -af "equalizer=f=1000:t=h:width=0.5:g=-3" output.mp3
```

## Effects

```bash
# Fade in (first 2 seconds)
ffmpeg -i input.mp3 -af "afade=t=in:ss=0:d=2" output.mp3

# Fade out (last 3 seconds)
ffmpeg -i input.mp3 -af "afade=t=out:st=57:d=3" output.mp3

# Echo/reverb
ffmpeg -i input.mp3 -af "aecho=0.8:0.9:1000|500:0.3|0.2" output.mp3

# Chorus effect
ffmpeg -i input.mp3 -af "chorus=0.5:0.9:50|60|40:0.4|0.32|0.3:2|2.5|2:0.25|0.4|0.3|0.5|0.4" output.mp3

# Phaser
ffmpeg -i input.mp3 -af "aphaser=type=tone:g=0.6" output.mp3

# Tremolo (vibrato)
ffmpeg -i input.mp3 -af "tremolo=f=5:d=0.5" output.mp3
```

## Dynamics

```bash
# Compression (reduce dynamic range)
ffmpeg -i input.mp3 -af "acompressor=threshold=-20dB:ratio=4:attack=5:release=50" output.mp3

# Limiter (prevent clipping)
ffmpeg -i input.mp3 -af "alimiter=limit=0.9:attack=5:release=50" output.mp3

# Noise gate (remove quiet noise)
ffmpeg -i input.mp4 -af "agate=threshold=-40dB:ratio=3" -c:a aac output.mp4

# De-esser (reduce sibilance)
ffmpeg -i input.mp4 -af "aexciter=h=3:t=50:m=4" -c:a aac output.mp4
```

## Resampling

```bash
# Change sample rate to 48kHz
ffmpeg -i input.mp4 -af "aresample=48000" output.mp4

# Convert sample rate and channel layout
ffmpeg -i input.mp4 -af "aresample=48000,pan=stereo|c0=c0|c1=c1" output.mp4
```

## Filter Combinations

```bash
# Chain multiple filters
ffmpeg -i input.mp4 \
  -af "highpass=f=80,lowpass=f=10000,volume=2dB,aecho=0.8:0.9:500|250:0.3|0.1" \
  output.mp4

# All effects in sequence
ffmpeg -i input.mp3 \
  -af "afade=t=in:d=2,equalizer=f=100:width_type=h:g=3,acompressor=threshold=-15:ratio=3,afade=t=out:st=58:d=2" \
  output_processed.mp3
```

## Binaural & Spatial Audio

```bash
# Convert stereo to binaural (for headphones)
ffmpeg -i input.mp4 -af "sofalizer=sofa=/path/to/IRC_1002_C.wav" output.mp4

# Stereo widening
ffmpeg -i input.mp3 -af "stereowiden=amount=0.5" output.mp3
```
