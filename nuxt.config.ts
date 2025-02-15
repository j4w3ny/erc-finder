// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  nitro: {
    preset: 'bun',
    // prerender: {
    //   crawlLinks: true,
    //   routes: ['/'],
    // },
  },
  routeRules: {
    '/LICENSE': { prerender: false },
  },
  modules: ['@nuxt/ui', '@nuxt/content', 'nuxt-og-image'],
  site: {
    url: 'https://erc-finder.moumantai.xyz',
    name: 'ERC Finder',
  },
  ogImage: {
    // zeroRuntime: true,
  },

  content: {
    renderer: {
      anchorLinks: { h2: true },
    },
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
