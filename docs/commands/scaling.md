# 缩放与调整大小

FFmpeg 的 `scale` 滤镜可调整视频尺寸。高度始终使用 `-2`，以确保尺寸能被 2 整除（许多编码器有此要求）。

## 基本缩放

```bash
# 缩放到 720p（保持宽高比）
ffmpeg -i input.mp4 -vf "scale=1280:-2" output.mp4

# 缩放到 480p
ffmpeg -i input.mp4 -vf "scale=854:-2" output.mp4

# 缩放到指定尺寸（忽略宽高比）
ffmpeg -i input.mp4 -vf "scale=1920:1080" output.mp4

# 缩放到 50%
ffmpeg -i input.mp4 -vf "scale=iw*0.5:ih*0.5" output.mp4

# 放大到 2 倍
ffmpeg -i input.mp4 -vf "scale=iw*2:ih*2" output.mp4
```

## 缩放 + 编码

```bash
# 缩放 + H.264 编码
ffmpeg -i input.mp4 -vf "scale=1280:-2" \
  -c:v libx264 -preset fast -crf 22 \
  -c:a aac output_720p.mp4

# 缩放到 480p + 快速编码
ffmpeg -i input.mp4 -vf "scale=854:-2" \
  -c:v libx264 -preset ultrafast -crf 28 \
  -c:a aac output_480p.mp4
```

## 放大 vs 缩小

```bash
# 双线性放大（更快，质量较低）
ffmpeg -i input.mp4 -vf "scale=1920:1080:flags=bilinear" output.mp4

# Lanczos 放大（更慢，质量更好）
ffmpeg -i input.mp4 -vf "scale=1920:1080:flags=lanczos" output.mp4

# 精确缩放到 1920x1080（裁剪或填充以适应）
ffmpeg -i input.mp4 -vf "scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2" output.mp4
```

## 添加黑边（Letterbox / Pillarbox）

```bash
# 适应 16:9 并添加黑边
ffmpeg -i input.mp4 -vf "scale=1280:720:force_original_aspect_ratio=decrease,pad=1280:720:(ow-iw)/2:(oh-ih)/2:setsar=1" \
  -c:v libx264 -preset fast -crf 22 output_padded.mp4
```

## 自动裁剪检测

```bash
# 自动检测裁剪区域
ffmpeg -i input.mp4 -vf "cropdetect=limit=0:round=2" -frames:v 50 -f null -

# 使用检测到的裁剪值
ffmpeg -i input.mp4 -vf "crop=1920:800:0:140" -c:v libx264 -preset fast output_cropped.mp4
```

## 多分辨率输出

```bash
# 同时创建多个分辨率版本
ffmpeg -i input.mp4 \
  -vf "scale=1920:-2" -c:v libx264 -preset fast -crf 22 -c:a aac -b:a 192k -sn -map 0:v:0 -map 0:a:0 output_1080p.mp4 \
  -vf "scale=1280:-2" -c:v libx264 -preset fast -crf 22 -c:a aac -b:a 128k -sn -map 0:v:0 -map 0:a:0 output_720p.mp4 \
  -vf "scale=854:-2" -c:v libx264 -preset fast -crf 24 -c:a aac -b:a 96k -sn -map 0:v:0 -map 0:a:0 output_480p.mp4
```

## 旋转 / 翻转

```bash
# 顺时针旋转 90 度
ffmpeg -i input.mp4 -vf "rotate=PI/2" -c:a copy output.mp4

# 逆时针旋转 90 度
ffmpeg -i input.mp4 -vf "rotate=-PI/2" -c:a copy output.mp4

# 水平翻转
ffmpeg -i input.mp4 -vf "hflip" -c:a copy output.mp4

# 垂直翻转
ffmpeg -i input.mp4 -vf "vflip" -c:a copy output.mp4
```

## 缩放变量参考

| 变量 | 描述 |
|------|------|
| `iw` | 输入宽度 |
| `ih` | 输入高度 |
| `ow` | 输出宽度 |
| `oh` | 输出高度 |
| `in` | 输入帧编号 |
| `on` | 输出帧编号 |
| `sar` | 输入采样宽高比 |
| `dar` | 输入显示宽高比 |
