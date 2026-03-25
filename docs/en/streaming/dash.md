# DASH (Dynamic Adaptive Streaming over HTTP)

DASH (also known as MPEG-DASH) is an international standard for adaptive bitrate streaming similar to HLS but using MP4 fragments instead of TS segments.

## Basic DASH Encoding

```bash
ffmpeg -i input.mp4 -c:v libx264 -preset fast -crf 22 \
  -c:a aac -b:a 128k \
  -f dash \
  manifest.mpd
```

## Adaptive Bitrate DASH

```bash
# Create multiple quality representations
ffmpeg -i input.mp4 \
  -c:v libx264 -b:v:0 3000k -maxrate:v:0 4500k -bufsize:v:0 6000k \
  -c:v:1 libx264 -b:v:1 1500k -maxrate:v:1 2250k -bufsize:v:1 3000k \
  -c:v:2 libx264 -b:v:2 800k -maxrate:v:2 1200k -bufsize:v:2 1600k \
  -c:a aac -b:a 128k \
  -map 0:v -map 0:a \
  -f dash \
  -use_timeline 1 \
  -use_template 0 \
  -seg_duration 6 \
  -adaptation_sets "id=0,streams=v id=1,streams=a" \
  manifest.mpd
```

## Key DASH Options

| Option | Description |
|--------|-------------|
| `-f dash` | Enable DASH output format |
| `-seg_duration n` | Segment duration in seconds |
| `-use_template 1` | Use SegmentTemplate (more efficient) |
| `-use_timeline 1` | Enable SegmentTimeline |
| `-adaption_sets` | Define adaptation sets |
| `-init_seg_name` | Custom init segment filename |
| `-media_seg_name` | Custom media segment filename |
| `-utc_urls` | URLs for DASH-IF UTC clock sources |
| `-mpd_profile` | MPD profile (simple, full, on-demand) |

## DASH with HEVC

```bash
ffmpeg -i input.mp4 \
  -c:v libx265 -preset fast -crf 24 \
  -c:a aac -b:a 128k \
  -f dash \
  -seg_duration 6 \
  manifest_hevc.mpd
```

## DASH with WebM (VP9 + Opus)

```bash
ffmpeg -i input.mp4 \
  -c:v libvpx-vp9 -crf 35 -b:v 0 \
  -c:a libopus -b:a 128k \
  -f dash \
  -seg_duration 6 \
  manifest.webm.mpd
```

## Multi-Period DASH

```bash
# For live streaming with multiple periods (e.g., ad insertion)
ffmpeg -i input.mp4 \
  -c:v libx264 -preset fast -crf 22 \
  -c:a aac -b:a 128k \
  -f dash \
  -utc_urls "https://time.akamai.com" \
  -mpd_period_id "main" \
  manifest_period1.mpd
```

## Encrypted DASH (CENC)

```bash
# Generate keys
openssl rand 16 > enc.key

# Create key info
echo "enc.key" > key_info.txt
openssl rand -hex 16 >> key_info.txt

# Encode with encryption
ffmpeg -i input.mp4 \
  -c:v libx264 -preset fast -crf 22 \
  -c:a aac -b:a 128k \
  -encryption_key $(cat enc.key) \
  -f dash \
  manifest_encrypted.mpd
```

## HLS + DASH Side-by-Side

```bash
# Output both formats from a single input
ffmpeg -i input.mp4 \
  -c:v libx264 -preset fast -crf 22 \
  -c:a aac -b:a 128k \
  -f hls -hls_time 6 -hls_playlist_type vod \
  -hls_segment_filename "hls_seg_%03d.ts" \
  stream_hls.m3u8 \
  -f dash -dash_segment_type 1 \
  -seg_duration 6 \
  stream_dash.mpd
```

## Validate DASH Output

```bash
# Check manifest
ffprobe -v error -show_entries format=nb_streams,format=duration,format=bit_rate \
  manifest.mpd

# List representations
ffprobe -v error -show_entries stream=index,codec_name,width,height,bit_rate \
  -of json manifest.mpd
```
