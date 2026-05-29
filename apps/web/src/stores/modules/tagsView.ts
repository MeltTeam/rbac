export const tagsViewStore = defineStore('TAGS_VIEW', {
  state: () => ({
    tags: [] as string[],
    cache: [] as string[],
  }),
  actions: {
    addCache(name: string) {
      if (name && !this.cache.includes(name)) {
        this.cache = [...this.cache, name]
      }
    },
    clearCache() {
      this.cache = []
      this.tags = []
    },
  },
})
