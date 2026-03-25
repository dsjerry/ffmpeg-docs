# ffplay

`ffplay` 是一个基于 FFmpeg 库和 SDL 库的简单、跨平台媒体播放器。

## 概要

```
ffplay [options] [input_url]
```

## 基本用法

```bash
# 播放文件
ffplay input.mp4

# 播放 URL（流媒体）
ffplay rtmp://server/live/stream

# 指定窗口标题
ffplay -window_title "My Video" input.mp4
```

## 播放控制

| 按键 | 动作 |
|------|------|
| `q` / `ESC` | 退出 |
| `f` | 切换全屏 |
| `p` / `Space` | 暂停/恢复 |
| `m` | 切换静音 |
| `9` / `0` | 减小/增加音量 |
| `/` / `*` | 减小/增加音量 |
| `s` | 逐帧播放 |
| `左/右方向键` | 快退/快进 10 秒 |
| `上/下方向键` | 快进/快退 1 分钟 |
| `鼠标点击` | 跳转到指定位置 |

## 显示选项

```bash
# 原始分辨率（不缩放）
ffplay -nodisp input.mp4

# 仅音频播放
ffplay -novideo input.mp3

# 循环播放
ffplay -loop 3 input.mp4    # 循环 3 次
ffplay -loop 0 input.mp4    # 无限循环

# 从指定时间开始
ffplay -ss 01:30 input.mp4

# 播放指定时长
ffplay -t 60 input.mp4
```

## 音频可视化

```bash
# 显示音频波形
ffplay -showmode 1 input.mp3

# 显示音频频谱
ffplay -showmode 2 input.mp3
```

## 高级选项

```bash
# 同步到音频（默认）
ffplay -sync audio input.mp4

# 同步到视频
ffplay -sync video input.mp4

# 同步到外部时钟
ffplay -sync ext input.mp4

# 设置播放音量（0-100）
ffplay -volume 50 input.mp4

# 设置视频流索引
ffplay -ast 1 input.mp4

# 设置音频流索引
ffplay -vst 0 input.mp4

# 缓冲区大小（用于网络流）
ffplay -buffersize 5000 input.mp4
```

## 常用场景

```bash
# 编码前快速预览
ffplay -nodisp -autoexit input.mkv

# 测试音频标准化
ffplay -af "loudnorm=I=-16:TP=-1.5:LRA=11" input.wav

# 低延迟观看流
ffplay -fflags nobuffer -flags low_delay rtmp://server/live

# 逐帧播放（无音频）
ffplay -nodisp -loop 0 input.mp4
```
