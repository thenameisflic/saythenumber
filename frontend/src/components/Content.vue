<template>
  <main class="flex-1 flex items-center justify-center flex-col">
    <div class="text-2xl text-center">Hi, I can say numbers for you.</div>
    <div class="w-full px-4 sm:px-0 flex items-center justify-center">
      <NumberInput v-model="number" />
    </div>
    <div class="block sm:flex sm:w-128 sm:flex-row flex-col w-full px-4 sm:px-0">
      <Button
        text="Say it now"
        @click="handleSayNow"
        :loading="loading && disabled === 'say-with-delay'"
        :disabled="disabled === 'say-now'"
      />
      <Button
        :loading="loading && disabled === 'say-now'"
        class="sm:ml-4"
        text="Say it with a delay"
        @click="handleSayWithDelay"
        :disabled="disabled === 'say-with-delay'"
      />
    </div>
    <div class="mt-4 flex items-center justify-center px-8" v-if="answer || error">
      <div class="text-center text-red-500" v-if="error && !loading">{{ error }}</div>
      <div id="answer" class="text-center text-2xl font-bold max-w-128" v-else>{{ answer }}</div>
    </div>
  </main>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      number: '',
      answer: '',
      disabled: '',
      error: '',
      loading: false,
    }
  },
  methods: {
    async handleApiRequest(method = 'get', delay = 0) {
      if (this.loading) return false

      try {
        this.loading = true
        this.disabled = method === 'get' ? 'say-with-delay' : 'say-now'
        this.error = ''

        if (!this.number && this.number !== 0) {
          throw new Error('Please enter a number')
        }

        const config = {
          validateStatus: function (status) {
            return (status >= 200 && status < 300) || (status >= 400 && status < 500)
          },
        }

        const response =
          method === 'get'
            ? await axios.get('/num_to_english', { params: { number: this.number }, ...config })
            : await axios.post(
                '/num_to_english',
                { number: this.number },
                {
                  headers: { 'Content-Type': 'application/json' },
                  ...config,
                },
              )

        if (delay > 0) {
          await new Promise((resolve) => setTimeout(resolve, delay))
        }

        if (response.data.status === 'ok') {
          this.answer = response.data.num_in_english
          return true
        } else if (response.data.status === 'error') {
          throw new Error(response.data.message || 'Number conversion failed')
        } else {
          throw new Error('Unexpected response from server')
        }
      } catch (error) {
        if (error.response) {
          if (error.response.status === 429) {
            this.error = 'Too many requests. Please wait and try again.'
          } else if (error.response.data?.message) {
            this.error = error.response.data.message
          } else {
            this.error = `Server error (${error.response.status})`
          }
        } else if (error.request) {
          this.error = 'Network error - no response from server'
        } else {
          this.error = error.message || 'Error processing your request'
        }
        return false
      } finally {
        this.loading = false
        this.disabled = ''
      }
    },

    async handleSayNow() {
      await this.handleApiRequest('get')
    },

    async handleSayWithDelay() {
      await this.handleApiRequest('post', 5000)
    },
  },
}
</script>

<script setup>
import NumberInput from '@/components/NumberInput.vue'
import Button from '@/components/Button.vue'
import axios from 'axios'

axios.defaults.baseURL = import.meta.env.VITE_API_URL
</script>
