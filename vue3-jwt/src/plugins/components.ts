import type { App, Component } from 'vue'

const modules = import.meta.glob(
  '@/components/ui/Base*.vue',
  {
    eager: true,
    import: 'default'
  }
)

export function registerGlobalComponents(app: App) {
  Object.entries(modules).forEach(([path, component]) => {
    const filename = path.split('/').pop()?.replace('.vue', '')

    if (!filename) return

    app.component(filename, component as Component)
  })
}