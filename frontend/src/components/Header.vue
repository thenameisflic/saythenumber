<script setup>
import ThemeToggle from '@/components/ThemeToggle.vue'
</script>
<template>
  <header class="bg-white dark:bg-gray-800 h-16 px-4 flex items-center justify-between">
    <div class="w-10"></div>
    <div class="text-teal-800 font-bold dark:text-white">Say the Number</div>
    <ThemeToggle />
  </header>
</template>
