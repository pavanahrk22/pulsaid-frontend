import { Link, useLocation } from 'react-router-dom'

export default function Navbar() {
    const { pathname } = useLocation()

    const links = [
        { to: '/', label: 'Risk Map' },
        { to: '/dashboard', label: 'NGO Dashboard' },
        { to: '/history', label: 'Historical Proof' },
    ]

    return (
        <nav style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '0 32px', height: '64px',
            background: 'rgba(10,15,30,0.9)',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
            backdropFilter: 'blur(20px)',
            position: 'sticky', top: 0, zIndex: 1000,
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                    width: '36px', height: '36px', borderRadius: '10px',
                    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '18px', boxShadow: '0 0 20px rgba(99,102,241,0.4)'
                }}>🚨</div>
                <span style={{ fontWeight: 800, fontSize: '20px', letterSpacing: '-0.5px' }}>
                    Pulse<span style={{ background: 'linear-gradient(135deg, #6366f1, #a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Aid</span>
                </span>
                <span style={{
                    fontSize: '10px', fontWeight: 700, color: '#22c55e',
                    background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)',
                    padding: '2px 8px', borderRadius: '20px', letterSpacing: '0.08em'
                }}>● LIVE</span>
            </div>

            <div style={{ display: 'flex', gap: '4px', background: 'rgba(255,255,255,0.04)', padding: '4px', borderRadius: '12px' }}>
                {links.map(({ to, label }) => (
                    <Link key={to} to={to} style={{
                        color: pathname === to ? '#fff' : '#94a3b8',
                        textDecoration: 'none', fontSize: '13px', fontWeight: 600,
                        padding: '7px 16px', borderRadius: '8px',
                        background: pathname === to ? 'linear-gradient(135deg, #6366f1, #8b5cf6)' : 'transparent',
                        boxShadow: pathname === to ? '0 2px 12px rgba(99,102,241,0.4)' : 'none',
                        transition: 'all 0.2s'
                    }}>{label}</Link>
                ))}
            </div>
        </nav>
    )
}