# 音频处理

FFmpeg 通过 `-af`（音频滤镜）选项和编码器特定参数提供全面的音频处理能力。

## 提取与转换音频

```bash
# 提取音轨（直接复制）
ffmpeg -i input.mp4 -vn -c:a copy audio.m4a

# 提取并转换为 MP3
ffmpeg -i input.mp4 -vn -c:a libmp3lame -b:a 192k audio.mp3

# 提取并转换为 FLAC（无损）
ffmpeg -i input.mp4 -vn -c:a flac audio.flac

# 提取为 WAV
ffmpeg -i input.mp4 -vn -c:a pcm_s16le audio.wav
```

## 重采样

```bash
# 改变采样率为 48kHz
ffmpeg -i input.mp4 -vn -c:a aac -ar 48000 output.mp4

# 转换为单声道
ffmpeg -i input.mp4 -vn -c:a aac -ac 1 output_mono.mp4

# 转换为立体声
ffmpeg -i input.mp4 -vn -c:a aac -ac 2 output_stereo.mp4
```

## 音量与增益

```bash
# 增加音量 3dB
ffmpeg -i input.mp4 -af "volume=3dB" output.mp4

# 音量加倍
ffmpeg -i input.mp4 -af "volume=2" output.mp4

# 音量减半
ffmpeg -i input.mp4 -af "volume=0.5" output.mp4

# 标准化到 -3dB
ffmpeg -i input.mp4 -af "volume=-3dB" output.mp4
```

## 响度标准化

对于播客和音乐，确保音量一致至关重要：

```bash
# 先测量响度（两遍以获得最佳效果）
ffmpeg -i input.wav -af loudnorm=I=-16:TP=-1.5:LRA=11:print_format=summary -f null -

# 应用标准化（单遍）
ffmpeg -i input.wav -af "loudnorm=I=-16:TP=-1.5:LRA=11" output.wav

# 真正的两遍标准化
ffmpeg -i input.wav -af loudnorm=I=-16:TP=-1.5:LRA=11:print_format=json -f null -
#（在第二遍中使用输出的值）
ffmpeg -i input.wav -af "loudnorm=I=-16:TP=-1.5:LRA=11:measured_I=-20:measured_TP=-2.5:measured_LRA=8:measured_thresh=-22" output.wav
```

## 音频滤镜

```bash
# 淡入（前 2 秒）+ 淡出（后 3 秒）
ffmpeg -i input.mp3 -af "afade=t=in:ss=0:d=2,afade=t=out:st=57:d=3" output.mp3

# 高通滤波（去除 80Hz 以下的低频）
ffmpeg -i input.mp4 -af "highpass=f=80" -c:a aac output.mp4

# 低通滤波（去除 10kHz 以上的高频）
ffmpeg -i input.mp4 -af "lowpass=f=10000" -c:a aac output.mp4

# 均衡器（在 100Hz 增强低音 6dB）
ffmpeg -i input.mp3 -af "equalizer=f=100:width_type=h:width=200:g=6" output.mp3

# 压缩（减少动态范围）
ffmpeg -i input.mp3 -af "acompressor=threshold=-20dB:ratio=4:attack=5:release=50" output.mp3

# 混响
ffmpeg -i input.mp3 -af "aecho=0.8:0.9:1000:0.3" output.mp3
```

## 混音音频流

```bash
# 以等音量混合两个音轨
ffmpeg -i video.mp4 -i audio1.mp3 -i audio2.mp3 \
  -filter_complex "[1:a][2:a]amix=inputs=2:duration=longest[aout]" \
  -map 0:v -map "[aout]" \
  -c:v copy output.mp4

# 以不同音量混合
ffmpeg -i video.mp4 -i audio1.mp3 -i audio2.mp3 \
  -filter_complex "[1:a]volume=0.7[bg];[2:a]volume=1.3[fg];[bg][fg]amix=inputs=2[aout]" \
  -map 0:v -map "[aout]" \
  -c:v copy output.mp4
```

## 延迟 / 偏移音频

```bash
# 音频延迟 1 秒
ffmpeg -i input.mp4 -itsoffset 1 -i input.mp4 \
  -map 0:v -map 1:a \
  -c:v copy -c:a aac output_delayed.mp4
```

## 声道操作

```bash
# 5.1 环绕声转立体声
ffmpeg -i input_51.mp4 -af "pan=stereo|c0=c0|c1=c1" -c:a aac output_stereo.mp4

# 从立体声中提取左声道
ffmpeg -i input_stereo.mp3 -af "pan=mono|c0=c0" output_left.mp3

# 单声道复制为立体声
ffmpeg -i input_mono.mp3 -af "pan=stereo|c0=c0|c1=c0" output_stereo.mp3
```
