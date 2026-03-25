# Batch Processing

Automate repetitive FFmpeg tasks across multiple files using shell scripts or Node.js.

## Shell Script — Basic

```bash
#!/bin/bash

# Convert all .avi files to .mp4
for f in *.avi; do
  ffmpeg -i "$f" -c:v libx264 -preset fast -crf 22 \
    -c:a aac -b:a 128k "${f%.avi}.mp4"
done
```

## Shell Script — With Subdirectories

```bash
#!/bin/bash

# Process all videos recursively
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

## Shell Script — Parallel Processing

```bash
#!/bin/bash

# Use GNU parallel for parallel processing
cat video_list.txt | parallel --progress \
  ffmpeg -i {} -c:v libx264 -preset fast -crf 22 \
    -c:a aac -b:a 128k {.}.mp4

# Or use xargs with parallelization
cat video_list.txt | xargs -P 4 -I {} \
  ffmpeg -i {} -c:v libx264 -preset fast -crf 22 \
    -c:a aac -b:a 128k {.}.mp4
```

## Node.js — Using fluent-ffmpeg

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
      console.log(`\nDone: ${file} (${completed}/${files.length})`)
    })
    .on('error', (err) => {
      console.error(`Error processing ${file}:`, err.message)
    })
    .run()
})
```

## Node.js — Using Async/Await

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

  console.log(`Converting: ${inputFile}`)
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
      console.error(`Failed: ${file}`, err.message)
    }
  }
}

processAll('./videos')
```

## Python — Using subprocess

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

    print(f'Processing: {name}')
    subprocess.run(cmd, check=True)
```

## Watermark Batch

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

## Transcode to Multiple Resolutions

```bash
#!/bin/bash

INPUT="$1"
NAME="${INPUT%.*}"

ffmpeg -i "$INPUT" \
  -vf "scale=1920:-2" -c:v libx264 -preset fast -crf 22 -c:a aac -b:a 192k "${NAME}_1080p.mp4" \
  -vf "scale=1280:-2" -c:v libx264 -preset fast -crf 22 -c:a aac -b:a 128k "${NAME}_720p.mp4" \
  -vf "scale=854:-2"  -c:v libx264 -preset fast -crf 24 -c:a aac -b:a 96k  "${NAME}_480p.mp4"
```

## Progress Tracking

```bash
#!/bin/bash

TOTAL=$(ls *.mp4 | wc -l)
CURRENT=0

for f in *.mp4; do
  CURRENT=$((CURRENT + 1))
  echo "[$CURRENT/$TOTAL] Processing $f"

  ffmpeg -i "$f" -c:v libx264 -preset fast -crf 22 \
    -c:a aac -b:a 128k "${f%.mp4}_converted.mp4" \
    -progress "progress_$f.txt"

  echo "Done: $f"
done

echo "All files processed!"
```

## Conditional Processing (Skip If Exists)

```bash
#!/bin/bash

for f in *.mp4; do
  if [ -f "output_$f" ]; then
    echo "Skipping $f (already exists)"
  else
    echo "Converting $f"
    ffmpeg -i "$f" -c:v libx264 -preset fast -crf 22 \
      -c:a aac -b:a 128k "output_$f"
  fi
done
```
