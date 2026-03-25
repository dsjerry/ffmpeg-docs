# Introduction

FFmpeg is the **most powerful open-source multimedia framework** for processing audio and video. It can decode, encode, transcode, mux, demux, stream, filter, and play virtually any media format.

## What is FFmpeg?

FFmpeg is a command-line tool that consists of:

| Tool | Purpose |
|------|---------|
| **ffmpeg** | Converts between formats, applies filters, and encodes media |
| **ffprobe** | Analyzes media files — streams, codecs, duration, bitrate |
| **ffplay** | A minimal media player based on SDL and FFmpeg libraries |
| **libavcodec** | The codec library powering all encoding/decoding |
| **libavformat** | Handles muxing/demuxing of container formats |

## Why Learn FFmpeg?

- **Universal support** — FFmpeg supports more formats and codecs than any other tool
- **Batch processing** — Automate video workflows at scale
- **Server-side** — Run in Docker, cloud functions, or edge nodes
- **Browser-side** — @ffmpeg/core brings FFmpeg to the web via WebAssembly
- **Free and open source** — No licensing costs, no vendor lock-in

## Tools Covered in This Guide

This site covers three main areas:

1. **FFmpeg Command Line** — Direct usage of `ffmpeg`, `ffprobe`, and `ffplay`
2. **fluent-ffmpeg** — Node.js wrapper library for building video processing applications
3. **@ffmpeg/core** — WebAssembly version for browser-based processing

## Quick Example

Convert a video to MP4 (H.264 + AAC):

```bash
ffmpeg -i input.avi -c:v libx264 -preset medium -crf 23 \
  -c:a aac -b:a 128k -movflags +faststart output.mp4
```

## Next Steps

Follow the sidebar to navigate through the guide, or start with [Installation](/en/guide/installation).
