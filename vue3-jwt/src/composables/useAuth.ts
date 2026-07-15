import { storeToRefs } from "pinia";
import { useAuthStore } from "@/stores/auth.store";

export function useAuth() {
  const store = useAuthStore()

  return {
    ...storeToRefs(store),

    login: store.login,
    logout: store.logout,
    refresh: store.refresh,
    profile: store.profile,
    register: store.register,
    clearAuth: store.clearAuth,
  }
}