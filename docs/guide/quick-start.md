# 快速开始

在几分钟内掌握 FFmpeg 的基本操作。本页涵盖日常最常用的功能。

## 1. 查看文件信息

```bash
ffprobe -hide_banner input.mp4
```

会显示编码器信息、时长、码率和流详情。

## 2. 转换为 Web 优化的 MP4

最常见的 Web 输出格式：

```bash
ffmpeg -i input.mov -c:v libx264 -preset fast -crf 22 \
  -c:a aac -b:a 128k -movflags +faststart output.mp4
```

::: tip 各选项含义
- `libx264` — H.264 视频编码器（兼容性最好）
- `preset fast` — 编码速度（ultrafast → veryslow，越快 = 文件越大）
- `crf 22` — 质量（0=无损，23=默认，51=最差）
- `+faststart` — 将元数据移到文件开头，加快网页加载速度
:::

## 3. 裁剪片段

```bash
# 从 1 分 30 秒开始提取 10 秒
ffmpeg -i input.mp4 -ss 00:01:30 -t 10 \
  -c:v libx264 -crf 22 -c:a aac clip.mp4
```

将 `-ss` 放在输入之前可更快精确定位：

```bash
ffmpeg -ss 00:01:30 -i input.mp4 -t 10 \
  -c:v libx264 -crf 22 -c:a aac -avoid_negative_ts make_zero clip.mp4
```

## 4. 调整视频大小

```bash
# 缩放到 720p（-2 保持宽高比）
ffmpeg -i input.mp4 -vf "scale=1280:-2" \
  -c:v libx264 -preset fast -crf 22 output_720p.mp4

# 缩放到原尺寸的 50%
ffmpeg -i input.mp4 -vf "scale=iw*0.5:ih*0.5" \
  -c:v libx264 -preset fast -crf 22 output_half.mp4
```

## 5. 提取音频

```bash
# 提取为 AAC（M4A 容器）
ffmpeg -i input.mp4 -vn -c:a copy audio.m4a

# 提取为 MP3
ffmpeg -i input.mp4 -vn -c:a libmp3lame -b:a 192k audio.mp3
```

## 6. 创建 GIF

```bash
# 简单方式（文件较大）
ffmpeg -i input.mp4 -vf "fps=15,scale=480:-1" -loop 0 output.gif

# 高质量（使用调色板）
ffmpeg -i input.mp4 -vf "fps=15,scale=480:-1:flags=lanczos,split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse" -loop 0 output.gif
```

## 7. 视频转图片序列

```bash
# 每秒提取一帧为 JPEG
ffmpeg -i input.mp4 -vf "fps=1" frame_%04d.jpg

# 每 30 帧提取一帧
ffmpeg -i input.mp4 -vf "select=not(mod(n\,30))" -vsync vfr frame_%04d.png
```

## 8. 合并片段

```bash
# 创建列表
cat > list.txt << 'EOF'
file 'intro.mp4'
file 'main.mp4'
file 'outro.mp4'
EOF

# 合并
ffmpeg -f concat -safe 0 -i list.txt -c copy merged.mp4
```

## 9. 添加水印/叠加

```bash
# 图片水印（右上角，10px 边距）
ffmpeg -i input.mp4 -i logo.png -filter_complex \
  "overlay=W-w-10:10" -c:a copy output.mp4

# 文字水印
ffmpeg -i input.mp4 -vf "drawtext=text='Copyright':fontsize=24:fontcolor=white:x=10:y=10" \
  -c:a copy output.mp4
```

## 10. 音频响度标准化

```bash
ffmpeg -i input.wav -af "loudnorm=I=-16:TP=-1.5:LRA=11" output.wav
```

这对于播客和音乐至关重要 — 它可以将平均响度调整到一致的水平。

## 下一步

- 查看 [命令参考](/commands/ffmpeg) 了解详细用法
- 参考 [速查表](/cheat-sheet) 获取快速命令
- 学习 [滤镜](/filters/video-filters) 进行高级处理
