/* eslint-disable style/quote-props */
import { dirname, resolve } from 'node:path'
import { cwd, env } from 'node:process'
import { fileURLToPath, URL } from 'node:url'
import VueI18nPlugin from '@intlify/unplugin-vue-i18n/vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import autoprefixer from 'autoprefixer'
// import { visualizer } from 'rollup-plugin-visualizer'
import UnoCSS from 'unocss/vite'
import AutoImport from 'unplugin-auto-import/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import Components from 'unplugin-vue-components/vite'
import { defineConfig, loadEnv } from 'vite'
import viteCompression from 'vite-plugin-compression'
import { createHtmlPlugin } from 'vite-plugin-html'
import viteImagemin from 'vite-plugin-imagemin'
// import { preImgs } from './plugins/vite/preImgs'

console.clear()

export default defineConfig(({ mode }) => {
  const viteEnv = loadEnv(mode, cwd(), '')
  const isProd = env.NODE_ENV === 'production'
  return {
    preview: {
      host: '0.0.0.0',
      port: 4002,
      proxy: {
        '/api': {
          target: 'http://192.168.0.103:4001',
          changeOrigin: true,
          ws: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
      },
    },
    server: {
      host: '0.0.0.0',
      hmr: true,
      port: 4002,
      warmup: {
        clientFiles: ['./index.html', './src/**/*.{ts,vue}'],
      },
      proxy: {
        '/api': {
          target: 'http://192.168.0.103:4001',
          changeOrigin: true,
          ws: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
      },
    },
    build: {
      outDir: 'dist',
      sourcemap: !isProd,
      chunkSizeWarningLimit: 2000,
      // reportCompressedSize: true,
      terserOptions: isProd
        ? {
            compress: {
              drop_console: true,
              drop_debugger: true,
            },
          }
        : undefined,
      rollupOptions: {
        output: {
          entryFileNames: 'static/js/[name]-[hash].js',
          chunkFileNames: 'static/js/[name]-[hash].js',
          assetFileNames: 'static/[ext]/[name]-[hash].[ext]',
          compact: true,
          manualChunks: {
            vue: ['vue'],
            'vue-router': ['vue-router'],
            pinia: ['pinia'],
            'element-plus': ['element-plus'],
            utils: ['axios', 'lodash-es'],
            loginView: [
              './src/views/Login/SvgLogin/index.vue',
              './src/views/Login/EmailLogin/index.vue',
              './src/views/Login/EmailRegister/index.vue',
              './src/views/Login/ResetPwd/index.vue',
            ],
          },
          format: 'esm',
        },
      },
    },
    optimizeDeps: {
      include: ['vue', 'vue-router', 'element-plus', 'pinia', 'axios', '@vueuse/core', 'qs', 'vconsole'],
    },
    css: {
      postcss: {
        plugins: [
          autoprefixer({
            overrideBrowserslist: ['Chrome > 31', 'Edge > 79', 'Firefox > 59', 'Safari > 11', 'not dead'],
          }),
        ],
      },
    },
    plugins: [
      vue(),
      vueJsx(),
      UnoCSS({ mode: 'vue-scoped' }),
      AutoImport({
        vueTemplate: true,
        vueDirectives: true,
        imports: ['vue', '@vueuse/core', 'pinia', 'vue-router', 'vue-i18n'],
        dts: 'src/typings/auto-imports.d.ts',
        resolvers: [ElementPlusResolver()],
      }),
      Components({
        dts: 'src/typings/components.d.ts',
        dirs: ['src/components', 'src/**/components'],
        resolvers: [ElementPlusResolver()],
      }),
      VueI18nPlugin({
        include: [resolve(dirname(fileURLToPath(import.meta.url)), './src/i18n/locales/**')],
        compositionOnly: true,
        fullInstall: true,
        runtimeOnly: true,
      }),
      viteCompression({
        verbose: true,
        disable: !isProd,
        threshold: 10240,
      }),
      viteImagemin({
        gifsicle: {
          optimizationLevel: 7,
          interlaced: false,
        },
        optipng: {
          optimizationLevel: 7,
        },
        mozjpeg: {
          quality: 75,
        },
        pngquant: {
          quality: [0.7, 0.8],
          speed: 3,
        },
        svgo: {
          plugins: [
            {
              name: 'removeViewBox',
            },
            {
              name: 'removeEmptyAttrs',
              active: false,
            },
          ],
        },
      }),
      createHtmlPlugin({
        minify: true,
        entry: 'src/main.ts',
        template: 'index.html',
        inject: {
          data: {
            title: viteEnv.VITE_APP_TITLE || 'RbacAdmin',
            primaryColor: viteEnv.VITE_APP_PRIMARY_COLOR || '#3b82f6',
            primaryColorKey: viteEnv.VITE_APP_PRIMARY_COLOR_KEY || 'PRIMARY_COLOR',
          },
        },
      }),
      // preImgs({
      //   dir: 'src/assets/preImages',
      //   type: 'preload',
      // }),
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
  }
})
