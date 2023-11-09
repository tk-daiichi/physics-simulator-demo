import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    }
  }
})
// const pathaa = require('node:path');
// console.log(pathaa)

/**
 * resolve.aliasの型　公式ドキュメントより
 * Record<string, string> |
 * Array<{ 
 *  find: string | RegExp, 
 *  replacement: string, 
 *  customResolver?: ResolverFunction | ResolverObject 
 * }>
 * 
 * path.resolveがようわからんがstringを返している
 * これはnodeのモジュールらしい
 *  */