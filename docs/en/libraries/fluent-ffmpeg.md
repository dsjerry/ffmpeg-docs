# fluent-ffmpeg

`fluent-ffmpeg` is a Node.js library that provides a **fluent, chainable API** for constructing FFmpeg commands. It wraps the FFmpeg CLI rather than using the libraries directly.

## Installation

```bash
npm install fluent-ffmpeg
# or
yarn add fluent-ffmpeg
# or
bun add fluent-ffmpeg
```

::: warning Requirement
fluent-ffmpeg requires FFmpeg to be installed on your system. It communicates with the `ffmpeg` and `ffprobe` binaries via child processes.
:::

## Basic Usage

### Simple Conversion

```javascript
const ffmpeg = require('fluent-ffmpeg')

ffmpeg('/path/to/input.avi')
  .output('/path/to/output.mp4')
  .run()
```

### Chain Methods

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

## Events

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

## Video Processing

### Screenshot Generation

```javascript
// Generate 3 thumbnails
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

### Resize and Compress

```javascript
ffmpeg(inputPath)
  .size('1280x720')
  .outputOptions('-crf', '22')
  .outputOptions('-preset', 'medium')
  .output(outputPath)
  .on('end', () => console.log('Done'))
  .run()
```

### Watermark / Overlay

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

## Audio Processing

```javascript
// Extract audio
ffmpeg(inputPath)
  .noVideo()
  .audioCodec('libmp3lame')
  .audioBitrate('192k')
  .output(audioPath)
  .run()

// Normalize audio
ffmpeg(inputPath)
  .audioFilters('loudnorm=I=-16:TP=-1.5:LRA=11')
  .output(normalizedPath)
  .run()
```

## Stream Output (No File)

For live streaming or HTTP delivery:

```javascript
ffmpeg(inputPath)
  .format('flv')
  .outputOptions('-bufsize', '6000k')
  .outputOptions('-maxrate', '4500k')
  .output(
    require('stream').Readable.from([
      // pipe to HTTP response, etc.
    ])
  )
  .run()
```

### Express Server Example

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

## Concatenation & Merging

### Merge Two Videos

```javascript
ffmpeg()
  .input('intro.mp4')
  .input('main.mp4')
  .input('outro.mp4')
  .on('end', () => console.log('Merged'))
  .mergeToFile('merged.mp4')
```

### Concat with Filter

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

## Presets

```javascript
// Use built-in presets
ffmpeg(inputPath)
  .preset('flashvideo')
  .output(outputPath)
  .run()

// Available presets: 'flashvideo', 'podcast', 'DIVX format', 'MP4'
```

## Custom Options

```javascript
// Add any custom FFmpeg option
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

## Binary Path Configuration

```javascript
// When FFmpeg is not in PATH
ffmpeg.setFfmpegPath('/custom/path/to/ffmpeg')
ffmpeg.setFfprobePath('/custom/path/to/ffprobe')

// Or use environment variables
process.env.FFMPEG_PATH = '/custom/path/to/ffmpeg'
process.env.FFPROBE_PATH = '/custom/path/to/ffprobe'
```

## Metadata (ffprobe)

```javascript
const ffmpeg = require('fluent-ffmpeg')

// Get metadata
ffmpeg.ffprobe('/path/to/file.mp4', (err, metadata) => {
  if (err) return console.error(err)

  console.log('Duration:', metadata.format.duration)
  console.log('Bitrate:', metadata.format.bit_rate)

  metadata.streams.forEach((stream) => {
    console.log(`Stream #${stream.index}:`, stream.codec_type, stream.codec_name)
  })
})

// Async/await with promises (using util.promisify or callback-based wrapper)
const { promisify } = require('util')
const ffprobe = promisify(ffmpeg.ffprobe)
```
