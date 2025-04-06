<template>
  <input
    :value="modelValue"
    @input="handleInput"
    ref="numericInput"
    class="dark:bg-gray-700 dark:placeholder:text-gray-500 h-16 mt-4 w-full sm:w-128 bg-white placeholder:text-gray-200 rounded px-4 text-center text-xl"
    type="tel"
    placeholder="Enter a number (e.g., -3.14 or 208)"
  />
</template>

<script>
export default {
  props: {
    modelValue: {
      type: [String, Number],
      default: ''
    }
  },
  methods: {
    handleInput(event) {
      let numericValue = event.target.value.replace(/[^0-9.-]/g, '');

      const decimalParts = numericValue.split('.');
      if (decimalParts.length > 2) {
        numericValue = decimalParts[0] + '.' + decimalParts.slice(1).join('');
      }

      if (numericValue.includes('-')) {
        numericValue = '-' + numericValue.replace(/-/g, '');
      }

      if (/^0[0-9]/.test(numericValue) && !numericValue.startsWith('0.')) {
        numericValue = numericValue.replace(/^0+/, '');
      }

      if (numericValue === '-' || numericValue === '.') {
        this.$refs.numericInput.value = numericValue;
        this.$emit('update:modelValue', numericValue);
        return;
      }

      if (numericValue === '') {
        this.$refs.numericInput.value = '';
        this.$emit('update:modelValue', '');
        return;
      }

      this.$refs.numericInput.value = numericValue;
      this.$emit('update:modelValue', numericValue);
    }
  }
}
</script>
