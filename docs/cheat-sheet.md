# FFmpeg 速查表

最常用的 FFmpeg 命令快速参考。

## 检查文件

```bash
# 文件信息
ffprobe -hide_banner input.mp4

# JSON 元数据
ffprobe -v error -show_format -show_streams -of json input.mp4

# 仅时长
ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 input.mp4

# 视频编码器、分辨率、帧率
ffprobe -v error -select_streams v:0 -show_entries stream=codec_name,width,height,r_frame_rate -of csv=p=0 input.mp4
```

## 格式转换

```bash
# MKV → MP4（无损转封装）
ffmpeg -i input.mkv -c copy output.mp4

# 任意 → MP4（H.264 + AAC，Web 优化）
ffmpeg -i input.avi -c:v libx264 -preset fast -crf 22 \
  -c:a aac -b:a 128k -movflags +faststart output.mp4

# 任意 → WebM（VP9 + Opus）
ffmpeg -i input.mp4 -c:v libvpx-vp9 -crf 30 -b:v 0 \
  -c:a libopus -b:a 128k output.webm

# 任意 → GIF（简单）
ffmpeg -i input.mp4 -vf "fps=15,scale=480:-1" -loop 0 output.gif

# 任意 → GIF（高质量）
ffmpeg -i input.mp4 -vf "fps=15,scale=480:-1:flags=lanczos,split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse" -loop 0 output.gif
```

## 视频处理

```bash
# 缩放到 720p
ffmpeg -i input.mp4 -vf "scale=1280:-2" -c:v libx264 -preset fast output_720p.mp4

# 从 1:00 开始裁剪 30 秒
ffmpeg -ss 60 -i input.mp4 -t 30 -c copy output.mp4

# 精确裁剪（重新编码）
ffmpeg -ss 60 -i input.mp4 -t 30 -c:v libx264 -crf 22 -c:a aac output.mp4

# 合并视频
ffmpeg -f concat -safe 0 -i list.txt -c copy merged.mp4

# 提取帧
ffmpeg -ss 00:01:00 -i input.mp4 -frames:v 1 screenshot.jpg

# 每秒提取一帧
ffmpeg -i input.mp4 -vf "fps=1" frame_%04d.jpg
```

## 音频处理

```bash
# 提取音频（复制）
ffmpeg -i input.mp4 -vn -c:a copy audio.m4a

# 提取并转换为 MP3
ffmpeg -i input.mp4 -vn -c:a libmp3lame -b:a 192k audio.mp3

# 添加音频到视频
ffmpeg -i video.mp4 -i audio.mp3 -c:v copy -c:a aac -b:a 128k -shortest output.mp4

# 响度标准化
ffmpeg -i input.wav -af "loudnorm=I=-16:TP=-1.5:LRA=11" output.wav

# 淡入/淡出
ffmpeg -i input.mp3 -af "afade=t=in:ss=0:d=2,afade=t=out:st=57:d=3" output.mp3
```

## 字幕

```bash
# 提取字幕
ffmpeg -i input.mp4 -map 0:s:0 output.srt

# 烧录字幕到视频
ffmpeg -i input.mp4 -vf "subtitles=subs.srt" \
  -c:v libx264 -crf 22 -c:a aac output_with_subs.mp4

# 添加软字幕轨道
ffmpeg -i input.mp4 -i subs.srt -c:v copy -c:a copy \
  -c:s srt -metadata:s:s:0 language=eng output.mp4
```

## 水印与叠加

```bash
# 图片水印（右上角）
ffmpeg -i input.mp4 -i logo.png \
  -filter_complex "overlay=W-w-10:10" -c:a copy output.mp4

# 文字水印
ffmpeg -i input.mp4 -vf "drawtext=text='Copyright':fontsize=24:fontcolor=white:x=10:y=10" \
  -c:a copy output.mp4
```

## 流媒体

```bash
# HLS（点播）
ffmpeg -i input.mp4 -c:v libx264 -preset fast -crf 22 \
  -c:a aac -b:a 128k -hls_time 6 \
  -hls_playlist_type vod -hls_segment_filename "seg_%03d.ts" \
  stream.m3u8

# RTMP 推流
ffmpeg -re -i input.mp4 -c:v libx264 -preset veryfast -b:v 4500k \
  -c:a aac -b:a 160k -f flv rtmp://server/live/stream_key
```

## 编码质量

| CRF 值 | 质量 | 适用场景 |
|--------|------|---------|
| 18-20 | 近无损 | 高质量归档 |
| 20-23 | 高 | 默认高质量 |
| 23-26 | 良好 | 流媒体 |
| 26-29 | 可接受 | 低带宽 |
| 29+ | 低 | 最低质量 |

## H.264 Preset（速度 vs 压缩）

| Preset | 速度 | 压缩率 |
|--------|------|--------|
| `ultrafast` | 最快 | 最低 |
| `superfast` | | |
| `veryfast` | | |
| `faster` | | |
| `fast` | | |
| `medium` | 默认 | |
| `slow` | | |
| `slower` | | |
| `veryslow` | 最慢 | 最佳 |

## 常用标志

| 标志 | 描述 |
|------|------|
| `-y` | 不询问直接覆盖 |
| `-n` | 不覆盖 |
| `-hide_banner` | 隐藏启动横幅 |
| `-c copy` | 复制流（不重新编码） |
| `-c:v copy` | 仅复制视频 |
| `-c:a copy` | 仅复制音频 |
| `-vn` | 无视频 |
| `-an` | 无音频 |
| `-threads n` | 限制 CPU 线程数 |
| `-progress url` | 记录进度 |
