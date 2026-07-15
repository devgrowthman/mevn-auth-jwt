<script setup lang="ts">
  import { useRouter } from 'vue-router';
  import { useForm } from 'vee-validate';
  import { toast } from 'vue-sonner'

  import { loginSchema } from '@/schemas/login.schema';
  import { useAuthStore } from '@/stores/auth.store';

  const router = useRouter()
  const authStore = useAuthStore()

  const {
    defineField,
    errors,
    isSubmitting,
    handleSubmit
  } = useForm({
    validationSchema: loginSchema
  })

  const [username, usernameAttrs] = defineField('username')
  const [password, passwordAttrs] = defineField('password')

  const onSubmit = handleSubmit(
    async (values) => {
      try {
        await authStore.login(values)

        toast.success('Login berhasil')
        router.push({ name: 'dashboard' })

      } catch(error: any) {
        toast.error(
          error?.response?.data?.message ?? 'Login gagal'
        )
      }
    }
  )
</script>

<template>
  <div
    class="
      w-full
      max-w-md
      rounded-2xl
      bg-white
      p-8
    "
  >
    <h1
      class="
        mb-2
        text-3xl
        font-bold
      "
    >
      Sign In
    </h1>

    <p
      class="
        mb-8
        text-slate-500
      "
    >
      Login untuk melanjutkan.
    </p>

    <form @submit.prevent="onSubmit">

        <BaseLabel>
            Username
        </BaseLabel>

        <BaseInput
            v-model="username"
            placeholder="Username"
        />

        <BaseErrorMessage
            :message="errors.username"
        />

        <BaseLabel class="mt-4">
            Password
        </BaseLabel>

        <BasePasswordInput
            v-model="password"
        />

        <BaseErrorMessage
            :message="errors.password"
        />

        <BaseButton
            class="mt-4"
            type="submit"
            :loading="isSubmitting"
        >
            Login
        </BaseButton>

    </form>
  </div>
</template>