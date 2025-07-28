export function getComponentDom<T extends object>(component: T, props: Record<string, any> = {}) {
  const container = document.createElement('div')
  const app = createApp(
    defineComponent<T>({
      render: () => h(component, { ...props }),
    }),
  )
  const vm = app.mount(container)
  const el = vm.$el as HTMLElement
  return el
}
