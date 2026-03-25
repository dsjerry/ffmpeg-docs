# ffprobe

`ffprobe` 用于分析多媒体文件和流，提取时长、编码器、码率、章节等信息，不会修改文件。

## 概要

```
ffprobe [options] [input_url]
```

## 基本用法

```bash
# 打印所有信息（默认人类可读格式）
ffprobe input.mp4

# 隐藏横幅
ffprobe -hide_banner input.mp4

# 仅显示错误
ffprobe -v error input.mp4
```

## 选择器

### 流选择器

```bash
# 仅选择视频流
ffprobe -v error -show_streams -select_streams v input.mp4

# 仅选择音频流
ffprobe -v error -show_streams -select_streams a input.mp4

# 指定流索引
ffprobe -v error -select_streams a:1 input.mp4
```

### 格式选择器

```bash
# 仅显示格式信息
ffprobe -v error -show_format input.mp4
```

## Show Entries

提取特定字段：

```bash
# 时长
ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 input.mp4
# 输出: 125.678000

# 码率
ffprobe -v error -show_entries format=bit_rate -of default=noprint_wrappers=1:nokey=1 input.mp4

# 视频编码器
ffprobe -v error -select_streams v:0 -show_entries stream=codec_name -of default=noprint_wrappers=1:nokey=1 input.mp4
# 输出: h264

# 分辨率
ffprobe -v error -select_streams v:0 -show_entries stream=width,height -of csv=p=0 input.mp4
# 输出: 1920,1080

# 帧率
ffprobe -v error -select_streams v:0 -show_entries stream=r_frame_rate -of default=noprint_wrappers=1:nokey=1 input.mp4
# 输出: 30/1
```

## 输出格式

```bash
# 默认（人类可读）
ffprobe input.mp4

# 紧凑格式（key=value）
ffprobe -of compact input.mp4

# CSV
ffprobe -of csv input.mp4

# INI
ffprobe -of ini input.mp4

# JSON（脚本最有用）
ffprobe -v error -show_format -show_streams -of json input.mp4

# XML
ffprobe -v error -show_format -show_streams -of xml input.mp4
```

## 实用示例

### 获取视频时长（秒）
```bash
ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 input.mp4
```

### 检查是否有音频
```bash
ffprobe -v error -select_streams a -show_entries stream=codec_type -of csv=p=0 input.mp4
```

### 列出所有流
```bash
ffprobe -v error -show_streams -of json input.mkv
```

### 查找特定编码器信息
```bash
ffprobe -v error -select_streams v:0 -show_entries stream=codec_name,profile,level,width,height,pix_fmt -of json input.mp4
```

### 统计帧数
```bash
ffprobe -v error -select_streams v:0 -count_frames -show_entries stream=nb_read_frames -of default=noprint_wrappers=1:nokey=1 input.mp4
```
