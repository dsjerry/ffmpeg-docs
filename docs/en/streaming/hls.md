# HLS (HTTP Live Streaming)

HLS is Apple's adaptive streaming protocol that splits video into small TS segments and serves them over HTTP. It supports adaptive bitrate (ABR) — the player automatically switches quality based on network conditions.

## Basic HLS Encoding

```bash
ffmpeg -i input.mp4 -c:v libx264 -preset fast -crf 22 \
  -c:a aac -b:a 128k \
  -hls_time 6 \
  -hls_playlist_type vod \
  -hls_segment_filename "seg_%03d.ts" \
  stream.m3u8
```

## Key HLS Options

| Option | Description |
|--------|-------------|
| `-hls_time n` | Segment duration in seconds (default: 2) |
| `-hls_list_size n` | Max segments in playlist (0 = keep all) |
| `-hls_playlist_type vod` | VOD (Video on Demand) — no live window |
| `-hls_playlist_type event` | Live with appendable playlist |
| `-hls_segment_filename` | Filename pattern for segments |
| `-hls_flags delete_segments` | Delete old segments (live streaming) |
| `-hls_start_list_source_version` | Starting version number |

## Adaptive Bitrate (ABR) Encoding

```bash
# Create multiple quality levels
ffmpeg -i input.mp4 \
  -map 0:v -map 0:a \
  -c:v:0 libx264 -b:v:0 3000k -maxrate:v:0 4500k -bufsize:v:0 6000k \
  -c:v:1 libx264 -b:v:1 1500k -maxrate:v:1 2250k -bufsize:v:1 3000k \
  -c:v:2 libx264 -b:v:2 800k -maxrate:v:2 1200k -bufsize:v:2 1600k \
  -c:a aac -b:a 128k \
  -var_stream_map "v:0,a:0 v:1,a:0 v:2,a:0" \
  -master_pl_name master.m3u8 \
  -f hls \
  -hls_segment_filename "v%v/seg_%03d.ts" \
  -hls_time 4 \
  -hls_list_size 0 \
  -hls_playlist_type vod \
  -use_template 1 \
  -use_timeline 1 \
  "v%v/stream_%v.m3u8"
```

## WebVTT Subtitles in HLS

```bash
ffmpeg -i input.mp4 \
  -c:v libx264 -preset fast -crf 22 \
  -c:a aac -b:a 128k \
  -c:s webvtt -hls_segment_filename "seg_%03d.ts" \
  -hls_time 6 \
  stream.m3u8
```

## Encrypted HLS (DRM)

```bash
# Generate key
openssl rand 16 > encrypt.key

# Generate IV
openssl rand -hex 16 > encrypt.iv

# Create key info file
echo "key_uri=https://example.com/encrypt.key" > keyinfo.txt
echo "key_file_path=encrypt.key" >> keyinfo.txt
cat encrypt.iv >> keyinfo.txt

# Encode with encryption
ffmpeg -i input.mp4 -c:v libx264 -preset fast -crf 22 \
  -c:a aac -b:a 128k \
  -hls_key_info_file keyinfo.txt \
  -hls_segment_filename "seg_%03d.ts" \
  -hls_time 6 \
  stream.m3u8
```

## HLS with HEVC (Better Compression)

```bash
ffmpeg -i input.mp4 \
  -c:v libx265 -preset fast -crf 24 \
  -c:a aac -b:a 128k \
  -hls_time 6 \
  -hls_playlist_type vod \
  -hls_segment_filename "hevc_seg_%03d.ts" \
  -hls_segment_filename "hevc_seg_%03d.ts" \
  stream_h265.m3u8
```

## Low-Latency HLS (LL-HLS)

```bash
ffmpeg -i input.mp4 \
  -c:v libx264 -preset fast -crf 22 \
  -c:a aac -b:a 128k \
  -hls_time 0.5 \
  -hls_playlist_type event \
  -hls_segment_type mpegts \
  -hls_flags independent_segments \
  -hls_flags append_list \
  ll_stream.m3u8
```

## Validate HLS Output

```bash
# Use ffprobe to check playlist
ffprobe -v error -show_entries format=duration stream.m3u8

# List segments
ffprobe -v error -show_entries format=nb_streams stream.m3u8
```
