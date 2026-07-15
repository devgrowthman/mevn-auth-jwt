<script setup lang="ts">
import { computed, ref } from 'vue'
import { Icon } from '@iconify/vue'

interface Props {
  modelValue: string
}

defineProps<Props>()

const emit = defineEmits<{
  (e:'update:modelValue', value:string):void
}>()

const showPassword = ref(false)

const inputType = computed(() =>
    showPassword.value
        ? 'text'
        : 'password'
)
</script>

<template>

<div class="relative">

    <input

        :type="inputType"
        :value="modelValue"
        placeholder="Kata Sandi"
        class="
            w-full
            rounded-lg
            border
            px-4
            py-3
            pr-12
        "

        @input="
            emit(
                'update:modelValue',
                ($event.target as HTMLInputElement).value
            )
        "
    />

    <button

        type="button"

        class="
            absolute
            right-3
            top-1/2
            -translate-y-1/2
        "

        @click="showPassword=!showPassword"
    >

        <Icon
            :icon="
                showPassword
                    ? 'mdi:eye-off'
                    : 'mdi:eye'
            "
        />

    </button>

</div>

</template>