import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // '/api' で始まるリクエストが来たら...
      '/api': {
        // 本物のホットペッパーAPIのサーバーに転送する
        target: 'http://webservice.recruit.co.jp/hotpepper',
        changeOrigin: true,
        // パスから '/api' を取り除く (例: /api/gourmet/v1/ -> /gourmet/v1/)
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
})