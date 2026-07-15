import { useAuthStore } from "@/stores/auth.store";
import { authService } from "@/services/auth.service"

export async function initializeAuth() {
  const authStore = useAuthStore()

  if (authStore.initialized) return

  try {
    const { data } = await authService.refresh()
    authStore.setToken(data.accessToken)

    const profile = await authService.profile()
    authStore.setUser(profile.data)

  } catch(error) {
    authStore.logout()
  } finally {
    authStore.setInitialized(true)
  }
}