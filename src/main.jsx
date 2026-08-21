import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import 'lenis/dist/lenis.css'
import './index.css'
import App from './App.jsx'

// 새로고침 시 브라우저의 스크롤 위치 복원을 끄고 항상 최상단에서 시작한다.
// (스크롤-구동 히어로가 복원된 위치의 프레임으로 뜨는 문제 방지 — React 마운트보다 먼저 실행)
if ('scrollRestoration' in window.history) {
  window.history.scrollRestoration = 'manual'
}
window.scrollTo(0, 0)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
