# 基本概念

## 核心术语

### 编解码器（Codec）

**编解码器**是一种压缩和解压音频或视频数据的算法。

| 类别 | 编码器 |
|------|--------|
| 视频 | H.264、H.265/HEVC、VP8、VP9、AV1、ProRes、DNxHD |
| 音频 | AAC、MP3、Opus、FLAC、AC3、PCM |

### 容器格式

**容器**存放编码后的音视频数据以及元数据、字幕、章节信息等。

常见容器：**MP4**、**MKV**、**MOV**、**WebM**、**AVI**、**TS**、**MPEG**

### 码率（Bitrate）

单位时间内处理的数据量。码率越高 = 质量越好 = 文件越大。

- **CBR**（固定码率）— 全程固定速率
- **VBR**（可变码率）— 根据内容复杂度自适应质量
- **CRF**（恒定质量因子）— 基于质量的编码（FFmpeg 特有）

### 帧率

每秒帧数（fps）。常见值：24、25、30、60。

## 理解 FFmpeg 命令结构

核心规则：**选项作用于紧跟其后的输入或输出文件。**

```
ffmpeg [全局选项] [输入选项] -i 输入文件 [输出选项] 输出文件
```

```bash
ffmpeg -hide_banner          # 全局：隐藏启动横幅
     -y                      # 全局：直接覆盖输出文件
     -i input.mkv            # 输入文件
     -c:v libx264            # 输出视频编码器
     -preset fast            # 输出视频选项
     -crf 22                 # 输出视频选项
     -c:a aac                # 输出音频编码器
     -b:a 192k               # 输出音频选项
     output.mp4               # 输出文件
```

## 流选择

FFmpeg 独立处理各个流（视频、音频、字幕轨道）。

```bash
# 复制视频流，重新编码音频
ffmpeg -i input.mkv -c:v copy -c:a aac output.mp4

# 仅提取第一个视频流
ffmpeg -i input.mkv -map 0:v:0 -c copy output.mp4

# 提取视频 + 第二个音轨
ffmpeg -i input.mkv -map 0:v:0 -map 0:a:1 -c copy output.mkv
```

## 两遍编码

对于目标码率的最佳质量，使用两遍编码：

```bash
# 第一遍：分析
ffmpeg -i input.mp4 -c:v libx264 -preset slow -bitrate 5M \
  -pass 1 -f rawvideo -y /dev/null

# 第二遍：编码
ffmpeg -i input.mp4 -c:v libx264 -preset slow -bitrate 5M \
  -pass 2 output.mp4
```

## 核心概念总结

| 概念 | 描述 |
|------|------|
| 编解码器 | 压缩/解压缩算法 |
| 容器 | 承载流和元数据的文件格式 |
| 码率 | 数据速率（质量与文件大小权衡） |
| 帧率 | 每秒帧数 |
| CRF | FFmpeg 基于质量的编码（0=无损，23=默认，51=最差） |
| Preset | 编码速度与压缩率的权衡（ultrafast → veryslow） |
| 滤镜 | 编码过程中应用的音视频转换 |
| 流 | 容器中的独立视频/音频/字幕轨道 |
