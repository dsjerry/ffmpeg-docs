# 水印

为视频添加水印（文字、Logo 或图片）是品牌推广和版权保护的常见需求。

## 图片水印（Logo）

### 右上角

```bash
ffmpeg -i input.mp4 -i logo.png \
  -filter_complex "overlay=W-w-10:10" \
  -c:a copy output.mp4
```

### 右下角

```bash
ffmpeg -i input.mp4 -i logo.png \
  -filter_complex "overlay=W-w-10:H-h-10" \
  -c:a copy output.mp4
```

### 左下角

```bash
ffmpeg -i input.mp4 -i logo.png \
  -filter_complex "overlay=10:H-h-10" \
  -c:a copy output.mp4
```

### 居中

```bash
ffmpeg -i input.mp4 -i logo.png \
  -filter_complex "overlay=(W-w)/2:(H-h)/2" \
  -c:a copy output.mp4
```

## 文字水印

### 简单文字

```bash
ffmpeg -i input.mp4 -vf "drawtext=text='Copyright 2024':fontsize=24:fontcolor=white:x=10:y=10" \
  -c:a copy output.mp4
```

### 带描边的文字（更醒目）

```bash
ffmpeg -i input.mp4 -vf "drawtext=text='Copyright 2024':fontsize=24:fontcolor=white:borderw=2:bordercolor=black:x=10:y=10" \
  -c:a copy output.mp4
```

### 带背景的文字

```bash
ffmpeg -i input.mp4 -vf "drawtext=text='Copyright 2024':fontsize=24:fontcolor=white:box=1:boxcolor=black@0.5:boxborderw=4:x=10:y=10" \
  -c:a copy output.mp4
```

### 带时间戳的文字

```bash
ffmpeg -i input.mp4 -vf "drawtext=text='%{pts\\:hms}':fontsize=20:fontcolor=white:x=10:y=h-th-10" \
  -c:a copy output.mp4
```

### 动态文字（随时间变化）

```bash
ffmpeg -i input.mp4 -vf "drawtext=text='Recording':fontsize=36:fontcolor=white:x=10:y=10:enable='between(t,0,10)'" \
  -c:a copy output.mp4
```

## 水印大小与透明度

### 缩放 Logo

```bash
ffmpeg -i input.mp4 -i logo.png \
  -filter_complex "[1:v]scale=100:100[wm];[0:v][wm]overlay=W-w-20:20" \
  -c:a copy output.mp4
```

### 半透明 Logo

```bash
# 先创建半透明版本
ffmpeg -i logo.png -vf "format=rgba,colorchannelmixer=aa=0.5" logo_alpha.png

# 应用
ffmpeg -i input.mp4 -i logo_alpha.png \
  -filter_complex "overlay=W-w-20:20" \
  -c:a copy output.mp4
```

## 位置公式

| 位置 | 公式 |
|------|------|
| 左上角 | `10:10` |
| 右上角 | `W-w-10:10` |
| 左下角 | `10:H-h-10` |
| 右下角 | `W-w-10:H-h-10` |
| 居中 | `(W-w)/2:(H-h)/2` |
| 上中 | `(W-w)/2:10` |
| 下中 | `(W-w)/2:H-h-10` |

## 多水印

```bash
# Logo + 文字
ffmpeg -i input.mp4 -i logo.png \
  -filter_complex "[0:v]drawtext=text='Channel':fontsize=18:fontcolor=white:borderw=1:bordercolor=black:x=10:y=10[bg];[bg][1:v]overlay=W-w-10:10" \
  -c:a copy output.mp4
```

## 动态水印（移动）

```bash
# Logo 从左到右移动
ffmpeg -i input.mp4 -i logo.png \
  -filter_complex "[1:v]scale=80:80[wm];[0:v][wm]overlay='x=mod(t*50,n*W)':y=20" \
  -c:a copy output.mp4

# 淡入水印
ffmpeg -i input.mp4 -i logo.png \
  -filter_complex "[1:v]scale=80:80,fade=t=out:st=10:d=2:alpha=1[wm];[0:v][wm]overlay=W-w-20:20:enable='between(t,0,10)'" \
  -c:a copy output.mp4
```

## 批量添加水印

```bash
for f in *.mp4; do
  ffmpeg -i "$f" -i logo.png \
    -filter_complex "overlay=W-w-10:10" \
    -c:a copy "watermarked_${f}"
done
```
