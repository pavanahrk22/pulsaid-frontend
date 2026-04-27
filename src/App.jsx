import { Routes, Route } from 'react-router-dom'
import MapView from './pages/MapView'
import Dashboard from './pages/Dashboard'
import History from './pages/History'
import Navbar from './components/Navbar'

export default function App() {
  return (
    <div style={{ fontFamily: 'Inter, sans-serif' }}>
      <Navbar />
      <Routes>
        <Route path="/" element={<MapView />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/history" element={<History />} />
      </Routes>
    </div>
  )
}