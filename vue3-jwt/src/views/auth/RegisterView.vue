<script setup lang="ts">
  import { useRouter } from 'vue-router';
  import { useForm } from 'vee-validate';
  import { toast } from 'vue-sonner';

  import { registerSchema } from '@/schemas/register.schema';
  import { useAuthStore } from '@/stores/auth.store';

  const router = useRouter()
  const authStore = useAuthStore()

  const {
    defineField,
    errors,
    handleSubmit,
    isSubmitting
  } = useForm({
    validationSchema: registerSchema,
    initialValues: {
      role: 'USER'
    }
  })

  const [username, usernameAttrs] = defineField('username')
  const [password, passwordAttrs] = defineField('password')
  const [confirmPassword, confirmPasswordAttrs] = defineField('confirmPassword')
  const [role, roleAttrs] = defineField('role')

  const onSubmit = handleSubmit(async (values) => {
    try {
      const { confirmPassword, ...payload } = values
      await authStore.register(payload)

      toast.success('Registrasi berhasil')

      router.push({
        name: 'login'
      })
    } catch(error: any) {
      toast.error(
        error?.response?.data?.message ?? 'Registrasi gagal'
      )
    }
  })

</script>

<template>
  <div
    class="flex min-h-screen items-center justify-center bg-slate-100 p-6"
  >
    <div
      class="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg"
    >
      <h1 class="mb-2 text-3xl font-bold">
        Register
      </h1>

      <p class="mb-8 text-slate-500">
        Buat akun baru.
      </p>

      <form
        class="space-y-5"
        @submit.prevent="onSubmit"
      >
        <!-- Username -->

        <div>
          <label class="mb-2 block text-sm">
            Username
          </label>

          <input
            v-model="username"
            v-bind="usernameAttrs"
            class="w-full rounded-lg border p-3"
          />

          <small class="text-red-500">
            {{ errors.username }}
          </small>
        </div>

        <!-- Password -->

        <div>
          <label class="mb-2 block text-sm">
            Password
          </label>

          <input
            v-model="password"
            v-bind="passwordAttrs"
            type="password"
            class="w-full rounded-lg border p-3"
          />

          <small class="text-red-500">
            {{ errors.password }}
          </small>
        </div>

        <!-- Confirm Password -->

        <div>
          <label class="mb-2 block text-sm">
            Confirm Password
          </label>

          <input
            v-model="confirmPassword"
            v-bind="confirmPasswordAttrs"
            type="password"
            class="w-full rounded-lg border p-3"
          />

          <small class="text-red-500">
            {{ errors.confirmPassword }}
          </small>
        </div>

        <!-- Role -->

        <div>
          <label class="mb-2 block text-sm">
            Role
          </label>

          <select
            v-model="role"
            v-bind="roleAttrs"
            class="w-full rounded-lg border p-3"
          >
            <option value="USER">
              User
            </option>

            <option value="ADMIN">
              Admin
            </option>
          </select>

          <small class="text-red-500">
            {{ errors.role }}
          </small>
        </div>

        <button
          type="submit"
          :disabled="isSubmitting"
          class="w-full rounded-lg bg-blue-600 py-3 font-semibold text-white"
        >
          {{ isSubmitting ? 'Loading...' : 'Register' }}
        </button>
      </form>
    </div>
  </div>
</template>