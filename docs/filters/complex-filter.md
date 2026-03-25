# 复杂滤镜链

对于涉及多输入、多输出或复杂信号路由的高级操作，使用 `-filter_complex`。

## 基本概念

- **滤镜图** — 有向的滤镜图
- **输入垫** — 滤镜输入（标记为 `[0:v]`、`[0:a]` 等）
- **输出垫** — 滤镜输出（标记为 `[out_v]`、`[out_a]`）
- **标签** — 中间流的用户定义名称

## 语法

```
ffmpeg -filter_complex "[input]filter[output]" [output options]
```

## 分割与叠加

```bash
# 画中画（小视频在角落）
ffmpeg -i main.mp4 -i overlay.mp4 -filter_complex \
  "[0:v][1:v]overlay=10:10[out]" \
  -map "[out]" -map 0:a output.mp4

# 并排（2 个视频）
ffmpeg -i left.mp4 -i right.mp4 -filter_complex \
  "[0:v][1:v]hstack[out]" \
  -map "[out]" -map 0:a output.mp4

# 网格布局（2x2）
ffmpeg -i top_left.mp4 -i top_right.mp4 -i bottom_left.mp4 -i bottom_right.mp4 \
  -filter_complex \
  "[0:v][1:v]hstack=inputs=2[top];[2:v][3:v]hstack=inputs=2[bottom];[top][bottom]vstack=inputs=2[out]" \
  -map "[out]" output_grid.mp4
```

## Alpha 通道处理

```bash
# 带 alpha 叠加
ffmpeg -i video.mp4 -i overlay.png -filter_complex \
  "[0:v]format=rgba,gtalpha=0[a];[1:v]format=rgba[ovr];[a][ovr]overlay=0:0[out]" \
  -map "[out]" output.mp4
```

## 音视频分离

```bash
# 分离并分别处理
ffmpeg -i input.mp4 -filter_complex \
  "[0:v]scale=1280:720[v];[0:a]volume=2[a]" \
  -map "[v]" -map "[a]" \
  -c:v libx264 -preset fast -c:a aac output.mp4

# 提取音频、处理后混合回来
ffmpeg -i input.mp4 -filter_complex \
  "[0:a]aecho=0.8:0.9:500|250:0.3|0.1[echo];[0:a][echo]amix=inputs=2:duration=longest[mixed]" \
  -map 0:v -map "[mixed]" \
  -c:v copy output.mp4
```

## 多视频拼接

```bash
# 带过渡的拼接（交叉淡入淡出）
ffmpeg -i 1.mp4 -i 2.mp4 -i 3.mp4 -filter_complex \
  "[0:v][1:v]xfade=transition=fade:duration=1:offset=4[v];[0:a][1:a]acrossfade=d=1[a]" \
  "[v][2:v]xfade=transition=fade:duration=1:offset=4[v2];[a][2:a]acrossfade=d=1[a2]" \
  -map "[v2]" -map "[a2]" output.mp4
```

## 时间轴编辑

```bash
# 启用时间轴编辑，在特定时间应用滤镜
ffmpeg -i input.mp4 -vf \
  "[0:v]split=2[v1][v2];[v1]negate[out1];[v2]hue=s=0[out2]" \
  -filter_complex "[0:v]split=2[1]enable='between(t,0,3)'[v1];[v1]negate[out]" \
  output.mp4
```

## 带分割的多遍处理

```bash
# 去块 + 锐化
ffmpeg -i input.mp4 -filter_complex \
  "[0:v]hqdn3d=4:3:4:3,unsharp=5:5:0.5[out]" \
  -map "[out]" -c:v libx264 -preset fast output_denoise_sharp.mp4
```

## Null/Sink（测量音频）

```bash
# 测量音频响度（不创建输出）
ffmpeg -i input.mp4 -af "volumedetect" -f null -

# 显示音频频谱
ffmpeg -i input.mp4 -af "showspectrum=mode=combined:color=rainbow:s=1280x720" \
  -c:v rawvideo -f rawvideo - | head -c 100000
```

## 带标签的滤镜链

```bash
# 带标签的复杂路由
ffmpeg -i input.mp4 -filter_complex \
  "[0:v]scale=1280:720[v720];[v720]setsar=1[v720s]" \
  -map "[v720s]" -map 0:a \
  -c:v libx264 -preset fast -c:a aac \
  output_720p.mp4
```

## 侧链（音频闪避）

```bash
# 当有人声时降低音乐音量（侧链压缩）
ffmpeg -i music.mp3 -i voiceover.mp3 -filter_complex \
  "[0:a][1:a]sidechcompress=threshold=-20dB:ratio=3:attack=5:release=50[ducked]" \
  -map "[ducked]" output_ducked.mp3
```

## 遮罩操作

```bash
# 仅对某区域应用滤镜（遮罩模糊）
ffmpeg -i input.mp4 -filter_complex \
  "[0:v]split=2[base][blurred];[blurred]boxblur=10[blur];[base][blur]overlay=200:200[out]" \
  -map "[out]" output.mp4
```
