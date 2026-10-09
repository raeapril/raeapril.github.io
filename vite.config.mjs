import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/',
  plugins: [react()],
  build: {
    // 메인(index) + 프로젝트 상세(project.html#rz) 두 페이지
    rollupOptions: {
      input: {
        main: resolve(import.meta.dirname, 'index.html'),
        project: resolve(import.meta.dirname, 'project.html'),
      },
    },
  },
})
