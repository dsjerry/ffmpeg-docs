# 基本用法

## 获取媒体信息

### ffprobe

检查任意媒体文件，无需修改：

```bash
# 快速信息
ffprobe video.mp4

# 详细流信息
ffprobe -v error -show_streams -show_format video.mp4

# JSON 格式（用于脚本）
ffprobe -v error -show_streams -show_format -of json video.mp4

# 指定流信息
ffprobe -v error -select_streams v:0 -show_entries stream=codec_name,width,height -of csv=p=0 video.mp4
```

## 格式转换

### 无损转封装

不重新编码，只更换容器：

```bash
# MKV 转 MP4（无损）
ffmpeg -i input.mkv -c copy output.mp4
```

### 重新编码以获得兼容性

```bash
# AVI 转 MP4（H.264）
ffmpeg -i input.avi -c:v libx264 -preset fast -crf 23 \
  -c:a aac -b:a 128k output.mp4

# WebM（VP9 + Opus）
ffmpeg -i input.mp4 -c:v libvpx-vp9 -crf 30 -b:v 0 \
  -c:a libopus -b:a 128k output.webm

# MOV 转 ProRes（用于剪辑）
ffmpeg -i input.mov -c:v prores_ks -profile:v 3 \
  -c:a pcm_s16le output.mov
```

## 处理视频

### 提取帧

```bash
# 在指定时间点提取单帧
ffmpeg -ss 00:01:23 -i input.mp4 -frames:v 1 screenshot.jpg

# 每隔 N 帧提取一帧
ffmpeg -i input.mp4 -vf "select=not(mod(n\,100))" -vsync vfr frame_%04d.png
```

### 合并视频

**方法一：concat demuxer（可靠）**
```bash
# 创建文件列表
echo "file 'part1.mp4'" > files.txt
echo "file 'part2.mp4'" >> files.txt
echo "file 'part3.mp4'" >> files.txt

# 合并
ffmpeg -f concat -safe 0 -i files.txt -c copy merged.mp4
```

**方法二：concat protocol（同编码格式适用）**
```bash
ffmpeg -i "concat:part1.mp4|part2.mp4|part3.mp4" -c copy merged.mp4
```

## 处理音频

### 提取音频

```bash
# 提取音轨（直接复制）
ffmpeg -i input.mp4 -vn -c:a copy audio.m4a

# 提取并重新编码
ffmpeg -i input.mp4 -vn -c:a libmp3lame -b:a 192k audio.mp3
```

### 添加音轨到视频

```bash
ffmpeg -i video.mp4 -i audio.mp3 -c:v copy \
  -c:a aac -b:a 192k -shortest output.mp4
```

### 替换音轨

```bash
ffmpeg -i video_with_audio.mp4 -i new_audio.aac \
  -c:v copy -c:a aac -map 0:v:0 -map 1:a:0 output.mp4
```

## 常用的全局标志

| 标志 | 描述 |
|------|------|
| `-y` | 直接覆盖输出文件 |
| `-n` | 不覆盖（如果存在则退出） |
| `-hide_banner` | 隐藏版本/版权信息 |
| `-loglevel level` | 控制详细程度（quiet, fatal, error, warning, info, verbose, debug） |
| `-threads n` | 限制使用的 CPU 线程数 |
| `-progress url` | 将进度写入文件或 URL |
