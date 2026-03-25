# RTMP / SRT / WHIP

FFmpeg supports multiple streaming protocols for live encoding and ingesting to media servers.

## RTMP (Real-Time Messaging Protocol)

RTMP was the dominant streaming protocol for many years. While now deprecated, it remains widely supported by media servers (Nginx-RTMP, SRS, Wowza).

### Publish (Send Stream to Server)

```bash
# Publish H.264 + AAC to RTMP server
ffmpeg -re -i input.mp4 -c:v libx264 -preset veryfast -b:v 4500k \
  -c:a aac -b:a 160k \
  -f flv \
  rtmp://server/live/stream_key

# Stream with variable bitrate
ffmpeg -re -i input.mp4 -c:v libx264 -preset veryfast -crf 23 \
  -maxrate 5000k -bufsize 8000k \
  -c:a aac -b:a 192k \
  -f flv \
  rtmp://server/live/stream_key
```

### Subscribe (Receive Stream from Server)

```bash
# Save RTMP stream to file
ffmpeg -i rtmp://server/live/stream_key \
  -c:v libx264 -preset fast -crf 22 \
  -c:a aac -b:a 192k \
  -movflags +faststart \
  output.mp4

# Re-stream RTMP to multiple destinations
ffmpeg -i rtmp://source/live/stream \
  -c:v copy -c:a copy \
  -f flv rtmp://dest1/live/stream \
  -c:v copy -c:a copy \
  -f flv rtmp://dest2/live/stream
```

## SRT (Secure Reliable Transport)

SRT is a modern protocol designed for low-latency video transport over unpredictable networks (the internet).

### SRT as Caller/Listener/Rendezvous

```bash
# Server (Listener) — listen on port 4200
ffmpeg -i input.mp4 \
  -c:v libx264 -preset ultrafast -b:v 3000k \
  -c:a aac -b:a 128k \
  -f mpegts \
  "srt://0.0.0.0:4200?mode=listener"

# Client (Caller)
ffmpeg -re -i input.mp4 \
  -c:v libx264 -preset ultrafast -b:v 3000k \
  -c:a aac -b:a 128k \
  -f mpegts \
  "srt://server_ip:4200?mode=caller&latency=200000"
```

### SRT Key Parameters

| Parameter | Description |
|-----------|-------------|
| `mode=caller` | Initiate connection |
| `mode=listener` | Wait for connection |
| `mode=rendezvous` | Both sides initiate |
| `latency=200000` | Latency in microseconds (200ms default) |
| `passphrase=xxx` | Encryption key (32-char) |
| `pbkdf2pass=xxx` | PBKDF2 passphrase |
| `msrc=1000000` | Max SRT bandwidth (bytes/s) |

## WHIP (WebRTC ingest)

WHIP is the emerging standard for WebRTC-based ingest to streaming servers (e.g.,imedia, Ro跨媒体服务器).

```bash
ffmpeg -re -i input.mp4 \
  -c:v libx264 -preset veryfast -b:v 4500k \
  -c:a aac -b:a 160k \
  -f rtsp \
  rtsp://server/app/stream

# WHIP output
ffmpeg -re -i input.mp4 \
  -c:v libx264 -preset veryfast -b:v 4500k \
  -c:a aac -b:a 160k \
  -f mp4 \
  -movflags +frag_every_frame+empty_moov \
  "https://whip-endpoint.example.com/whip/stream/key"
```

## Multi-Protocol Output (tee muxer)

```bash
# Stream to multiple destinations simultaneously
ffmpeg -re -i input.mp4 \
  -c:v libx264 -preset veryfast -b:v 4500k \
  -c:a aac -b:a 160k \
  -f tee -map 0:v -map 0:a \
  "[f=flv]rtmp://server1/live/stream|[f=flv]rtmp://server2/live/stream"
```

## Streaming from Camera / Screen

```bash
# Capture desktop and stream via RTMP
ffmpeg -f gdigrab -i desktop \
  -c:v libx264 -preset ultrafast -b:v 2000k \
  -c:a aac -b:a 128k \
  -f flv rtmp://server/live/desktop

# Capture webcam
ffmpeg -f dshow -i video="Webcam":audio="Microphone" \
  -c:v libx264 -preset ultrafast -b:v 2000k \
  -c:a aac -b:a 128k \
  -f flv rtmp://server/live/webcam
```

## HLS Ingest from RTMP

```bash
# Ingest RTMP and repackage as HLS
ffmpeg -i rtmp://server/live/stream \
  -c:v copy -c:a copy \
  -hls_time 6 \
  -hls_list_size 0 \
  -hls_flags delete_segments \
  -hls_segment_filename "stream_%03d.ts" \
  stream.m3u8
```

## Low-Latency Streaming Tips

```bash
# Low-latency RTMP
ffmpeg -re -i input.mp4 \
  -c:v libx264 -preset veryfast -tune zerolatency \
  -b:v 4000k -maxrate 4000k -bufsize 4000k \
  -c:a aac -b:a 128k \
  -f flv \
  -flvflags no_duration_filesize \
  rtmp://server/live/stream

# Low-latency SRT
ffmpeg -re -i input.mp4 \
  -c:v libx264 -preset ultrafast -tune zerolatency \
  -b:v 4000k \
  -c:a aac -b:a 128k \
  -f mpegts \
  "srt://server:4200?mode=caller&latency=50000"
```
