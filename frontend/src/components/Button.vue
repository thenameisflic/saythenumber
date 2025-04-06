<template>
  <button
    class="h-16 w-full disabled:bg-gray-500 disabled:cursor-default disabled:transition-none disabled:hover:bg-gray-500 disabled:hover:scale-100 cursor-pointer transition-all duration-300 ease-in-out hover:bg-teal-800 button mt-4 flex-1 bg-teal-700 text-white font-bold rounded flex justify-center items-center hover:scale-105"
    :class="customClasses"
    :disabled="disabled"
  >
    <Spinner v-if="loading" />
    <span v-else>{{ text }}</span>
  </button>
</template>

<script setup>
import Spinner from '@/components/Spinner.vue'

defineProps({
  text: {
    type: String,
    required: true,
  },
  customClasses: {
    type: String,
    default: '',
  },
  loading: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
})
</script>
