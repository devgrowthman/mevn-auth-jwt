<script setup lang="ts">
interface Props {
  loading?: boolean
  disabled?: boolean
  type?: 'button' | 'submit'
}

withDefaults(
  defineProps<Props>(),
  {
    loading: false,
    disabled: false,
    type: 'button'
  }
)
</script>

<template>

<button

:type="type"

:disabled="loading || disabled"

class="
w-full
rounded-lg
bg-blue-600
py-3
font-semibold
text-white
transition
hover:bg-blue-700
disabled:cursor-not-allowed
disabled:opacity-50
"

>

<span v-if="loading">
Loading...
</span>

<span v-else>

<slot/>

</span>

</button>

</template>