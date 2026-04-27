import { Link } from 'react-router-dom'

export default function Navbar() {
    return (
        <nav style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '0 24px', height: '56px',
            background: '#161b22', borderBottom: '1px solid #30363d'
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '20px' }}>🚨</span>
                <span style={{ fontWeight: 700, fontSize: '18px', color: '#fff' }}>PulseAid</span>
            </div>
            <div style={{ display: 'flex', gap: '24px' }}>
                <Link to="/" style={{ color: '#cdd9e5', textDecoration: 'none', fontSize: '14px' }}>Risk Map</Link>
                <Link to="/dashboard" style={{ color: '#cdd9e5', textDecoration: 'none', fontSize: '14px' }}>NGO Dashboard</Link>
            </div>
        </nav>
    )
}