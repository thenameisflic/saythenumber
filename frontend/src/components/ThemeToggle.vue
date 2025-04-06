<template>
  <button
    @click="toggleDarkMode"
    class="flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300 cursor-pointer"
    :class="{
      'bg-gray-200 hover:bg-gray-300 text-gray-800': !darkMode,
      'bg-gray-700 hover:bg-gray-600 text-white': darkMode,
    }"
    aria-label="Toggle dark mode"
  >
    <transition name="fade" mode="out-in">
      <MoonIcon v-if="darkMode" class="size-5 text-white" />
      <SunIcon v-else class="size-5 text-teal-800" />
    </transition>
    <span class="sr-only">{{ darkMode ? 'Switch to light mode' : 'Switch to dark mode' }}</span>
  </button>
</template>
<script setup>
import { MoonIcon } from '@heroicons/vue/24/outline'
import { SunIcon } from '@heroicons/vue/24/outline'
</script>
<script>
export default {
  data() {
    return {
      darkMode: false,
    }
  },
  methods: {
    toggleDarkMode() {
      this.darkMode = !this.darkMode
      if (this.darkMode) {
        document.documentElement.setAttribute('data-theme', 'dark')
      } else {
        document.documentElement.removeAttribute('data-theme')
      }
      localStorage.setItem('darkMode', this.darkMode)
    },
  },
  mounted() {
    const savedMode = localStorage.getItem('darkMode')
    if (savedMode) {
      this.darkMode = savedMode === 'true'
      if (this.darkMode) {
        document.documentElement.setAttribute('data-theme', 'dark')
      }
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      this.darkMode = true
      document.documentElement.setAttribute('data-theme', 'dark')
    }
  },
}
</script>
