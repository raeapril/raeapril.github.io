import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'lenis/dist/lenis.css'
import './styles/site.css'
import ProjectDetail from './pages/ProjectDetail.jsx'

// 상세 페이지는 해시(#rz)로 프로젝트를 고른다. 새로고침해도 맨 위에서 시작
if ('scrollRestoration' in window.history) {
  window.history.scrollRestoration = 'manual'
}
window.scrollTo(0, 0)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ProjectDetail />
  </StrictMode>,
)
