import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    watch: {
      // public/images へ画像を追加/コピーすると、生成される一時ファイル
      // (例: *.jpg.~tmp) のロックで Windows のファイル監視が EBUSY で落ちる。
      // 画像はビルド時に取り込まれHMR監視は不要なため、監視対象から除外する。
      ignored: ["**/public/images/**"],
    },
  },
})
