import { mount } from '@vue/test-utils'
import Content from '@/components/Content.vue'
import NumberInput from '@/components/NumberInput.vue'
import Button from '@/components/Button.vue'
import { vi, describe, beforeEach, afterEach, it, expect } from 'vitest'
import axios from 'axios'

vi.mock('axios')

describe('Content.vue', () => {
  let wrapper
  let mockGet
  let mockPost

  beforeEach(() => {
    mockGet = vi.fn()
    mockPost = vi.fn()
    axios.get = mockGet
    axios.post = mockPost

    wrapper = mount(Content)
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('renders correctly', () => {
    expect(wrapper.find('main').exists()).toBe(true)
    expect(wrapper.findComponent(NumberInput).exists()).toBe(true)
    expect(wrapper.findAllComponents(Button)).toHaveLength(2)
    expect(wrapper.text()).toContain('Hi, I can say numbers for you.')
  })

  it('handles empty number input', async () => {
    await wrapper.vm.handleSayNow()
    expect(wrapper.vm.error).toBe('Please enter a number')
    expect(wrapper.vm.loading).toBe(false)
  })

  it('calls API for say now', async () => {
    mockGet.mockResolvedValue({
      data: { status: 'ok', num_in_english: 'forty two' },
    })

    await wrapper.setData({ number: '42' })
    await wrapper.vm.handleSayNow()

    expect(mockGet).toHaveBeenCalledWith('/num_to_english', {
      params: { number: '42' },
      validateStatus: expect.any(Function),
    })
    expect(wrapper.vm.answer).toBe('forty two')
    expect(wrapper.vm.error).toBe('')
  })

  it('calls API for say with delay', async () => {
    mockPost.mockResolvedValue({
      data: { status: 'ok', num_in_english: 'forty two' },
    })

    await wrapper.setData({ number: '42' })
    wrapper.vm.handleSayWithDelay()

    expect(mockPost).toHaveBeenCalled()
    expect(wrapper.vm.loading).toBe(true)
  })

  it('handles API errors', async () => {
    mockGet.mockRejectedValue({
      response: {
        status: 429,
        data: { message: 'Too many requests' },
      },
    })

    await wrapper.setData({ number: '42' })
    await wrapper.vm.handleSayNow()

    expect(wrapper.vm.error).toBe('Too many requests. Please wait and try again.')
    expect(wrapper.vm.loading).toBe(false)
  })

  it('shows loading states correctly', async () => {
    mockGet.mockImplementation(() => new Promise(() => {}))

    await wrapper.setData({ number: '42' })
    wrapper.vm.handleSayNow()

    await wrapper.vm.$nextTick()

    const buttons = wrapper.findAllComponents(Button)
    expect(buttons[0].props('loading')).toBe(true)
    expect(buttons[1].props('disabled')).toBe(true)
  })

  it('displays error messages', async () => {
    await wrapper.setData({ error: 'Test error' })
    expect(wrapper.find('.text-red-500').text()).toBe('Test error')
  })

  it('displays answer correctly', async () => {
    await wrapper.setData({ answer: 'forty two' })
    expect(wrapper.find('#answer').text()).toBe('forty two')
  })

  it('handles network errors', async () => {
    mockGet.mockRejectedValue({ request: {} })

    await wrapper.setData({ number: '42' })
    await wrapper.vm.handleSayNow()

    expect(wrapper.vm.error).toBe('Network error - no response from server')
  })

  it('handles unexpected responses', async () => {
    mockGet.mockResolvedValue({ data: { status: 'unknown' } })

    await wrapper.setData({ number: '42' })
    await wrapper.vm.handleSayNow()

    expect(wrapper.vm.error).toBe('Unexpected response from server')
  })

  it('handles API error messages', async () => {
    mockGet.mockRejectedValue({
      response: {
        status: 400,
        data: { message: 'Invalid number format' },
      },
    })

    await wrapper.setData({ number: '42' })
    await wrapper.vm.handleSayNow()

    expect(wrapper.vm.error).toBe('Invalid number format')
  })
})
