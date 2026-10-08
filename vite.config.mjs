import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  // GitHub Pages 사용자 사이트(raeapril.github.io)라 루트 경로로 배포된다.
  base: '/',
  plugins: [react()],
})
