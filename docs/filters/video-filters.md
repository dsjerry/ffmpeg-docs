# 视频滤镜

FFmpeg 的滤镜系统在编码过程中对视频应用转换。使用 `-vf`（视频滤镜）处理简单链，使用 `-filter_complex` 处理多输入/多输出。

## 色彩与调整

```bash
# 亮度（-1.0 到 1.0）
ffmpeg -i input.mp4 -vf "eq=brightness=0.1" output.mp4

# 对比度（0.0 到 2.0）
ffmpeg -i input.mp4 -vf "eq=contrast=1.2" output.mp4

# 饱和度（0.0 到 3.0）
ffmpeg -i input.mp4 -vf "eq=saturation=1.5" output.mp4

# 色相偏移（-180 到 180 度）
ffmpeg -i input.mp4 -vf "eq=hue=30" output.mp4

# 所有调整组合
ffmpeg -i input.mp4 -vf "eq=brightness=0.05:contrast=1.1:saturation=1.2" output.mp4

# 色彩分级（色阶）
ffmpeg -i input.mp4 -vf "colorlevels=rimax=0.9:gimax=0.9:bimax=0.9" output.mp4
```

## 模糊与锐化

```bash
# 高斯模糊
ffmpeg -i input.mp4 -vf "blur=10" output.mp4

# 选择性模糊
ffmpeg -i input.mp4 -vf "boxblur=2:1" output.mp4

# 锐化
ffmpeg -i input.mp4 -vf "unsharp=5:5:1.0" output.mp4

# 带参数的锐化
ffmpeg -i input.mp4 -vf "unsharp=7:7:0.5:7:7:0.5" output.mp4
```

## 隔行扫描与帧率

```bash
# 隔行扫描（bob 方法 — 加倍帧率）
ffmpeg -i input.mp4 -vf "bwdif=mode=1" output.mp4

# Yadif 隔行扫描
ffmpeg -i input.mp4 -vf "yadif=1:-1:0" output.mp4

# 改变帧率
ffmpeg -i input.mp4 -vf "fps=30" output.mp4

# 加倍帧率（插帧）
ffmpeg -i input.mp4 -vf "minterpolate=fps=60" output.mp4
```

## 降噪

```bash
# 空间降噪（快速）
ffmpeg -i input.mp4 -vf "denoise0n=0:0:3:0:0:3" output.mp4

# HQDN3D（时序 + 空间）
ffmpeg -i input.mp4 -vf "hqdn3d=4:3:4:3" output.mp4

# NLMeans 降噪
ffmpeg -i input.mp4 -vf "nlmeans=s=3" output.mp4
```

## 稳定化

```bash
# 先分析（生成 .trf 文件）
ffmpeg -i input.mp4 -vf "vidstabdetect=shakiness=5:accuracy=15:result=transforms.trf" -f null -

# 应用稳定化
ffmpeg -i input.mp4 -vf "vidstabtransform=input=transforms.trf:smoothing=10:crop=black:zoom=5" \
  -c:v libx264 -preset fast output_stabilized.mp4
```

## 裁剪与填充

```bash
# 每边裁剪 100px
ffmpeg -i input.mp4 -vf "crop=in_w-200:in_h-200:100:100" output.mp4

# 裁剪为中间 16:9
ffmpeg -i input.mp4 -vf "crop=in_h*16/9:in_h" output_16_9.mp4

# 添加填充（Letterbox 到 1920x1080）
ffmpeg -i input.mp4 -vf "pad=1920:1080:(ow-iw)/2:(oh-ih)/2:color=black" output.mp4
```

## 文字与图形叠加

```bash
# 简单文字叠加
ffmpeg -i input.mp4 -vf "drawtext=text='Hello World':fontsize=48:fontcolor=white:x=20:y=20" \
  -c:v libx264 output.mp4

# 带字体和位置的水印
ffmpeg -i input.mp4 -vf "drawtext=text='Copyright 2024':fontsize=24:fontcolor=white:font=DejaVuSans:x=10:y=h-th-10" \
  -c:v libx264 output.mp4

# 带时间码的文字
ffmpeg -i input.mp4 -vf "drawtext=text='%{pts\\:hms}':fontsize=36:fontcolor=white:x=10:y=10" \
  -c:v libx264 output.mp4

# Logo 叠加（右上角）
ffmpeg -i input.mp4 -i logo.png -filter_complex "[0:v][1:v]overlay=W-w-10:10" \
  -c:a copy output.mp4

# Logo 叠加（左下角）
ffmpeg -i input.mp4 -i logo.png -filter_complex "[0:v][1:v]overlay=10:H-h-10" \
  -c:a copy output.mp4
```
