# 批量处理

使用 Shell 脚本或 Node.js 自动执行跨多个文件的重复 FFmpeg 任务。

## Shell 脚本 —— 基础

```bash
#!/bin/bash

# 转换所有 .avi 文件为 .mp4
for f in *.avi; do
  ffmpeg -i "$f" -c:v libx264 -preset fast -crf 22 \
    -c:a aac -b:a 128k "${f%.avi}.mp4"
done
```

## Shell 脚本 —— 含子目录

```bash
#!/bin/bash

# 递归处理所有视频
find . -type f \( -name "*.mp4" -o -name "*.avi" -o -name "*.mkv" \) | while read -r file; do
  dir=$(dirname "$file")
  name=$(basename "$file")
  ffmpeg -i "$file" \
    -c:v libx264 -preset fast -crf 22 \
    -c:a aac -b:a 128k \
    -movflags +faststart \
    "$dir/converted_$name"
done
```

## Shell 脚本 —— 并行处理

```bash
#!/bin/bash

# 使用 GNU parallel 进行并行处理
cat video_list.txt | parallel --progress \
  ffmpeg -i {} -c:v libx264 -preset fast -crf 22 \
    -c:a aac -b:a 128k {.}.mp4

# 或使用 xargs 并行化
cat video_list.txt | xargs -P 4 -I {} \
  ffmpeg -i {} -c:v libx264 -preset fast -crf 22 \
    -c:a aac -b:a 128k {.}.mp4
```

## Node.js —— 使用 fluent-ffmpeg

```javascript
const ffmpeg = require('fluent-ffmpeg')
const path = require('path')
const fs = require('fs')

const inputDir = './videos'
const outputDir = './output'

if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir)

const files = fs.readdirSync(inputDir)
  .filter(f => /\.(mp4|avi|mkv)$/i.test(f))

let completed = 0

files.forEach(file => {
  const inputPath = path.join(inputDir, file)
  const outputPath = path.join(outputDir, file.replace(/\.[^.]+$/, '.mp4'))

  ffmpeg(inputPath)
    .videoCodec('libx264')
    .audioCodec('aac')
    .size('720x?')
    .outputOptions('-crf', '22')
    .outputOptions('-preset', 'fast')
    .outputOptions('-movflags', '+faststart')
    .output(outputPath)
    .on('progress', (info) => {
      process.stdout.write(`\r${file}: ${info.percent}%`)
    })
    .on('end', () => {
      completed++
      console.log(`\n完成: ${file} (${completed}/${files.length})`)
    })
    .on('error', (err) => {
      console.error(`处理 ${file} 时出错:`, err.message)
    })
    .run()
})
```

## Node.js —— 使用 Async/Await

```javascript
const { exec } = require('child_process')
const { promisify } = require('util')
const execAsync = promisify(exec)
const path = require('path')

async function convertToMp4(inputFile, options = {}) {
  const {
    crf = '22',
    preset = 'fast',
    resolution = '720x?',
    bitrate = '128k'
  } = options

  const outputFile = inputFile.replace(/\.[^.]+$/, '.mp4')
  const cmd = [
    'ffmpeg', '-i', `"${inputFile}"`,
    '-c:v', 'libx264', '-preset', preset, '-crf', crf,
    '-c:a', 'aac', '-b:a', bitrate,
    '-vf', `scale=${resolution}`,
    '-movflags', '+faststart',
    `"${outputFile}"`
  ].join(' ')

  console.log(`正在转换: ${inputFile}`)
  await execAsync(cmd)
  return outputFile
}

async function processAll(dir) {
  const files = require('fs').readdirSync(dir)
    .filter(f => /\.(mp4|avi|mkv)$/i.test(f))

  for (const file of files) {
    try {
      await convertToMp4(path.join(dir, file))
    } catch (err) {
      console.error(`失败: ${file}`, err.message)
    }
  }
}

processAll('./videos')
```

## Python —— 使用 subprocess

```python
import subprocess
import os
from glob import glob

input_files = glob('videos/*.*')
for filepath in input_files:
    name, ext = os.path.splitext(os.path.basename(filepath))
    output = os.path.join('output', f'{name}.mp4')

    cmd = [
        'ffmpeg', '-i', filepath,
        '-c:v', 'libx264', '-preset', 'fast', '-crf', '22',
        '-c:a', 'aac', '-b:a', '128k',
        '-movflags', '+faststart',
        output
    ]

    print(f'正在处理: {name}')
    subprocess.run(cmd, check=True)
```

## 批量添加水印

```bash
#!/bin/bash

for f in *.mp4; do
  ffmpeg -i "$f" -i logo.png \
    -filter_complex "overlay=W-w-10:10" \
    -c:a copy \
    -movflags +faststart \
    "watermarked_$f"
done
```

## 多分辨率转码

```bash
#!/bin/bash

INPUT="$1"
NAME="${INPUT%.*}"

ffmpeg -i "$INPUT" \
  -vf "scale=1920:-2" -c:v libx264 -preset fast -crf 22 -c:a aac -b:a 192k "${NAME}_1080p.mp4" \
  -vf "scale=1280:-2" -c:v libx264 -preset fast -crf 22 -c:a aac -b:a 128k "${NAME}_720p.mp4" \
  -vf "scale=854:-2"  -c:v libx264 -preset fast -crf 24 -c:a aac -b:a 96k  "${NAME}_480p.mp4"
```

## 进度跟踪

```bash
#!/bin/bash

TOTAL=$(ls *.mp4 | wc -l)
CURRENT=0

for f in *.mp4; do
  CURRENT=$((CURRENT + 1))
  echo "[$CURRENT/$TOTAL] 正在处理 $f"

  ffmpeg -i "$f" -c:v libx264 -preset fast -crf 22 \
    -c:a aac -b:a 128k "${f%.mp4}_converted.mp4" \
    -progress "progress_$f.txt"

  echo "完成: $f"
done

echo "所有文件处理完毕！"
```

## 条件处理（如果存在则跳过）

```bash
#!/bin/bash

for f in *.mp4; do
  if [ -f "output_$f" ]; then
    echo "跳过 $f（已存在）"
  else
    echo "正在转换 $f"
    ffmpeg -i "$f" -c:v libx264 -preset fast -crf 22 \
      -c:a aac -b:a 128k "output_$f"
  fi
done
```
