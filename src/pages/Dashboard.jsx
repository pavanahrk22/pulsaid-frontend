import { useState } from 'react'
import zones from '../zones.json'

const BACKEND = import.meta.env.VITE_BACKEND_URL

const VOLUNTEERS = [
    'Anjali Sharma', 'Ravi Kumar', 'Priya Nair', 'Mohammed Irfan',
    'Deepa Menon', 'Karthik Rao', 'Sunita Reddy', 'Arjun Patel',
    'Meena Iyer', 'Suresh Babu'
]

function getRiskConfig(risk) {
    if (risk >= 75) return { label: 'CRITICAL', color: '#ef4444', bg: 'rgba(239,68,68,0.12)', border: 'rgba(239,68,68,0.3)' }
    if (risk >= 50) return { label: 'HIGH', color: '#f97316', bg: 'rgba(249,115,22,0.12)', border: 'rgba(249,115,22,0.3)' }
    return { label: 'MODERATE', color: '#eab308', bg: 'rgba(234,179,8,0.12)', border: 'rgba(234,179,8,0.3)' }
}

export default function Dashboard() {
    const [briefs, setBriefs] = useState({})
    const [loading, setLoading] = useState({})
    const [assignments, setAssignments] = useState({})
    const [statuses, setStatuses] = useState({})

    const sorted = [...zones].sort((a, b) => b.risk - a.risk)
    const critical = sorted.filter(z => z.risk >= 75).length
    const high = sorted.filter(z => z.risk >= 50 && z.risk < 75).length

    async function generateBrief(zone) {
        setLoading(p => ({ ...p, [zone.name]: true }))
        try {
            const res = await fetch(`${BACKEND}/brief`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ zone_name: zone.name, weather_score: zone.weather, employment_stress: zone.employment, hospital_trend: zone.hospital, sentiment_score: zone.sentiment })
            })
            const data = await res.json()
            setBriefs(p => ({ ...p, [zone.name]: data.brief }))
        } catch {
            setBriefs(p => ({ ...p, [zone.name]: 'Failed to generate brief.' }))
        }
        setLoading(p => ({ ...p, [zone.name]: false }))
    }

    function assign(zoneName, volunteer) {
        setAssignments(p => ({ ...p, [zoneName]: volunteer }))
        setStatuses(p => ({ ...p, [zoneName]: 'dispatched' }))
    }

    return (
        <div style={{ padding: '32px', maxWidth: '1200px', margin: '0 auto' }}>

            {/* Header */}
            <div style={{ marginBottom: '32px' }}>
                <h1 style={{ fontSize: '28px', fontWeight: 800, letterSpacing: '-0.5px', marginBottom: '6px' }}>
                    🧭 NGO Coordinator Dashboard
                </h1>
                <p style={{ color: '#64748b', fontSize: '14px' }}>Real-time crisis management — generate AI briefs and dispatch volunteers</p>
            </div>

            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '32px' }}>
                {[
                    { label: 'Total Zones', value: sorted.length, icon: '🗺️', color: '#6366f1' },
                    { label: 'Critical Zones', value: critical, icon: '🔴', color: '#ef4444' },
                    { label: 'High Risk', value: high, icon: '🟠', color: '#f97316' },
                ].map(({ label, value, icon, color }) => (
                    <div key={label} style={{
                        background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)',
                        borderRadius: '16px', padding: '20px',
                    }}>
                        <div style={{ fontSize: '28px', marginBottom: '8px' }}>{icon}</div>
                        <div style={{ fontSize: '32px', fontWeight: 800, color, marginBottom: '4px' }}>{value}</div>
                        <div style={{ fontSize: '13px', color: '#64748b', fontWeight: 500 }}>{label}</div>
                    </div>
                ))}
            </div>

            {/* Table */}
            <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '20px', overflow: 'hidden' }}>
                <div style={{ padding: '20px 24px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '14px', fontWeight: 700 }}>Flagged Zones</span>
                    <span style={{ fontSize: '11px', background: 'rgba(99,102,241,0.15)', color: '#818cf8', padding: '2px 8px', borderRadius: '20px', fontWeight: 600 }}>{sorted.length} zones</span>
                </div>

                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                            {['Zone', 'Risk Level', 'AI Brief', 'Assign Volunteer', 'Status'].map(h => (
                                <th key={h} style={{ padding: '12px 24px', color: '#64748b', fontWeight: 600, fontSize: '12px', letterSpacing: '0.06em', textAlign: 'left' }}>{h.toUpperCase()}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {sorted.map(zone => {
                            const cfg = getRiskConfig(zone.risk)
                            const status = statuses[zone.name] || 'pending'
                            return (
                                <tr key={zone.name} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)', transition: 'background 0.15s' }}
                                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                                >
                                    <td style={{ padding: '16px 24px', fontWeight: 700, fontSize: '15px' }}>{zone.name}</td>
                                    <td style={{ padding: '16px 24px' }}>
                                        <span style={{
                                            background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}`,
                                            padding: '4px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: 700, letterSpacing: '0.06em'
                                        }}>{cfg.label} {zone.risk}</span>
                                    </td>
                                    <td style={{ padding: '16px 24px', maxWidth: '280px' }}>
                                        {briefs[zone.name] ? (
                                            <div style={{ fontSize: '12px', color: '#94a3b8', lineHeight: 1.6, background: 'rgba(99,102,241,0.06)', padding: '8px 12px', borderRadius: '8px', border: '1px solid rgba(99,102,241,0.15)' }}>
                                                {briefs[zone.name]}
                                            </div>
                                        ) : (
                                            <button onClick={() => generateBrief(zone)} disabled={loading[zone.name]} style={{
                                                background: loading[zone.name] ? 'rgba(255,255,255,0.04)' : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                                                color: '#fff', border: 'none', borderRadius: '8px',
                                                padding: '7px 14px', cursor: 'pointer', fontSize: '12px', fontWeight: 600,
                                                boxShadow: loading[zone.name] ? 'none' : '0 2px 12px rgba(99,102,241,0.3)'
                                            }}>
                                                {loading[zone.name] ? '⏳ Generating...' : '✨ Generate Brief'}
                                            </button>
                                        )}
                                    </td>
                                    <td style={{ padding: '16px 24px' }}>
                                        <select value={assignments[zone.name] || ''} onChange={e => assign(zone.name, e.target.value)} style={{
                                            background: '#0d1117', color: '#e2e8f0',
                                            border: '1px solid rgba(255,255,255,0.1)',
                                            borderRadius: '8px', padding: '7px 12px', fontSize: '13px', cursor: 'pointer',
                                            outline: 'none'
                                        }}>
                                            <option value="">Select volunteer</option>
                                            {VOLUNTEERS.map(v => <option key={v} value={v}>{v}</option>)}
                                        </select>
                                    </td>
                                    <td style={{ padding: '16px 24px' }}>
                                        <span style={{
                                            color: status === 'dispatched' ? '#22c55e' : '#64748b',
                                            fontWeight: 600, fontSize: '13px',
                                            display: 'flex', alignItems: 'center', gap: '6px'
                                        }}>
                                            <span style={{
                                                width: '8px', height: '8px', borderRadius: '50%',
                                                background: status === 'dispatched' ? '#22c55e' : '#64748b',
                                                display: 'inline-block'
                                            }} />
                                            {status === 'dispatched' ? 'Dispatched' : 'Pending'}
                                        </span>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    )
}