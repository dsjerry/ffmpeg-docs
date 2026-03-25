# AV1

AV1 是由 **开放媒体联盟** 开发的**最新开放、免版税视频编码器**。它在不收取许可费的情况下提供比 H.265 更好的压缩率。

## 使用 libsvtav1 编码（最快）

```bash
# 基本 AV1 编码
ffmpeg -i input.mp4 -c:v libsvtav1 -crf 40 \
  -c:a libopus -b:a 128k output_av1.mkv

# 更高质量
ffmpeg -i input.mp4 -c:v libsvtav1 -crf 30 \
  -preset 8 \
  -c:a libopus -b:a 192k output_av1_hq.mkv

# 小文件
ffmpeg -i input.mp4 -c:v libsvtav1 -crf 50 \
  -preset 10 \
  -c:a libopus -b:a 64k output_av1_small.mkv
```

## 使用 libaom 编码（最慢但最佳质量）

```bash
# CPU 密集型，用于归档
ffmpeg -i input.mp4 -c:v libaom-av1 -crf 35 -cpu-used 0 \
  -c:a libopus -b:a 192k output_av1_aom.mkv
```

## 编码速度（libsvtav1）

| Preset | 速度 | 适用场景 |
|--------|------|---------|
| 5-6 | 最快 | 直播 |
| 8 | 默认 | 点播、Web 发布 |
| 10 | 最慢 | 归档 |

## 对比

| 编码器 | 压缩率 | 速度 | 版税 | 浏览器支持 |
|--------|--------|------|------|-----------|
| H.264 | 基准 | 最快 | 专利池 | 通用 |
| H.265 | 好 | 快 | 专利池 | 正在增长 |
| VP9 | 好 | 中等 | 免费 | Chrome、Firefox、Edge |
| AV1 | 最佳 | 慢 | 免费 | Chrome、Firefox、Edge（现代版） |

## AV1 流媒体

```bash
# AV1 Web 发布
ffmpeg -i input.mp4 -c:v libsvtav1 -crf 38 -preset 8 \
  -g 240 \
  -c:v libsvtav1 -crf 38 -svtav1-params "tune=0" \
  -c:a libopus -b:a 128k output_av1_streaming.mp4

# 自适应码率 AV1
ffmpeg -i input.mp4 \
  -c:v libsvtav1 -crf 35 -preset 8 -b:v:0 3000k -maxrate:v:0 4500k \
  -c:v libsvtav1 -crf 40 -preset 8 -b:v:1 1500k -maxrate:v:1 2250k \
  -c:v libsvtav1 -crf 45 -preset 8 -b:v:2 800k -maxrate:v:2 1200k \
  -c:a libopus -b:a 128k \
  -f tee "[select=v:0,a:0]output_3000.mkv|[select=v:1,a:0]output_1500.mkv|[select=v:2,a:0]output_800.mkv"
```

## AV1 HDR

```bash
# AV1 HDR10
ffmpeg -i input.mkv -c:v libsvtav1 -crf 30 \
  -pix_fmt yuv420p10le -svtav1-params "hdr=1" \
  -c:a eac3_at -b:a 384k \
  output_av1_hdr.mkv
```

::: tip 浏览器支持
AV1 硬件解码在 Chrome 107+、Firefox 118+、Edge 107+ 和 Safari 16.4+（有一些限制）中可用。软件解码可在所有现代浏览器中运行，但在老设备上可能消耗较多 CPU。
:::
