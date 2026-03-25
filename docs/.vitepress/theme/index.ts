import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import FfmpegDemo from './components/FfmpegDemo.vue'
import './custom.css'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('FfmpegDemo', FfmpegDemo)
  }
} satisfies Theme
