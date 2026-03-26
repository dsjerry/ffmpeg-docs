import { defineConfig } from 'vitepress'
import { en, zh } from './config/nav'
import { enSidebar, zhSidebar } from './config/sidebar'

export default defineConfig({
  title: 'FFmpeg 学习指南',
  description: '掌握 FFmpeg、fluent-ffmpeg 和 @ffmpeg/core (WASM) 的完整指南',
  srcDir: '.',
  cleanUrls: true,
  lastUpdated: true,
  vite: {
    optimizeDeps: {
      exclude: ['@ffmpeg/ffmpeg', '@ffmpeg/util']
    },
    server: {
      headers: {
        'Cross-Origin-Opener-Policy': 'same-origin',
        'Cross-Origin-Embedder-Policy': 'require-corp'
      }
    }
  },
  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/logo.svg' }],
    ['link', { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' }],
    ['meta', { name: 'theme-color', content: '#e05c2a' }],
    // Open Graph
    ['meta', { property: 'og:title', content: 'FFmpeg 学习指南' }],
    ['meta', { property: 'og:description', content: '掌握 FFmpeg、fluent-ffmpeg 和 @ffmpeg/core (WASM) 的完整指南' }],
    ['meta', { property: 'og:image', content: '/og-image.png' }],
    ['meta', { property: 'og:url', content: 'https://dsjerry.github.io/ffmpeg-docs/' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:site_name', content: 'FFmpeg 学习指南' }],
    // Twitter
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['meta', { name: 'twitter:title', content: 'FFmpeg 学习指南' }],
    ['meta', { name: 'twitter:description', content: '掌握 FFmpeg、fluent-ffmpeg 和 @ffmpeg/core (WASM) 的完整指南' }],
    ['meta', { name: 'twitter:image', content: '/og-image.png' }]
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
        editLink: { pattern: 'https://github.com/dsjerry/ffmpeg-docs/edit/main/docs/:path', text: '在 GitHub 上编辑此页' },
        footer: {
          message: '基于 MIT 协议发布',
          copyright: 'Copyright © 2024-present FFmpeg 学习站点'
        }
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
        editLink: { pattern: 'https://github.com/dsjerry/ffmpeg-docs/edit/main/docs/:path', text: 'Edit this page on GitHub' }
      }
    }
  },
  themeConfig: {
    backToTop: true,
    socialLinks: [{ icon: 'github', link: 'https://github.com/dsjerry/ffmpeg-docs' }],
    search: { provider: 'local', options: { placeholder: 'Search docs...', languages: ['en', 'zh'] } },
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2024-present FFmpeg Learning Site'
    }
  }
})
