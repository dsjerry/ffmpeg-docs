# RTMP / SRT / WHIP

FFmpeg 支持多种流媒体协议，用于实时编码和向媒体服务器推流。

## RTMP（Real-Time Messaging Protocol）

RTMP 多年来是主导的流媒体协议。虽然现已弃用，但仍然得到媒体服务器的广泛支持（Nginx-RTMP、SRS、Wowza）。

### 推流（发送到服务器）

```bash
# 推送 H.264 + AAC 到 RTMP 服务器
ffmpeg -re -i input.mp4 -c:v libx264 -preset veryfast -b:v 4500k \
  -c:a aac -b:a 160k \
  -f flv \
  rtmp://server/live/stream_key

# 可变码率推流
ffmpeg -re -i input.mp4 -c:v libx264 -preset veryfast -crf 23 \
  -maxrate 5000k -bufsize 8000k \
  -c:a aac -b:a 192k \
  -f flv \
  rtmp://server/live/stream_key
```

### 拉流（从服务器接收）

```bash
# 将 RTMP 流保存为文件
ffmpeg -i rtmp://server/live/stream_key \
  -c:v libx264 -preset fast -crf 22 \
  -c:a aac -b:a 192k \
  -movflags +faststart \
  output.mp4

# RTMP 转推到多个目的地
ffmpeg -i rtmp://source/live/stream \
  -c:v copy -c:a copy \
  -f flv rtmp://dest1/live/stream \
  -c:v copy -c:a copy \
  -f flv rtmp://dest2/live/stream
```

## SRT（Secure Reliable Transport）

SRT 是一种专为不可预测网络（互联网）上的低延迟视频传输而设计的现代协议。

### SRT 呼叫方/侦听方/会合模式

```bash
# 服务器（侦听）— 监听端口 4200
ffmpeg -i input.mp4 \
  -c:v libx264 -preset ultrafast -b:v 3000k \
  -c:a aac -b:a 128k \
  -f mpegts \
  "srt://0.0.0.0:4200?mode=listener"

# 客户端（呼叫）
ffmpeg -re -i input.mp4 \
  -c:v libx264 -preset ultrafast -b:v 3000k \
  -c:a aac -b:a 128k \
  -f mpegts \
  "srt://server_ip:4200?mode=caller&latency=200000"
```

### SRT 关键参数

| 参数 | 描述 |
|------|------|
| `mode=caller` | 发起连接 |
| `mode=listener` | 等待连接 |
| `mode=rendezvous` | 双方发起 |
| `latency=200000` | 延迟（微秒，默认 200ms） |
| `passphrase=xxx` | 加密密钥（32 字符） |
| `msrc=1000000` | 最大 SRT 带宽（字节/秒） |

## WHIP（WebRTC ingest）

WHIP 是用于向流媒体服务器进行 WebRTC 接入的新兴标准。

```bash
ffmpeg -re -i input.mp4 \
  -c:v libx264 -preset veryfast -b:v 4500k \
  -c:a aac -b:a 160k \
  -f rtsp \
  rtsp://server/app/stream

# WHIP 输出
ffmpeg -re -i input.mp4 \
  -c:v libx264 -preset veryfast -b:v 4500k \
  -c:a aac -b:a 160k \
  -f mp4 \
  -movflags +frag_every_frame+empty_moov \
  "https://whip-endpoint.example.com/whip/stream/key"
```

## 多协议输出（tee 复用器）

```bash
# 同时推流到多个目的地
ffmpeg -re -i input.mp4 \
  -c:v libx264 -preset veryfast -b:v 4500k \
  -c:a aac -b:a 160k \
  -f tee -map 0:v -map 0:a \
  "[f=flv]rtmp://server1/live/stream|[f=flv]rtmp://server2/live/stream"
```

## 从摄像头 / 屏幕采集

```bash
# 采集桌面并推流 RTMP
ffmpeg -f gdigrab -i desktop \
  -c:v libx264 -preset ultrafast -b:v 2000k \
  -c:a aac -b:a 128k \
  -f flv rtmp://server/live/desktop

# 采集摄像头
ffmpeg -f dshow -i video="Webcam":audio="Microphone" \
  -c:v libx264 -preset ultrafast -b:v 2000k \
  -c:a aac -b:a 128k \
  -f flv rtmp://server/live/webcam
```

## HLS 从 RTMP 接入

```bash
# 接入 RTMP 并重新封装为 HLS
ffmpeg -i rtmp://server/live/stream \
  -c:v copy -c:a copy \
  -hls_time 6 \
  -hls_list_size 0 \
  -hls_flags delete_segments \
  -hls_segment_filename "stream_%03d.ts" \
  stream.m3u8
```

## 低延迟流媒体技巧

```bash
# 低延迟 RTMP
ffmpeg -re -i input.mp4 \
  -c:v libx264 -preset veryfast -tune zerolatency \
  -b:v 4000k -maxrate 4000k -bufsize 4000k \
  -c:a aac -b:a 128k \
  -f flv \
  -flvflags no_duration_filesize \
  rtmp://server/live/stream

# 低延迟 SRT
ffmpeg -re -i input.mp4 \
  -c:v libx264 -preset ultrafast -tune zerolatency \
  -b:v 4000k \
  -c:a aac -b:a 128k \
  -f mpegts \
  "srt://server:4200?mode=caller&latency=50000"
```
