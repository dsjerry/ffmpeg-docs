# ffmpeg

`ffmpeg` 是处理音视频转换、编码、解码和加工的核心工具。

## 概要

```
ffmpeg [全局选项] {[输入文件选项] -i 输入URL} ... {[输出文件选项] 输出URL} ...
```

## 常用选项

| 选项 | 描述 |
|------|------|
| `-i url` | 输入文件 URL |
| `-c[:stream] codec` | 指定流的编码器（copy、libx264、aac 等） |
| `-c:v` | 视频编码器简写 |
| `-c:a` | 音频编码器简写 |
| `-c:s` | 字幕编码器简写 |
| `-codecs` | 列出所有编码器 |
| `-encoders` | 列出所有编码器 |
| `-decoders` | 列出所有解码器 |
| `-filters` | 列出所有滤镜 |
| `-formats` | 列出所有格式 |
| `-bsf[:stream] bitstream_filter` | 对流应用比特流过滤器 |
| `-map` | 手动流映射 |
| `-t duration` | 限制转码/捕获的音视频时长 |
| `-ss position` | 跳转至指定位置（`-i` 之前 = 快速，`-i` 之后 = 精确） |
| `-to position` | 在指定位置停止写入 |
| `-f fmt` | 强制指定输入/输出格式 |
| `-y` | 直接覆盖输出文件 |
| `-n` | 如果存在则不覆盖 |
| `-loglevel level` | 设置日志级别 |
| `-hide_banner` | 隐藏启动横幅 |
| `-stats` | 打印编码进度 |

## 编码器复制模式

使用 `-c copy` 直接复制流，不重新编码（最快、无损）：

```bash
# 复制所有流（最快）
ffmpeg -i input.mkv -c copy output.mp4

# 复制视频，重新编码音频
ffmpeg -i input.mkv -c:v copy -c:a aac output.mp4

# 复制音频，重新编码视频
ffmpeg -i input.mkv -c:v libx264 -preset fast -crf 22 -c:a copy output.mp4
```

## 编码质量

### CRF（恒定质量因子）—— 推荐

```bash
# CRF 范围：0（无损）到 51（最差）
# 18-23：视觉无损 / 高质量
# 23-28：流媒体适用
# 28-35：文件更小，可见失真
ffmpeg -i input.mp4 -c:v libx264 -crf 22 output.mp4
```

### Preset（编码速度）

| Preset | 速度 | 适用场景 |
|--------|------|---------|
| `ultrafast` | 最快 | 直播、实时 |
| `superfast` | | |
| `veryfast` | | |
| `faster` | | |
| `fast` | | 高质量编码 |
| `medium` | | 默认 |
| `slow` | | |
| `slower` | | 最佳压缩 |
| `veryslow` | 最慢 | 归档/母版 |

```bash
ffmpeg -i input.mp4 -c:v libx264 -preset veryslow -crf 18 output.mp4
```

## 硬件加速

```bash
# NVIDIA NVENC
ffmpeg -i input.mp4 -c:v h264_nvenc -preset p7 -cq 23 output.mp4

# Intel VAAPI (Linux)
ffmpeg -hwaccel vaapi -hwaccel_output_format vaapi -i input.mp4 \
  -c:v h264_vaapi output.mp4

# macOS VideoToolbox
ffmpeg -i input.mp4 -c:v h264_videotoolbox -b:v 6M output.mp4
```

## 输入/输出选项

```bash
# 限制时长
ffmpeg -i input.mp4 -t 60 output.mp4

# 限制输出文件大小
ffmpeg -i input.mp4 -fs 10M output.mp4

# 跳转到指定位置（放在 -i 前 = 快速跳转）
ffmpeg -ss 01:30 -i input.mp4 -t 30 -c copy output.mp4

# 多输入
ffmpeg -i video.mp4 -i audio.mp3 -c:v copy -c:a aac output.mp4

# 跳过某些流
ffmpeg -i input.mkv -map 0:v -map 0:a:1 -c copy output.mp4
```
