// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ['@nuxt/ui', '@nuxt/content'],
  content: {
    build: {
      markdown: {
        highlight: {
          langs: [
            'solidity',
            'python',
            'js',
            'jsx',
            'json',
            'ts',
            'tsx',
            'vue',
            'css',
            'html',
            'vue',
            'bash',
            'md',
            'mdc',
            'yaml',
          ],
        },
      },
    },
  },
  compatibilityDate: '2025-02-10',
});
