import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  // GitHub Pages 프로젝트 저장소라 raeapril.github.io/raeapril-3d/ 하위 경로로 배포된다.
  base: '/raeapril-3d/',
  plugins: [react()],
})
