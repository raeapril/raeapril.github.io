import { useState, useRef } from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Stats } from '@react-three/drei'

import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Contact from './Contact'

function RotatingBox() {
    const ref = useRef()
    useFrame((_, delta) => {
        ref.current.rotation.y += delta * 0.8
    })
    return (
        <mesh ref={ref} castShadow position={[0, 0.5, 0]}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color="#00bcd4" metalness={0.2} roughness={0.6} />
        </mesh>
    )
}

function Home() {
    const [count, setCount] = useState(0)
    return (
        <>
            <div id="wrap">
                <section>
                    <div className="inner">
                        <a href="https://vite.dev" target="_blank" rel="noreferrer">
                            <img src={viteLogo} className="logo" alt="Vite logo" />
                        </a>
                        <a href="https://react.dev" target="_blank" rel="noreferrer">
                            <img src={reactLogo} className="logo react" alt="React logo" />
                        </a>
                    </div>
                </section>
                <section>
                    <h1 className="text-3xl font-bold text-blue-200">포트폴리오</h1>
                    <h1 className="text-3xl font-bold text-main-blue">포트폴리오</h1>
                    <div className="card">
                        <button onClick={() => setCount((count) => count + 1)}>
                            count is {count}
                        </button>
                        <p>
                            Edit <code>src/App.jsx</code> and save to test HMR
                        </p>
                    </div>
                    <p className="read-the-docs">
                        Click on the Vite and React logos to learn more
                    </p>
                    <Link className="read-the-docs" to="/contact">
                        컨텍페이지
                    </Link>
                </section>
                <section>
                    <div style={{ width: '100vw', height: '100vh' }}>
                        <Canvas
                            shadows
                            camera={{ fov: 60, position: [3, 2, 5] }}
                            gl={{ antialias: true }}
                        >
                            {/* 배경색 */}
                            <color attach="background" args={['#111111']} />

                            {/* 라이트 */}
                            <ambientLight intensity={0.4} />
                            <directionalLight position={[3, 5, 2]} castShadow intensity={1} />

                            {/* 바닥 */}
                            <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
                                <planeGeometry args={[20, 20]} />
                                <meshStandardMaterial color="#222222" />
                            </mesh>

                            {/* 박스 */}
                            <RotatingBox />

                            {/* 컨트롤/디버그 */}
                            <OrbitControls enableDamping />
                            <Stats />
                        </Canvas>
                    </div>
                </section>
            </div>
        </>
    )
}

function App() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/contact" element={<Contact />} />
        </Routes>
    )
}

export default App
