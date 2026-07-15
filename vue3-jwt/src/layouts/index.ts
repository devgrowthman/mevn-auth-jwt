import type { Component } from 'vue'

import AuthLayout from './AuthLayout.vue'
import DashboardLayout from './DashboardLayout.vue'
// import EmptyLayout from './EmptyLayout.vue'

export const layouts: Record<string, Component> = {
  auth: AuthLayout,
  dashboard: DashboardLayout,
  // empty: EmptyLayout
}