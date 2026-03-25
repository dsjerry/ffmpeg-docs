# 视频转 GIF

视频转 GIF 是最常见的 FFmpeg 操作之一。有两种方法：简单（更快，文件较大）和高质量（更慢，文件较小）。

## 简单方法

```bash
# 从前 10 秒创建基本 GIF
ffmpeg -i input.mp4 -t 10 -vf "fps=15,scale=480:-1" -loop 0 output.gif
```

## 高质量方法（推荐）

调色板方法生成自定义色彩调色板以获得更好质量：

```bash
# 步骤 1：生成调色板
ffmpeg -i input.mp4 -vf "fps=15,scale=480:-1:flags=lanczos,palettegen=stats_mode=diff" palette.png

# 步骤 2：使用调色板创建 GIF
ffmpeg -i input.mp4 -i palette.png -t 10 \
  -lavfi "fps=15,scale=480:-1:flags=lanczos[x];[x][1:v]paletteuse=dither=bayer:bayer_scale=5:diff_mode=rectangle" \
  -loop 0 output.gif
```

## 一行命令（使用调色板）

```bash
# 优化的一行命令
ffmpeg -i input.mp4 -vf "fps=15,scale=480:-1:flags=lanczos,split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse=dither=bayer:bayer_scale=5" \
  -loop 0 output.gif
```

## GIF 参数说明

| 参数 | 描述 |
|------|------|
| `fps=n` | 每秒帧数（GIF 推荐 15-20） |
| `scale=w:-1` | 缩放宽度为 `w`，高度自动（-2 保持可被 2 整除） |
| `flags=lanczos` | 高质量缩小滤镜 |
| `-loop 0` | 无限循环（用 `-loop N` 表示 N 次循环） |
| `-t n` | 时长（秒） |

## 提取特定片段

```bash
# 从 5 秒到 15 秒的 GIF
ffmpeg -ss 5 -t 10 -i input.mp4 \
  -vf "fps=15,scale=480:-1:flags=lanczos,split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse" \
  -loop 0 output.gif
```

## 按帧数裁剪

```bash
# 前 100 帧
ffmpeg -i input.mp4 -vframes 100 \
  -vf "fps=15,scale=480:-1:flags=lanczos,split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse" \
  -loop 0 output.gif
```

## 适合移动端（小文件）

```bash
ffmpeg -i input.mp4 -t 5 \
  -vf "fps=10,scale=320:-1:flags=fast_bilinear,split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse" \
  -loop 0 output_small.gif
```

## 文字叠加 GIF

```bash
ffmpeg -i input.mp4 -t 5 \
  -vf "fps=15,scale=480:-1:flags=lanczos,drawtext=text='Hello':fontsize=24:fontcolor=white:borderw=2:bordercolor=black,split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse" \
  -loop 0 output_text.gif
```

## 批量转换文件夹中所有视频

```bash
for f in *.mp4; do
  ffmpeg -i "$f" -vf "fps=15,scale=480:-1:flags=lanczos,split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse" \
    -loop 0 "${f%.mp4}.gif"
done
```

## 输出质量对比

| 方法 | FPS | 分辨率 | 典型大小（10秒） |
|------|------|--------|-----------------|
| 简单 | 10 | 320p | 3-5 MB |
| 高质量 | 15 | 480p | 1-3 MB |
| 高质量 | 20 | 480p | 2-5 MB |
| 低质量 | 10 | 240p | 0.5-1 MB |
