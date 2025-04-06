import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'

import NumberInput from '@/components/NumberInput.vue'

describe('NumberInput.vue', () => {
  it('renders correctly with default props', () => {
    const wrapper = mount(NumberInput)
    const input = wrapper.find('input')

    expect(input.exists()).toBe(true)
    expect(input.attributes('type')).toBe('tel')
    expect(input.attributes('placeholder')).toBe('Enter a number (e.g., -3.14 or 208)')
    expect(input.element.value).toBe('')
  })

  it('accepts initial modelValue prop', () => {
    const wrapper = mount(NumberInput, {
      props: {
        modelValue: '3.14',
      },
    })

    expect(wrapper.find('input').element.value).toBe('3.14')
  })

  it('emits update event with filtered numeric value on input', async () => {
    const wrapper = mount(NumberInput)
    const input = wrapper.find('input')

    await input.setValue('a1b2c3')
    expect(wrapper.emitted()['update:modelValue'][0]).toEqual(['123'])

    await input.setValue('3.1.4')
    expect(wrapper.emitted()['update:modelValue'][1]).toEqual(['3.14'])

    await input.setValue('--2.5')
    expect(wrapper.emitted()['update:modelValue'][2]).toEqual(['-2.5'])

    await input.setValue('000123')
    expect(wrapper.emitted()['update:modelValue'][3]).toEqual(['123'])
  })

  it('handles special cases correctly', async () => {
    const wrapper = mount(NumberInput)
    const input = wrapper.find('input')

    await input.setValue('')
    expect(wrapper.emitted()['update:modelValue'][0]).toEqual([''])

    await input.setValue('-')
    expect(wrapper.emitted()['update:modelValue'][1]).toEqual(['-'])

    await input.setValue('.')
    expect(wrapper.emitted()['update:modelValue'][2]).toEqual(['.'])

    await input.setValue('0.5')
    expect(wrapper.emitted()['update:modelValue'][3]).toEqual(['0.5'])
  })

  it('handles negative numbers correctly', async () => {
    const wrapper = mount(NumberInput)
    const input = wrapper.find('input')

    await input.setValue('-123')
    expect(wrapper.emitted()['update:modelValue'][0]).toEqual(['-123'])

    await input.setValue('1-23')
    expect(wrapper.emitted()['update:modelValue'][1]).toEqual(['-123'])

    await input.setValue('123-')
    expect(wrapper.emitted()['update:modelValue'][2]).toEqual(['-123'])
  })

  it('handles decimal numbers correctly', async () => {
    const wrapper = mount(NumberInput)
    const input = wrapper.find('input')

    await input.setValue('3.14')
    expect(wrapper.emitted()['update:modelValue'][0]).toEqual(['3.14'])

    await input.setValue('3..14')
    expect(wrapper.emitted()['update:modelValue'][1]).toEqual(['3.14'])

    await input.setValue('.14')
    expect(wrapper.emitted()['update:modelValue'][2]).toEqual(['.14'])
  })
})
