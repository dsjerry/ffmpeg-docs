# 字幕

FFmpeg 支持提取、烧录和转换字幕格式。

## 提取字幕

```bash
# 从 MP4 提取 SRT
ffmpeg -i input.mp4 -map 0:s:0 output.srt

# 提取所有字幕轨道
ffmpeg -i input.mkv -map 0:s output_%d.srt

# 按语言过滤提取
ffmpeg -i input.mkv -map 0:s:m:language:eng output_eng.srt
```

## 转换字幕

```bash
# SRT 转 ASS（带样式）
ffmpeg -i input.srt output.ass

# ASS 转 SRT（去除样式）
ffmpeg -i input.ass output.srt

# 转换为 WebVTT（用于 HTML5）
ffmpeg -i input.srt output.vtt
```

## 烧录字幕到视频

```bash
# 将 SRT 烧录到视频
ffmpeg -i input.mp4 -vf "subtitles=input.srt" \
  -c:v libx264 -crf 22 -c:a aac output.mp4

# 烧录带样式的 ASS
ffmpeg -i input.mp4 -vf "subtitles=input.ass" \
  -c:v libx264 -crf 22 -c:a aac output.mp4

# 从内嵌轨道烧录字幕
ffmpeg -i input.mkv -vf "subtitles=input.mkv" \
  -c:v libx264 -crf 22 -c:a aac output.mp4

# 指定字幕样式
ffmpeg -i input.mp4 -vf "subtitles=input.srt:force_style='FontSize=24,PrimaryColour=&H00FFFF&'" \
  -c:v libx264 -crf 22 output.mp4
```

## 硬字幕（基于图像）

```bash
# 将文字字幕转换为基于图像的格式（适用于不支持字幕的播放器）
ffmpeg -i input.mp4 -vf "subtitles=input.srt:stream_index=0" \
  -c:v libx264 -crf 22 output_hardsub.mp4
```

## 添加软字幕轨道

```bash
# 复制字幕轨道（不烧录，让播放器选择是否显示）
ffmpeg -i input.mp4 -i subs.srt -c:v copy -c:a copy \
  -c:s srt -metadata:s:s:0 language=eng \
  output_with_subs.mp4

# 添加多语言字幕轨道
ffmpeg -i input.mp4 -i eng.srt -i spa.srt -i fra.srt \
  -c:v copy -c:a copy \
  -c:s srt \
  -metadata:s:s:0 language=eng \
  -metadata:s:s:1 language=spa \
  -metadata:s:s:2 language=fra \
  output_multilang.mp4
```

## 字幕比特流过滤器

```bash
# 为 MP4 转换 ASS 字幕（mov_text 编码器）
ffmpeg -i input.mp4 -i subs.ass \
  -c:v copy -c:a copy \
  -c:s mov_text \
  -bss:v filter_codec_tags -metadata:s:s:0 codec_tag=0x0000 \
  output_mp4.mp4
```

## 常见字幕格式

| 格式 | FFmpeg 编码器 | 描述 |
|------|-------------|------|
| SRT | subrip | 纯文本，兼容性最好 |
| ASS/SSA | ass | 高级样式，可动画 |
| WebVTT | webvtt | HTML5 网页标准 |
| VOBSub | dvdsub | 基于图像（DVD 字幕） |
| MovText | mov_text | MP4 软字幕 |
| HDMV PGS | hdmv_pgs_subtitle | 蓝光图像字幕 |

## 字幕滤镜

```bash
# 调整字幕位置
ffmpeg -i input.mp4 -vf "subtitles=input.srt:force_style='MarginV=50'" \
  -c:v libx264 output.mp4

# 改变字幕外观
ffmpeg -i input.mp4 -vf "subtitles=input.srt:force_style='FontName=Arial,FontSize=18,PrimaryColour=&H00FFFFFF&,OutlineColour=&H00000000&,Bold=1'" \
  -c:v libx264 output.mp4

# 缩放字幕字号
ffmpeg -i input.mp4 -vf "subtitles=input.srt:force_style='FontSize=36'" \
  -c:v libx264 output.mp4
```
