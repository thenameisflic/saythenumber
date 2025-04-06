import { describe, it, expect, beforeEach, vi } from 'vitest'

import { mount } from '@vue/test-utils'
import ThemeToggle from '@/components/ThemeToggle.vue'

vi.mock('@heroicons/vue/24/outline', () => ({
  MoonIcon: { template: '<div class="moon-icon"></div>' },
  SunIcon: { template: '<div class="sun-icon"></div>' },
}))

describe('ThemeToggle.vue', () => {
  beforeEach(() => {
    localStorage.clear()
    document.documentElement.removeAttribute('data-theme')
  })

  it('renders initial state correctly', () => {
    const wrapper = mount(ThemeToggle)
    expect(wrapper.find('.sun-icon').exists()).toBe(true)
    expect(wrapper.classes()).toContain('bg-gray-200')
    expect(wrapper.classes()).toContain('text-gray-800')
  })

  it('toggles dark mode on click', async () => {
    const wrapper = mount(ThemeToggle)
    await wrapper.trigger('click')
    expect(wrapper.vm.darkMode).toBe(true)
    expect(wrapper.find('.moon-icon').exists()).toBe(true)
    expect(wrapper.classes()).toContain('bg-gray-700')
    expect(wrapper.classes()).toContain('text-white')
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark')
    expect(localStorage.getItem('darkMode')).toBe('true')
  })

  it('loads saved dark mode from localStorage', () => {
    localStorage.setItem('darkMode', 'true')
    const wrapper = mount(ThemeToggle)
    expect(wrapper.vm.darkMode).toBe(true)
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark')
  })

  it('respects system preference when no localStorage value', () => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation((query) => ({
        matches: query === '(prefers-color-scheme: dark)',
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      })),
    })

    const wrapper = mount(ThemeToggle)
    expect(wrapper.vm.darkMode).toBe(true)
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark')
  })

  it('applies correct transition classes', () => {
    const wrapper = mount(ThemeToggle)
    expect(wrapper.classes()).toContain('transition-all')
    expect(wrapper.classes()).toContain('duration-300')
  })
})
