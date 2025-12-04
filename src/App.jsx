import { Routes, Route, Link } from 'react-router-dom'

import './App.css'
import Home from './Home'
import Contact from './Contact'

function App() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/contact" element={<Contact />} />
        </Routes>
    )
}

export default App
