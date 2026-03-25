# 音频滤镜

FFmpeg 的音频滤镜系统（`-af`）处理所有音频转换——从简单的音量调整到复杂的多频段处理。

## 音量与增益

```bash
# 调整音量（dB）
ffmpeg -i input.mp4 -af "volume=3dB" output.mp4

# 音量加倍
ffmpeg -i input.mp4 -af "volume=2" output.mp4

# 减半音量
ffmpeg -i input.mp4 -af "volume=0.5" output.mp4

# 静音前 5 秒
ffmpeg -i input.mp4 -af "adelay=5000|5000" -c:a aac output.mp4
```

## 标准化

```bash
# 响度标准化（EBU R128）
ffmpeg -i input.wav -af "loudnorm=I=-16:TP=-1.5:LRA=11" output.wav

# EBU R128 响度标准化（两遍）
ffmpeg -i input.wav -af loudnorm=I=-16:TP=-1.5:LRA=11:print_format=json -f null -
#（在第二遍中使用输出的值）
ffmpeg -i input.wav -af "loudnorm=I=-16:TP=-1.5:LRA=11:measured_I=-20:measured_TP=-2:measured_LRA=8" output.wav
```

## 声道操作

```bash
# 转换为单声道
ffmpeg -i input.mp4 -af "pan=mono|c0=c0" output_mono.mp4

# 转换为立体声
ffmpeg -i input.mp4 -af "pan=stereo|c0=c1|c1=c0" output_stereo.mp4

# 5.1 转立体声下混
ffmpeg -i input_51.mp4 -af "pan=stereo|c0=c0+c2|c1=c1+c3" output_stereo.mp4

# 提取左声道
ffmpeg -i input.mp4 -af "pan=mono|c0=c0" output_left.mp4

# 提取右声道
ffmpeg -i input.mp4 -af "pan=mono|c0=c1" output_right.mp4
```

## 频率滤镜

```bash
# 高通滤波（去除 80Hz 以下的低频）
ffmpeg -i input.mp4 -af "highpass=f=80" output.mp4

# 低通滤波（去除 10kHz 以上的高频）
ffmpeg -i input.mp4 -af "lowpass=f=10000" output.mp4

# 带通滤波（仅保留 300Hz-3000Hz）
ffmpeg -i input.mp4 -af "bandpass=f=1000:t=o:width=0.5" output.mp4
```

## 均衡器

```bash
# 低音增强（100Hz +6dB）
ffmpeg -i input.mp3 -af "equalizer=f=100:width_type=h:width=200:g=6" output.mp3

# 高音增强（8kHz +4dB）
ffmpeg -i input.mp3 -af "equalizer=f=8000:width_type=h:width=2000:g=4" output.mp3

# 参数化均衡器（完全控制）
ffmpeg -i input.mp3 -af "equalizer=f=1000:t=h:width=0.5:g=-3" output.mp3
```

## 效果

```bash
# 淡入（前 2 秒）
ffmpeg -i input.mp3 -af "afade=t=in:ss=0:d=2" output.mp3

# 淡出（后 3 秒）
ffmpeg -i input.mp3 -af "afade=t=out:st=57:d=3" output.mp3

# 回声/混响
ffmpeg -i input.mp3 -af "aecho=0.8:0.9:1000|500:0.3|0.2" output.mp3

# 合唱效果
ffmpeg -i input.mp3 -af "chorus=0.5:0.9:50|60|40:0.4|0.32|0.3:2|2.5|2:0.25|0.4|0.3|0.5|0.4" output.mp3

# 相位效果
ffmpeg -i input.mp3 -af "aphaser=type=tone:g=0.6" output.mp3

# 颤音
ffmpeg -i input.mp3 -af "tremolo=f=5:d=0.5" output.mp3
```

## 动态处理

```bash
# 压缩（减少动态范围）
ffmpeg -i input.mp3 -af "acompressor=threshold=-20dB:ratio=4:attack=5:release=50" output.mp3

# 限制器（防止削波）
ffmpeg -i input.mp3 -af "alimiter=limit=0.9:attack=5:release=50" output.mp3

# 噪声门（去除安静噪声）
ffmpeg -i input.mp4 -af "agate=threshold=-40dB:ratio=3" -c:a aac output.mp4

# 去咝声（减少齿音）
ffmpeg -i input.mp4 -af "aexciter=h=3:t=50:m=4" -c:a aac output.mp4
```

## 重采样

```bash
# 改变采样率为 48kHz
ffmpeg -i input.mp4 -af "aresample=48000" output.mp4

# 转换采样率和声道布局
ffmpeg -i input.mp4 -af "aresample=48000,pan=stereo|c0=c0|c1=c1" output.mp4
```

## 滤镜组合

```bash
# 链式多个滤镜
ffmpeg -i input.mp4 \
  -af "highpass=f=80,lowpass=f=10000,volume=2dB,aecho=0.8:0.9:500|250:0.3|0.1" \
  output.mp4

# 所有效果顺序应用
ffmpeg -i input.mp3 \
  -af "afade=t=in:d=2,equalizer=f=100:width_type=h:g=3,acompressor=threshold=-15:ratio=3,afade=t=out:st=58:d=2" \
  output_processed.mp3
```

## 双耳与空间音频

```bash
# 立体声转双耳（耳机用）
ffmpeg -i input.mp4 -af "sofalizer=sofa=/path/to/IRC_1002_C.wav" output.mp4

# 立体声加宽
ffmpeg -i input.mp3 -af "stereowiden=amount=0.5" output.mp3
```
