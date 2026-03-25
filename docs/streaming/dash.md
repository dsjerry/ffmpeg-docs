# DASH（Dynamic Adaptive Streaming over HTTP）

DASH（也称为 MPEG-DASH）是自适应码率流媒体的国际标准，类似于 HLS，但使用 MP4 片段而非 TS 片段。

## 基本 DASH 编码

```bash
ffmpeg -i input.mp4 -c:v libx264 -preset fast -crf 22 \
  -c:a aac -b:a 128k \
  -f dash \
  manifest.mpd
```

## 自适应码率 DASH

```bash
# 创建多个质量表示
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

## 关键 DASH 选项

| 选项 | 描述 |
|------|------|
| `-f dash` | 启用 DASH 输出格式 |
| `-seg_duration n` | 片段时长（秒） |
| `-use_template 1` | 使用 SegmentTemplate（更高效） |
| `-use_timeline 1` | 启用 SegmentTimeline |
| `-adaption_sets` | 定义适配集 |
| `-init_seg_name` | 自定义初始化片段文件名 |
| `-media_seg_name` | 自定义媒体片段文件名 |
| `-utc_urls` | DASH-IF UTC 时钟源 URL |
| `-mpd_profile` | MPD 配置文件（simple, full, on-demand） |

## DASH + HEVC

```bash
ffmpeg -i input.mp4 \
  -c:v libx265 -preset fast -crf 24 \
  -c:a aac -b:a 128k \
  -f dash \
  -seg_duration 6 \
  manifest_hevc.mpd
```

## DASH + WebM（VP9 + Opus）

```bash
ffmpeg -i input.mp4 \
  -c:v libvpx-vp9 -crf 35 -b:v 0 \
  -c:a libopus -b:a 128k \
  -f dash \
  -seg_duration 6 \
  manifest.webm.mpd
```

## 多周期 DASH

```bash
# 用于多周期直播（例如广告插入）
ffmpeg -i input.mp4 \
  -c:v libx264 -preset fast -crf 22 \
  -c:a aac -b:a 128k \
  -f dash \
  -utc_urls "https://time.akamai.com" \
  -mpd_period_id "main" \
  manifest_period1.mpd
```

## 加密 DASH（CENC）

```bash
# 生成密钥
openssl rand 16 > enc.key

# 创建密钥信息
echo "enc.key" > key_info.txt
openssl rand -hex 16 >> key_info.txt

# 加密编码
ffmpeg -i input.mp4 \
  -c:v libx264 -preset fast -crf 22 \
  -c:a aac -b:a 128k \
  -encryption_key $(cat enc.key) \
  -f dash \
  manifest_encrypted.mpd
```

## HLS + DASH 并行输出

```bash
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

## 验证 DASH 输出

```bash
# 检查 manifest
ffprobe -v error -show_entries format=nb_streams,format=duration,format=bit_rate \
  manifest.mpd

# 列出表示
ffprobe -v error -show_entries stream=index,codec_name,width,height,bit_rate \
  -of json manifest.mpd
```
