import { defineConfig } from 'vitepress'
import { en, zh } from './config/nav'
import { enSidebar, zhSidebar } from './config/sidebar'

export default defineConfig({
  title: 'FFmpeg 学习指南',
  description: '掌握 FFmpeg、fluent-ffmpeg 和 @ffmpeg/core (WASM) 的完整指南',
  srcDir: '.',
  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/logo.svg' }]
  ],
  locales: {
    root: {
      label: '中文',
      lang: 'zh-CN',
      link: '/',
      themeConfig: {
        nav: zh,
        sidebar: zhSidebar,
        outline: { level: [2, 3], label: '页面导航' },
        docFooter: { prev: '上一页', next: '下一页' },
        editLink: { pattern: 'https://github.com/your-repo/edit/main/docs/:path' }
      }
    },
    en: {
      label: 'English',
      lang: 'en',
      link: '/en/',
      themeConfig: {
        nav: en,
        sidebar: enSidebar,
        outline: { level: [2, 3], label: 'On This Page' },
        docFooter: { prev: 'Previous Page', next: 'Next Page' },
        editLink: { pattern: 'https://github.com/your-repo/edit/main/docs/:path' }
      }
    }
  },
  themeConfig: {
    socialLinks: [{ icon: 'github', link: 'https://github.com/your-repo' }],
    search: { provider: 'local', options: { languages: ['en', 'zh'] } },
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2024-present FFmpeg Learning Site'
    }
  }
})
