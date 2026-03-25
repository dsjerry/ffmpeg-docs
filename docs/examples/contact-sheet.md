# 联系单（缩略图网格）

联系单（也称为缩略图网格或胶片条）从视频中生成一张包含多个帧的图像 —— 用于预览视频内容非常有用。

## 基本联系单

```bash
ffmpeg -i input.mp4 -vf "fps=1/10,scale=320:-1,tile=4x4" -frames:v 1 sheet.png
```

这会每 10 秒生成一张图片（`fps=1/10`），将每帧缩放到 320px 宽，并排列成 4x4 网格。

## 参数说明

| 参数 | 描述 |
|------|------|
| `fps=1/n` | 每隔 `n` 秒一帧 |
| `scale=w:-1` | 将每个缩略图缩放到宽度 `w` |
| `tile=MxN` | 排列成 M 列 N 行 |

## 常见网格尺寸

```bash
# 3x3 网格（9 张缩略图）
ffmpeg -i input.mp4 -vf "fps=1/10,scale=320:-1,tile=3x3" -frames:v 1 sheet_3x3.png

# 5x5 网格（25 张缩略图）
ffmpeg -i input.mp4 -vf "fps=1/10,scale=240:-1,tile=5x5" -frames:v 1 sheet_5x5.png

# 6x4 网格（24 张缩略图）
ffmpeg -i input.mp4 -vf "fps=1/15,scale=320:-1,tile=6x4" -frames:v 1 sheet_6x4.png
```

## 带标签（帧编号）

```bash
ffmpeg -i input.mp4 -vf "fps=1/10,scale=320:-1,tile=4x4:color=black@0.8:margin_w=4:margin_h=4,drawtext=text='%{n}':fontsize=16:fontcolor=white:x=(w-text_w)/2:y=h-text_h-4" \
  -frames:v 1 sheet_labeled.png
```

## 胶片条风格（单行）

```bash
# 水平排列 10 帧
ffmpeg -i input.mp4 -vf "fps=1/5,scale=320:-1,tile=1x10:padding=4:color=black@0.5" \
  -frames:v 1 strip.png
```

## 自定义间距

```bash
ffmpeg -i input.mp4 \
  -vf "fps=1/10,scale=320:-1,tile=4x4:margin=8:padding=4:color=black@0.3" \
  -frames:v 1 sheet_padded.png
```

## 高清联系单

```bash
ffmpeg -i input.mp4 \
  -vf "fps=1/30,scale=640:-1,tile=8x6:color=black@0.5" \
  -frames:v 1 sheet_hd.png
```

## 按特定时间戳提取

```bash
# 在 0s、10s、20s、30s、40s、50s、60s、70s 处的缩略图
ffmpeg -i input.mp4 \
  -vf "select=eq(n\,0)+eq(n\,100)+eq(n\,200)+eq(n\,300)+eq(n\,400)+eq(n\,500)+eq(n\,600)+eq(n\,700),scale=320:-1,tile=4x2" \
  -frames:v 1 sheet_custom.png
```

或使用场景检测：

```bash
ffmpeg -i input.mp4 \
  -vf "select='gt(scene,0.3)',scale=320:-1,tile=4x3" \
  -frames:v 1 sheet_scenes.png
```

## 批量生成

```bash
# 为文件夹中所有视频创建联系单
for f in *.mp4; do
  ffmpeg -i "$f" -vf "fps=1/10,scale=320:-1,tile=4x4" -frames:v 1 "sheet_${f%.mp4}.png"
done
```

## 高质量缩略图

```bash
ffmpeg -i input.mp4 \
  -vf "fps=1/10,scale=640:-2:flags=lanczos,tile=4x4:color=black@0.2" \
  -frames:v 1 \
  -q:v 1 \
  sheet_hq.png
```
