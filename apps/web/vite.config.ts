/* eslint-disable style/quote-props */
import { env } from 'node:process'
import { fileURLToPath, URL } from 'node:url'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import autoprefixer from 'autoprefixer'
// import { visualizer } from 'rollup-plugin-visualizer'
import UnoCSS from 'unocss/vite'
import AutoImport from 'unplugin-auto-import/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import Components from 'unplugin-vue-components/vite'
import { defineConfig } from 'vite'
import viteCompression from 'vite-plugin-compression'
import { createHtmlPlugin } from 'vite-plugin-html'
import viteImagemin from 'vite-plugin-imagemin'
import { preImgs } from './plugins/preImgs'

const isProd = env.NODE_ENV === 'production'
console.clear()
// https://vite.dev/config/
export default defineConfig({
  server: {
    open: true,
    host: '0.0.0.0',
    hmr: true,
    port: 4002,
    warmup: {
      clientFiles: ['./index.html', './src/{views,components}/*'],
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: !isProd,
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
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
        },
      },
    },
  },
  optimizeDeps: {
    include: ['element-plus', 'vue', 'vue-router', 'pinia'],
  },
  css: {
    postcss: {
      plugins: [autoprefixer()],
    },
  },
  plugins: [
    vue(),
    vueJsx(),
    UnoCSS({
      // 样式注入到单文件组件里
      mode: 'vue-scoped',
    }),
    AutoImport({
      imports: ['vue', 'vue-router', 'pinia'],
      dts: 'src/typings/auto-imports.d.ts',
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      dts: 'src/typings/components.d.ts',
      resolvers: [ElementPlusResolver()],
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
        quality: 20,
      },
      pngquant: {
        quality: [0.8, 0.9],
        speed: 4,
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
          title: 'Rbac Admin',
        },
      },
    }),
    preImgs({
      dir: 'src/assets/preImages',
      type: 'preload',
    }),
    // visualizer({
    //   open: true,
    //   gzipSize: true,
    //   brotliSize: true,
    //   filename: 'analysis.html',
    // }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@p': fileURLToPath(new URL('./public', import.meta.url)),
    },
  },
})
