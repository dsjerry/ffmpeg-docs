# 裁剪与修剪

FFmpeg 提供了多种裁剪视频的方法，从快速的流复制裁剪到精确的重新编码裁剪。

## 关键选项

| 选项 | 描述 |
|------|------|
| `-ss time` | 跳转至指定位置 |
| `-t duration` | 处理时长 |
| `-to time` | 在指定时间停止 |
| `-accuracy` | 设置跳转精度（秒） |

## 快速裁剪（流复制）

使用 `-c copy` 直接复制流，不重新编码——速度很快但精度较低。

```bash
# 复制前 30 秒（-i 前 = 快速跳转）
ffmpeg -ss 0 -i input.mp4 -t 30 -c copy cut.mp4

# 复制 1:00 到 1:30
ffmpeg -ss 60 -i input.mp4 -t 30 -c copy cut.mp4

# 用 -to 代替 -t
ffmpeg -ss 60 -i input.mp4 -to 90 -c copy cut.mp4
```

::: warning 裁剪不精确
流复制的裁剪发生在关键帧边界上，因此可能不是帧精确的。实际起点/终点可能略有偏差。
:::

## 精确裁剪（重新编码）

要实现帧精确的裁剪，需要重新编码：

```bash
# 帧精确裁剪（重新编码）
ffmpeg -i input.mp4 -ss 00:01:30.500 -t 10 \
  -c:v libx264 -crf 22 -c:a aac \
  -avoid_negative_ts make_zero \
  cut.mp4

# 在 -i 前跳转（快速分析）+ 重新编码（精确输出）
ffmpeg -ss 00:01:30 -i input.mp4 -t 10 \
  -c:v libx264 -crf 22 -c:a aac \
  cut.mp4
```

## 按场景裁剪（使用滤镜）

```bash
# 检测场景变化并在每个场景处裁剪
ffmpeg -i input.mp4 -vf "select='gt(scene,0.3)',setpts=N/FRAME_RATE/TB" \
  -c:v libx264 -crf 22 -c:a aac clip_%03d.mp4
```

## 多点分割

```bash
# 仅保留前 60 秒
ffmpeg -i input.mp4 -t 60 -c copy part1.mp4

# 跳过前 30 秒，保留剩余部分
ffmpeg -ss 30 -i input.mp4 -c copy part2.mp4

# 删除中间部分（需要重新编码）
ffmpeg -i input.mp4 \
  -t 30 -c copy intro.mp4 \
  -ss 90 -t 60 -c copy middle_removed.mp4 \
  -i input.mp4 -ss 150 -c copy outro.mp4
```

## 时间戳格式

FFmpeg 支持多种时间戳格式：

```bash
# 仅秒数
ffmpeg -i input.mp4 -ss 90 -t 30 output.mp4

# HH:MM:SS
ffmpeg -i input.mp4 -ss 00:01:30 -t 00:00:30 output.mp4

# HH:MM:SS.ms（毫秒）
ffmpeg -i input.mp4 -ss 00:01:30.500 -t 10.250 output.mp4

# 从文件末尾（负数）
ffmpeg -i input.mp4 -sseof -30 -c copy output.mp4
```

## 带过渡的合并

```bash
# 使用 concat demuxer 合并多个片段
cat > list.txt << 'EOF'
file 'intro.mp4'
file 'main.mp4'
file 'outro.mp4'
EOF

ffmpeg -f concat -safe 0 -i list.txt -c copy merged.mp4
```

## 裁剪音频

```bash
# 提取前 30 秒音频
ffmpeg -i input.mp4 -ss 0 -t 30 -vn -c:a copy audio_cut.m4a

# 从 1:00 到 1:30
ffmpeg -i input.mp4 -ss 60 -t 30 -vn -c:a libmp3lame -b:a 192k audio.mp3
```
