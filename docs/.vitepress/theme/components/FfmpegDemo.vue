<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useData } from 'vitepress'
import coreURL from '@ffmpeg/core?url'
import wasmURL from '@ffmpeg/core/wasm?url'

const { lang } = useData()
const ffmpegRef = ref<any>(null)
const loaded = ref(false)
const loading = ref(false)
const progress = ref(0)
const logLines = ref<string[]>([])
const inputFile = ref<File | null>(null)
const outputUrl = ref<string | null>(null)
const selectedPreset = ref('gif')
const customArgs = ref('')
const errorMsg = ref('')
const isDragging = ref(false)
const converting = ref(false)

const isZh = computed(() => lang.value === 'zh-CN')

const presets = computed(() => [
  {
    id: 'gif',
    label: isZh.value ? '视频转 GIF' : 'Video to GIF',
    args: ['-i', 'input.mp4', '-vf', 'fps=15,scale=480:-1:flags=lanczos,split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse', '-loop', '0', 'output.gif'],
    description: isZh.value ? '高质量 GIF，低帧率' : 'High-quality GIF, low FPS'
  },
  {
    id: 'compress',
    label: isZh.value ? '压缩视频' : 'Compress Video',
    args: ['-i', 'input.mp4', '-c:v', 'libx264', '-preset', 'medium', '-crf', '28', '-c:a', 'aac', '-b:a', '128k', 'output.mp4'],
    description: isZh.value ? 'H.264 压缩，文件更小' : 'H.264 compression, smaller file'
  },
  {
    id: 'webm',
    label: isZh.value ? '转 WebM' : 'Convert to WebM',
    args: ['-i', 'input.mp4', '-c:v', 'libvpx-vp9', '-crf', '30', '-b:v', '0', '-c:a', 'libopus', '-b:a', '128k', 'output.webm'],
    description: isZh.value ? 'VP9 编码，Web 友好' : 'VP9 codec, web-friendly'
  },
  {
    id: 'resize',
    label: isZh.value ? '图片压缩' : 'Compress Image',
    args: ['-i', 'input.jpg', '-vf', 'scale=1200:-1', '-q:v', '80', 'output.jpg'],
    description: isZh.value ? '调整大小并压缩 JPG/PNG' : 'Resize and compress JPG/PNG'
  },
  {
    id: 'clip',
    label: isZh.value ? '裁剪片段' : 'Trim Clip',
    args: ['-i', 'input.mp4', '-ss', '00:00:05', '-t', '10', '-c:v', 'libx264', '-crf', '22', '-c:a', 'aac', 'clip.mp4'],
    description: isZh.value ? '从 5s 开始裁剪 10 秒' : 'Start at 5s, trim 10 seconds'
  },
  {
    id: 'custom',
    label: isZh.value ? '自定义命令' : 'Custom Command',
    args: customArgs.value.trim() ? customArgs.value.split(' ').filter(Boolean) : [],
    description: isZh.value ? '输入自定义 ffmpeg 参数' : 'Enter custom ffmpeg arguments'
  }
])

const selectedPresetData = computed(() => presets.value.find(p => p.id === selectedPreset.value) || presets.value[0])

let loadStarted = false

const load = async () => {
  if (loaded.value || loadStarted) return
  loadStarted = true
  loading.value = true
  logLines.value = []
  try {
    const { FFmpeg } = await import('@ffmpeg/ffmpeg')

    logLines.value.push(isZh.value ? '开始加载 FFmpeg 引擎...' : 'Loading FFmpeg engine...')

    const ffmpeg = new FFmpeg()
    ffmpegRef.value = ffmpeg

    ffmpeg.on('log', ({ message }: { message: string }) => {
      logLines.value.push(message)
      if (logLines.value.length > 50) logLines.value.shift()
    })

    ffmpeg.on('progress', ({ progress: p }: { progress: number }) => {
      progress.value = Math.round(p * 100)
    })

    logLines.value.push(isZh.value ? '正在加载 WASM 文件...' : 'Loading WASM files...')

    const loadPromise = ffmpeg.load({ coreURL, wasmURL })
    const timeout = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('WASM load timeout (>60s). Check COOP/COEP headers or network.')), 60000)
    )

    await Promise.race([loadPromise, timeout])

    loaded.value = true
    loadStarted = false
    logLines.value.push(isZh.value ? 'FFmpeg WASM 加载成功！' : 'FFmpeg WASM loaded successfully!')
  } catch (e: any) {
    loadStarted = false
    logLines.value.push(`Error: ${e.message}`)
    errorMsg.value = e.message
  } finally {
    loading.value = false
  }
}

const run = async () => {
  if (!ffmpegRef.value || !inputFile.value) {
    errorMsg.value = isZh.value ? '请先选择一个视频文件' : 'Please select a video file first'
    return
  }

  errorMsg.value = ''
  outputUrl.value = null
  progress.value = 0
  logLines.value = []
  converting.value = true

  try {
    const ffmpeg = ffmpegRef.value
    const { fetchFile } = await import('@ffmpeg/util')
    const args = selectedPreset.value === 'custom'
      ? customArgs.value.split(' ').filter(Boolean)
      : selectedPresetData.value.args

    if (!loaded.value) await load()

    const ext = inputFile.value!.name.split('.').pop() || 'mp4'
    const inputName = `input.${ext}`
    // 动态替换 args 中的输入文件名（如 input.mp4 → input.png）
    const resolvedArgs = args.map((arg: string) => arg.replace(/^input\.\w+$/, inputName))
    logLines.value.push(`[1] Writing input file (${(inputFile.value!.size / 1024 / 1024).toFixed(2)} MB)...`)
    await ffmpeg.writeFile(inputName, await fetchFile(inputFile.value))
    logLines.value.push('[2] File written, starting ffmpeg.exec()...')

    await ffmpeg.exec(resolvedArgs)
    logLines.value.push('[3] ffmpeg.exec() finished, reading output...')

    const outputExt = selectedPreset.value === 'gif' ? 'output.gif'
      : selectedPreset.value === 'webm' ? 'output.webm'
      : selectedPreset.value === 'clip' ? 'clip.mp4'
      : selectedPreset.value === 'resize' ? 'output.jpg'
      : 'output.mp4'

    const data = await ffmpeg.readFile(outputExt)
    const mime = selectedPreset.value === 'gif' ? 'image/gif'
      : selectedPreset.value === 'resize' ? 'image/jpeg'
      : selectedPreset.value === 'webm' ? 'video/webm'
      : 'video/mp4'

    outputUrl.value = URL.createObjectURL(new Blob([data.buffer], { type: mime }))
    logLines.value.push(`[4] Done! Output size: ${(data.byteLength / 1024 / 1024).toFixed(2)} MB`)

    logLines.value.push(isZh.value ? '转换完成！' : 'Conversion complete!')
  } catch (e: any) {
    logLines.value.push(`Error: ${e.message}`)
    errorMsg.value = e.message
  } finally {
    converting.value = false
  }
}

const handleFile = (e: Event) => {
  const target = e.target as HTMLInputElement
  if (target.files?.length) inputFile.value = target.files[0]
}

const handleDrop = (e: DragEvent) => {
  isDragging.value = false
  if (e.dataTransfer?.files?.length) inputFile.value = e.dataTransfer.files[0]
}

onMounted(() => {
  load()
})
</script>

<template>
  <div class="ffmpeg-demo">
    <div class="demo-header">
      <h3>{{ isZh ? 'FFmpeg WASM 交互演示' : 'FFmpeg WASM Interactive Demo' }}</h3>
      <p class="demo-desc">
        {{ isZh ? '在浏览器中直接运行 FFmpeg，无需服务器。' : 'Run FFmpeg directly in your browser, no server needed.' }}
      </p>
    </div>

    <div v-if="!loaded && !loading" class="load-hint">
      <span>{{ isZh ? '点击下方按钮加载 FFmpeg 引擎（约 25MB）...' : 'Click to load FFmpeg engine (~25MB)...' }}</span>
      <button class="btn-primary" @click="load" :disabled="loading">
        {{ loading ? (isZh ? '加载中...' : 'Loading...') : (isZh ? '加载 FFmpeg' : 'Load FFmpeg') }}
      </button>
    </div>

    <div v-if="loading" class="loading-bar">
      <div class="loading-text">{{ isZh ? '正在下载并初始化 FFmpeg WASM...' : 'Downloading and initializing FFmpeg WASM...' }}</div>
    </div>

    <div v-if="loaded" class="demo-body">
      <!-- File Input -->
      <div class="file-zone"
        :class="{ dragging: isDragging }"
        @dragover.prevent="isDragging = true"
        @dragleave="isDragging = false"
        @drop.prevent="handleDrop">
        <input type="file" accept="video/*,image/jpeg,image/png,image/webp" @change="handleFile" id="ffmpeg-file-input" />
        <label for="ffmpeg-file-input" class="file-label">
          <span v-if="!inputFile">{{ isZh ? '选择视频或图片文件' : 'Select video or image file' }}</span>
          <span v-else class="file-name">{{ inputFile.name }}</span>
        </label>
      </div>

      <!-- Preset Selection -->
      <div class="presets">
        <div class="preset-tabs">
          <button
            v-for="p in presets"
            :key="p.id"
            class="preset-tab"
            :class="{ active: selectedPreset === p.id }"
            @click="selectedPreset = p.id">
            {{ p.label }}
          </button>
        </div>
        <p class="preset-desc">{{ selectedPresetData.description }}</p>
        <p v-if="selectedPreset === 'custom'" class="preset-hint">
          {{ isZh ? '参数格式：以空格分隔，例如：-i input -c:v libx264 output.mp4' : 'Args format: space-separated, e.g.: -i input -c:v libx264 output.mp4' }}
        </p>
        <textarea
          v-if="selectedPreset === 'custom'"
          v-model="customArgs"
          class="args-input"
          :placeholder="isZh ? '输入自定义命令参数...' : 'Enter custom command args...'"
          rows="2" />
        <div v-else class="args-preview">
          <code>{{ selectedPresetData.args.join(' ') }}</code>
        </div>
      </div>

      <!-- Run Button -->
      <button class="btn-primary btn-run" @click="run" :disabled="!inputFile || !loaded || converting">
        {{ converting ? (isZh ? '转换中...' : 'Converting...') : (isZh ? '运行转换' : 'Run Conversion') }}
      </button>

      <!-- Progress -->
      <div v-if="progress > 0" class="progress-bar">
        <div class="progress-fill" :style="{ width: progress + '%' }" />
        <span class="progress-text">{{ progress }}%</span>
      </div>

      <!-- Output -->
      <div v-if="outputUrl" class="output-section">
        <h4>{{ isZh ? '输出预览' : 'Output Preview' }}</h4>
        <img v-if="selectedPreset === 'gif' || selectedPreset === 'resize'" :src="outputUrl" class="output-gif" alt="output" />
        <video v-else :src="outputUrl" controls class="output-video" />
        <a :href="outputUrl" :download="selectedPreset + '-output'" class="btn-download">
          {{ isZh ? '下载结果' : 'Download Result' }}
        </a>
      </div>

      <!-- Error -->
      <div v-if="errorMsg" class="error-msg">
        <strong>{{ isZh ? '错误：' : 'Error: ' }}</strong>{{ errorMsg }}
      </div>
    </div>

    <!-- Log -->
    <div v-if="logLines.length" class="log-section">
      <h4>{{ isZh ? '日志' : 'Log' }}</h4>
      <pre class="log-pre"><code v-for="(line, i) in logLines" :key="i">{{ line }}
</code></pre>
    </div>
  </div>
</template>

<style scoped>
.ffmpeg-demo {
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  padding: 1.5rem;
  margin: 2rem 0;
  background: var(--vp-c-bg-soft);
}

.demo-header h3 {
  margin: 0 0 0.4rem;
  color: var(--vp-c-brand-1);
  font-size: 1.1rem;
}

.demo-desc {
  margin: 0 0 1rem;
  color: var(--vp-c-text-2);
  font-size: 0.9rem;
}

.load-hint {
  display: flex;
  align-items: center;
  gap: 1rem;
  color: var(--vp-c-text-2);
  font-size: 0.9rem;
}

.btn-primary {
  background: var(--vp-c-brand-1);
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 0.5rem 1.2rem;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.9rem;
  transition: background 0.2s;
}

.btn-primary:hover:not(:disabled) {
  background: var(--vp-c-brand-2);
}

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.loading-bar {
  margin: 1rem 0;
}

.loading-text {
  color: var(--vp-c-text-2);
  font-size: 0.85rem;
  margin-bottom: 0.4rem;
}

.demo-body {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.file-zone {
  border: 2px dashed var(--vp-c-divider);
  border-radius: 8px;
  padding: 1.5rem;
  text-align: center;
  cursor: pointer;
  transition: border-color 0.2s, background 0.2s;
}

.file-zone:hover,
.file-zone.dragging {
  border-color: var(--vp-c-brand-1);
  background: var(--vp-c-brand-soft);
}

.file-zone input[type="file"] {
  display: none;
}

.file-label {
  cursor: pointer;
  color: var(--vp-c-text-2);
  font-size: 0.9rem;
}

.file-name {
  color: var(--vp-c-brand-1);
  font-weight: 600;
}

.presets {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.preset-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
}

.preset-tab {
  padding: 0.3rem 0.8rem;
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  background: transparent;
  color: var(--vp-c-text-2);
  cursor: pointer;
  font-size: 0.85rem;
  transition: all 0.2s;
}

.preset-tab.active {
  background: var(--vp-c-brand-1);
  color: #fff;
  border-color: var(--vp-c-brand-1);
}

.preset-tab:hover:not(.active) {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
}

.preset-desc {
  margin: 0;
  color: var(--vp-c-text-2);
  font-size: 0.82rem;
}

.preset-hint {
  margin: 0;
  font-size: 0.8rem;
  color: var(--vp-c-text-3);
}

.args-input {
  width: 100%;
  box-sizing: border-box;
  padding: 0.6rem;
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  background: var(--vp-code-block-bg);
  color: var(--vp-code-color);
  font-family: var(--vp-font-family-mono);
  font-size: 0.85rem;
  resize: vertical;
}

.args-preview {
  background: var(--vp-code-block-bg);
  border-radius: 6px;
  padding: 0.6rem 1rem;
  overflow-x: auto;
}

.args-preview code {
  color: var(--vp-code-color);
  font-family: var(--vp-font-family-mono);
  font-size: 0.85rem;
  white-space: pre;
}

.btn-run {
  align-self: flex-start;
}

.progress-bar {
  position: relative;
  height: 24px;
  background: var(--vp-c-bg-alt);
  border-radius: 12px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--vp-c-brand-1), var(--vp-c-brand-2));
  border-radius: 12px;
  transition: width 0.3s ease;
}

.progress-text {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  font-weight: 600;
  color: #fff;
  text-shadow: 0 1px 2px rgba(0,0,0,0.3);
}

.output-section {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.output-section h4 {
  margin: 0;
  color: var(--vp-c-brand-1);
}

.output-video {
  width: 100%;
  max-height: 400px;
  border-radius: 8px;
}

.output-gif {
  max-width: 100%;
  border-radius: 8px;
}

.btn-download {
  align-self: flex-start;
  background: var(--vp-c-brand-1);
  color: #fff;
  text-decoration: none;
  border-radius: 8px;
  padding: 0.5rem 1.2rem;
  font-weight: 600;
  font-size: 0.9rem;
  transition: background 0.2s;
}

.btn-download:hover {
  background: var(--vp-c-brand-2);
}

.error-msg {
  background: rgba(255, 60, 60, 0.1);
  border: 1px solid rgba(255, 60, 60, 0.3);
  border-radius: 6px;
  padding: 0.8rem;
  color: #ff4444;
  font-size: 0.85rem;
}

.log-section {
  margin-top: 1rem;
}

.log-section h4 {
  margin: 0 0 0.5rem;
  color: var(--vp-c-text-2);
  font-size: 0.85rem;
}

.log-pre {
  background: var(--vp-code-block-bg);
  border-radius: 6px;
  padding: 0.8rem;
  overflow-x: auto;
  max-height: 200px;
  overflow-y: auto;
}

.log-pre code {
  color: var(--vp-code-color);
  font-family: var(--vp-font-family-mono);
  font-size: 0.78rem;
  line-height: 1.6;
  white-space: pre;
  display: block;
}
</style>
