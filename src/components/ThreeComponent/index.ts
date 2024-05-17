import { App, Component, defineAsyncComponent, AsyncComponentLoader } from "vue"

export const registComponent = {
  install: (app: App) => {
    const modules: Record<string, AsyncComponentLoader> = import.meta.glob("./*.vue")
    for (const path in modules) {
      const componentName = path
        .split("/")
        .pop()
        ?.replace(/\.\w+$/, "") as string
      const component = defineAsyncComponent(modules[path])
      app.component(componentName, component)
    }
  }
}
