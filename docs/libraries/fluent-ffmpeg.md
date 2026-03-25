# fluent-ffmpeg

`fluent-ffmpeg` 是一个 Node.js 库，提供**流畅的链式 API** 来构建 FFmpeg 命令。它封装了 FFmpeg CLI 而非直接使用库。

## 安装

```bash
npm install fluent-ffmpeg
# 或
yarn add fluent-ffmpeg
# 或
bun add fluent-ffmpeg
```

::: warning 要求
fluent-ffmpeg 需要系统中已安装 FFmpeg。它通过子进程与 `ffmpeg` 和 `ffprobe` 二进制文件通信。
:::

## 基本用法

### 简单转换

```javascript
const ffmpeg = require('fluent-ffmpeg')

ffmpeg('/path/to/input.avi')
  .output('/path/to/output.mp4')
  .run()
```

### 链式方法

```javascript
ffmpeg('/path/to/input.avi')
  .videoCodec('libx264')
  .audioCodec('aac')
  .audioBitrate('128k')
  .videoBitrate('1000k')
  .size('720x?')
  .output('/path/to/output.mp4')
  .on('end', () => console.log('Done!'))
  .on('error', (err) => console.error(err))
  .run()
```

## 事件

```javascript
ffmpeg(inputPath)
  .output(outputPath)
  .on('start', (cmd) => console.log('Running:', cmd))
  .on('stderr', (line) => console.log('FFmpeg:', line))
  .on('progress', (info) => {
    console.log(`Progress: ${info.percent}%`)
  })
  .on('end', () => console.log('Finished'))
  .on('error', (err, stdout, stderr) => {
    console.error('Error:', err.message)
    console.error('stdout:', stdout)
    console.error('stderr:', stderr)
  })
  .run()
```

## 视频处理

### 截图生成

```javascript
// 生成 3 个缩略图
ffmpeg(inputPath)
  .on('filenames', (filenames) => {
    console.log('Screenshots:', filenames)
  })
  .on('end', () => console.log('Screenshots saved'))
  .takeScreenshots({
    count: 3,
    timemarks: ['00:00:02.000', '50%', '00:00:10.000'],
    size: '320x240'
  }, '/thumbnail/folder/')
```

### 缩放和压缩

```javascript
ffmpeg(inputPath)
  .size('1280x720')
  .outputOptions('-crf', '22')
  .outputOptions('-preset', 'medium')
  .output(outputPath)
  .on('end', () => console.log('Done'))
  .run()
```

### 水印 / 叠加

```javascript
ffmpeg(inputPath)
  .input(watermarkPath)
  .complexFilter([
    '[1:v]scale=100:100[wm]',
    '[0:v][wm]overlay=W-w-10:10'
  ])
  .output(outputPath)
  .run()
```

## 音频处理

```javascript
// 提取音频
ffmpeg(inputPath)
  .noVideo()
  .audioCodec('libmp3lame')
  .audioBitrate('192k')
  .output(audioPath)
  .run()

// 音频标准化
ffmpeg(inputPath)
  .audioFilters('loudnorm=I=-16:TP=-1.5:LRA=11')
  .output(normalizedPath)
  .run()
```

## 流输出（无文件）

用于直播或 HTTP 传输：

```javascript
ffmpeg(inputPath)
  .format('flv')
  .outputOptions('-bufsize', '6000k')
  .outputOptions('-maxrate', '4500k')
  .output(
    require('stream').Readable.from([
      // pipe 到 HTTP 响应等
    ])
  )
  .run()
```

### Express 服务器示例

```javascript
const ffmpeg = require('fluent-ffmpeg')
const express = require('express')
const app = express()

app.get('/video/:id', (req, res) => {
  const proc = ffmpeg(`/videos/${req.params.id}.mp4`)
    .format('flv')
    .audioCodec('aac')
    .videoCodec('libx264')
    .outputOptions('-bufsize', '6000k')

  res.set({
    'Content-Type': 'video/x-flv',
    'Transfer-Encoding': 'chunked'
  })

  proc.pipe(res, { end: true })

  proc.on('end', () => console.log('Stream ended'))
  proc.on('error', (err) => {
    console.error(err)
    res.end()
  })
})

app.listen(3000)
```

## 合并与拼接

### 合并两个视频

```javascript
ffmpeg()
  .input('intro.mp4')
  .input('main.mp4')
  .input('outro.mp4')
  .on('end', () => console.log('Merged'))
  .mergeToFile('merged.mp4')
```

### 使用滤镜合并

```javascript
ffmpeg()
  .input('input1.mp4')
  .input('input2.mp4')
  .inputFormat('concat')
  .inputOptions('-safe', '0')
  .complexFilter('[0:v][0:a][1:v][1:a]concat=n=2:v=1:a=1[outv][outa]')
  .outputOptions('-map', '[outv]')
  .outputOptions('-map', '[outa]')
  .output('merged.mp4')
  .run()
```

## 预设

```javascript
// 使用内置预设
ffmpeg(inputPath)
  .preset('flashvideo')
  .output(outputPath)
  .run()

// 可用预设：'flashvideo', 'podcast', 'DIVX format', 'MP4'
```

## 自定义选项

```javascript
// 添加任意自定义 FFmpeg 选项
ffmpeg(inputPath)
  .outputOptions(
    '-movflags', '+faststart',
    '-preset', 'medium',
    '-crf', '22',
    '-profile:v', 'high'
  )
  .output(outputPath)
  .run()
```

## 二进制路径配置

```javascript
// FFmpeg 不在 PATH 中时
ffmpeg.setFfmpegPath('/custom/path/to/ffmpeg')
ffmpeg.setFfprobePath('/custom/path/to/ffprobe')

// 或使用环境变量
process.env.FFMPEG_PATH = '/custom/path/to/ffmpeg'
process.env.FFPROBE_PATH = '/custom/path/to/ffprobe'
```

## 元数据（ffprobe）

```javascript
const ffmpeg = require('fluent-ffmpeg')

// 获取元数据
ffmpeg.ffprobe('/path/to/file.mp4', (err, metadata) => {
  if (err) return console.error(err)

  console.log('Duration:', metadata.format.duration)
  console.log('Bitrate:', metadata.format.bit_rate)

  metadata.streams.forEach((stream) => {
    console.log(`Stream #${stream.index}:`, stream.codec_type, stream.codec_name)
  })
})

// 使用 promisify 实现 async/await
const { promisify } = require('util')
const ffprobe = promisify(ffmpeg.ffprobe)
```
