<script setup lang="ts">
import { useData, inBrowser } from 'vitepress'
import { watchEffect } from 'vue'
import DefaultTheme from 'vitepress/theme'
import { defineAsyncComponent } from 'vue'

const { Layout } = DefaultTheme

const { lang } = useData()

watchEffect(() => {
  if (inBrowser) {
    document.cookie = `nf_lang=${lang.value}; expires=Mon, 1 Jan 2030 00:00:00 UTC; path=/; SameSite=Lax`
  }
})
</script>

<template>
  <Layout />
</template>
