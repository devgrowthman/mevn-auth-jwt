<script setup lang="ts">
interface Option {
  label: string
  value: string
}

interface Props {
  modelValue: string
  options: Option[]
}

defineProps<Props>()

const emit = defineEmits<{
  (
    e:'update:modelValue',
    value:string
  ):void
}>()
</script>

<template>

<select

    :value="modelValue"

    class="
        w-full
        rounded-lg
        border
        px-4
        py-3
    "

    @change="
        emit(
            'update:modelValue',
            ($event.target as HTMLSelectElement).value
        )
    "
>

<option

v-for="option in options"

:key="option.value"

:value="option.value"

>

{{ option.label }}

</option>

</select>

</template>