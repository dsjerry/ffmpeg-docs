# H.265 / HEVC

H.265 (also known as HEVC — High Efficiency Video Coding) offers roughly **50% better compression than H.264** at the same quality, making it ideal for 4K/8K video and bandwidth-constrained delivery.

## Encoding with libx265

```bash
# Basic encoding
ffmpeg -i input.mp4 -c:v libx265 -preset fast -crf 28 \
  -c:a aac -b:a 128k output.mp4

# High quality
ffmpeg -i input.mp4 -c:v libx265 -preset slow -crf 22 \
  -c:a aac -b:a 256k output_high_quality.mp4

# Small file
ffmpeg -i input.mp4 -c:v libx265 -preset ultrafast -crf 32 \
  -c:a aac -b:a 96k output_small.mp4
```

## Preset Options

From fastest to slowest:

| Preset | Encoding Speed | Compression |
|--------|----------------|-------------|
| `ultrafast` | Fastest | Lowest compression |
| `superfast` | | |
| `veryfast` | | |
| `faster` | | |
| `fast` | | |
| `medium` | Default | |
| `slow` | | |
| `slower` | | |
| `veryslow` | Slowest | Best compression |

## Profile & Level

```bash
# Main profile
ffmpeg -i input.mp4 -c:v libx265 -preset fast -crf 28 \
  -profile:v main output_main.mp4

# Main10 (10-bit, better quality at same bitrate)
ffmpeg -i input.mp4 -c:v libx265 -preset fast -crf 26 \
  -pix_fmt yuv420p10le \
  -profile:v main10 output_main10.mp4
```

## Tune Options

```bash
# Tune for grain
ffmpeg -i input.mp4 -c:v libx265 -preset fast -crf 26 \
  -tune grain output.mp4

# Tune for low latency
ffmpeg -i input.mp4 -c:v libx265 -preset ultrafast -crf 28 \
  -tune zerolatency output.mp4

# Tune for PSNR
ffmpeg -i input.mp4 -c:v libx265 -preset fast -crf 28 \
  -tune psnr output.mp4
```

## Hardware Encoding

```bash
# NVIDIA NVENC (HEVC)
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

## HDR Support

```bash
# HDR10 (most common)
ffmpeg -i input.mkv -c:v libx265 -preset slow -crf 22 \
  -pix_fmt yuv420p10le \
  -x265-params "hdr10=1:max-cll=1000,400:master-display=G(8500,39850)B(6550,2250)R(35450,14675)WP(15635,16450)L(10000000,200)" \
  -c:a eac3 -b:a 384k \
  output_hdr10.mp4

# HLG (Hybrid Log-Gamma)
ffmpeg -i input.mkv -c:v libx265 -preset slow -crf 22 \
  -pix_fmt yuv420p10le \
  -x265-params "hlg=1" \
  -c:a eac3 -b:a 384k \
  output_hlg.mp4
```

## Comparison: H.264 vs H.265

| Aspect | H.264 | H.265 |
|--------|-------|-------|
| Compression | Good | ~50% better |
| Encoding speed | Faster | Slower |
| Hardware support | Universal | Growing |
| Compatibility | Excellent | Good (modern devices) |
| 4K+ video | Possible | Ideal |
| Best use | General web, mobile | 4K/8K, bandwidth savings |
