# HLS（HTTP Live Streaming）

HLS 是 Apple 的自适应流媒体协议，将视频分割成小的 TS 片段并通过 HTTP 提供。它支持自适应码率（ABR）—— 播放器根据网络状况自动切换质量。

## 基本 HLS 编码

```bash
ffmpeg -i input.mp4 -c:v libx264 -preset fast -crf 22 \
  -c:a aac -b:a 128k \
  -hls_time 6 \
  -hls_playlist_type vod \
  -hls_segment_filename "seg_%03d.ts" \
  stream.m3u8
```

## 关键 HLS 选项

| 选项 | 描述 |
|------|------|
| `-hls_time n` | 片段时长（秒，默认 2） |
| `-hls_list_size n` | 播放列表中的最大片段数（0 = 保留全部） |
| `-hls_playlist_type vod` | 点播 — 无直播窗口 |
| `-hls_playlist_type event` | 直播 — 追加式播放列表 |
| `-hls_segment_filename` | 片段文件名模式 |
| `-hls_flags delete_segments` | 删除旧片段（直播） |
| `-hls_start_list_source_version` | 起始版本号 |

## 自适应码率（ABR）编码

```bash
# 创建多个质量级别
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

## HLS 字幕（WebVTT）

```bash
ffmpeg -i input.mp4 \
  -c:v libx264 -preset fast -crf 22 \
  -c:a aac -b:a 128k \
  -c:s webvtt -hls_segment_filename "seg_%03d.ts" \
  -hls_time 6 \
  stream.m3u8
```

## 加密 HLS（DRM）

```bash
# 生成密钥
openssl rand 16 > encrypt.key

# 生成 IV
openssl rand -hex 16 > encrypt.iv

# 创建密钥信息文件
echo "key_uri=https://example.com/encrypt.key" > keyinfo.txt
echo "key_file_path=encrypt.key" >> keyinfo.txt
cat encrypt.iv >> keyinfo.txt

# 加密编码
ffmpeg -i input.mp4 -c:v libx264 -preset fast -crf 22 \
  -c:a aac -b:a 128k \
  -hls_key_info_file keyinfo.txt \
  -hls_segment_filename "seg_%03d.ts" \
  -hls_time 6 \
  stream.m3u8
```

## HLS + HEVC（更好压缩）

```bash
ffmpeg -i input.mp4 \
  -c:v libx265 -preset fast -crf 24 \
  -c:a aac -b:a 128k \
  -hls_time 6 \
  -hls_playlist_type vod \
  -hls_segment_filename "hevc_seg_%03d.ts" \
  stream_h265.m3u8
```

## 低延迟 HLS（LL-HLS）

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

## 验证 HLS 输出

```bash
# 检查播放列表
ffprobe -v error -show_entries format=duration stream.m3u8

# 列出片段
ffprobe -v error -show_entries format=nb_streams stream.m3u8
```
