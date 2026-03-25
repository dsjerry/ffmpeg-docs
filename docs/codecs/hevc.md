# H.265 / HEVC

H.265（也称为 HEVC — High Efficiency Video Coding）在相同质量下提供比 H.264 **大约 50% 更好的压缩率**，非常适合 4K/8K 视频和带宽受限的传输场景。

## 使用 libx265 编码

```bash
# 基本编码
ffmpeg -i input.mp4 -c:v libx265 -preset fast -crf 28 \
  -c:a aac -b:a 128k output.mp4

# 高质量
ffmpeg -i input.mp4 -c:v libx265 -preset slow -crf 22 \
  -c:a aac -b:a 256k output_high_quality.mp4

# 小文件
ffmpeg -i input.mp4 -c:v libx265 -preset ultrafast -crf 32 \
  -c:a aac -b:a 96k output_small.mp4
```

## Preset 选项

从最快到最慢：

| Preset | 编码速度 | 压缩率 |
|--------|----------|--------|
| `ultrafast` | 最快 | 最低压缩 |
| `superfast` | | |
| `veryfast` | | |
| `faster` | | |
| `fast` | | |
| `medium` | 默认 | |
| `slow` | | |
| `slower` | | |
| `veryslow` | 最慢 | 最佳压缩 |

## Profile 与 Level

```bash
# Main profile
ffmpeg -i input.mp4 -c:v libx265 -preset fast -crf 28 \
  -profile:v main output_main.mp4

# Main10（10 位，更好的压缩质量）
ffmpeg -i input.mp4 -c:v libx265 -preset fast -crf 26 \
  -pix_fmt yuv420p10le \
  -profile:v main10 output_main10.mp4
```

## Tune 选项

```bash
# 调优颗粒
ffmpeg -i input.mp4 -c:v libx265 -preset fast -crf 26 \
  -tune grain output.mp4

# 调优低延迟
ffmpeg -i input.mp4 -c:v libx265 -preset ultrafast -crf 28 \
  -tune zerolatency output.mp4

# 调优 PSNR
ffmpeg -i input.mp4 -c:v libx265 -preset fast -crf 28 \
  -tune psnr output.mp4
```

## 硬件编码

```bash
# NVIDIA NVENC（HEVC）
ffmpeg -i input.mp4 -c:v hevc_nvenc -preset p7 -cq 28 \
  -c:a aac output_nvenc_hevc.mp4

# macOS VideoToolbox
ffmpeg -i input.mp4 -c:v hevc_videotoolbox -b:v 6M \
  -c:a aac output_videotoolbox_hevc.mp4

# VAAPI
ffmpeg -i input.mp4 -vaapi_device /dev/dri/renderD128 \
  -vf "hwupload,scale_vaapi=w=1920:h=1080:format=nv12" \
  -c:v hevc_vaapi output_vaapi_hevc.mp4
```

## HDR 支持

```bash
# HDR10（最常见）
ffmpeg -i input.mkv -c:v libx265 -preset slow -crf 22 \
  -pix_fmt yuv420p10le \
  -x265-params "hdr10=1:max-cll=1000,400:master-display=G(8500,39850)B(6550,2250)R(35450,14675)WP(15635,16450)L(10000000,200)" \
  -c:a eac3 -b:a 384k \
  output_hdr10.mp4

# HLG（混合对数伽马）
ffmpeg -i input.mkv -c:v libx265 -preset slow -crf 22 \
  -pix_fmt yuv420p10le \
  -x265-params "hlg=1" \
  -c:a eac3 -b:a 384k \
  output_hlg.mp4
```

## H.264 vs H.265 对比

| 方面 | H.264 | H.265 |
|------|-------|-------|
| 压缩率 | 好 | ~50% 更好 |
| 编码速度 | 更快 | 更慢 |
| 硬件支持 | 通用 | 正在增长 |
| 兼容性 | 极好 | 良好（现代设备） |
| 4K+ 视频 | 可以 | 理想 |
| 最佳用途 | 通用 Web、移动端 | 4K/8K、节省带宽 |
