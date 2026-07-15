<script setup lang="ts">
interface Props {
  modelValue: string
  type?: string
  placeholder?: string
  disabled?: boolean
}

withDefaults(
  defineProps<Props>(),
  {
    type: 'text',
    disabled: false
  }
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()
</script>

<template>
  <input
    :value="modelValue"
    :type="type"
    :placeholder="placeholder"
    :disabled="disabled"
    class="
      w-full
      rounded-lg
      border
      border-slate-300
      px-4
      py-3
      outline-none
      transition
      focus:border-blue-500
      focus:ring-2
      focus:ring-blue-200
      disabled:bg-slate-100
    "
    @input="
      emit(
        'update:modelValue',
        ($event.target as HTMLInputElement).value
      )
    "
  />
</template>