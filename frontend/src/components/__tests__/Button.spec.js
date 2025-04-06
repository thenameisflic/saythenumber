import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import Button from '@/components/Button.vue'
import Spinner from '@/components/Spinner.vue'

describe('Button.vue', () => {
  it('renders button with correct text', () => {
    const wrapper = mount(Button, {
      props: { text: 'Click me' },
    })
    expect(wrapper.text()).toBe('Click me')
  })

  it('applies custom classes', () => {
    const wrapper = mount(Button, {
      props: { text: 'Test', customClasses: 'extra-class' },
    })
    expect(wrapper.classes()).toContain('extra-class')
  })

  it('shows spinner when loading', () => {
    const wrapper = mount(Button, {
      props: { text: 'Test', loading: true },
    })
    expect(wrapper.findComponent(Spinner).exists()).toBe(true)
  })

  it('disables button when disabled prop is true', () => {
    const wrapper = mount(Button, {
      props: { text: 'Test', disabled: true },
    })
    expect(wrapper.attributes('disabled')).toBe('')
    expect(wrapper.classes()).toContain('disabled:bg-gray-500')
  })

  it('applies hover styles when not disabled', () => {
    const wrapper = mount(Button, {
      props: { text: 'Test' },
    })
    expect(wrapper.classes()).toContain('hover:bg-teal-800')
    expect(wrapper.classes()).toContain('hover:scale-105')
  })

  it('has cursor pointer when not disabled', () => {
    const wrapper = mount(Button, {
      props: { text: 'Test' },
    })
    expect(wrapper.classes()).toContain('cursor-pointer')
  })

  it('has disabled cursor when disabled', () => {
    const wrapper = mount(Button, {
      props: { text: 'Test', disabled: true },
    })
    expect(wrapper.classes()).toContain('disabled:cursor-default')
  })
})
