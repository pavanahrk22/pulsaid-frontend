import { useState } from 'react'
import zones from '../zones.json'

const BACKEND = import.meta.env.VITE_BACKEND_URL

const VOLUNTEERS = [
    'Anjali Sharma', 'Ravi Kumar', 'Priya Nair', 'Mohammed Irfan',
    'Deepa Menon', 'Karthik Rao', 'Sunita Reddy', 'Arjun Patel',
    'Meena Iyer', 'Suresh Babu'
]

function getRiskBadge(risk) {
    if (risk >= 75) return { label: 'CRITICAL', color: '#ef4444', bg: '#450a0a' }
    if (risk >= 50) return { label: 'HIGH', color: '#f97316', bg: '#431407' }
    return { label: 'MODERATE', color: '#eab308', bg: '#422006' }
}

export default function Dashboard() {
    const [briefs, setBriefs] = useState({})
    const [loadingBrief, setLoadingBrief] = useState({})
    const [assignments, setAssignments] = useState({})
    const [statuses, setStatuses] = useState({})

    async function generateBrief(zone) {
        setLoadingBrief(p => ({ ...p, [zone.name]: true }))
        try {
            const res = await fetch(`${BACKEND}/brief`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    zone_name: zone.name,
                    weather_score: zone.weather,
                    employment_stress: zone.employment,
                    hospital_trend: zone.hospital,
                    sentiment_score: zone.sentiment
                })
            })
            const data = await res.json()
            setBriefs(p => ({ ...p, [zone.name]: data.brief || JSON.stringify(data) }))
        } catch {
            setBriefs(p => ({ ...p, [zone.name]: 'Failed to generate brief.' }))
        }
        setLoadingBrief(p => ({ ...p, [zone.name]: false }))
    }

    function assign(zoneName, volunteer) {
        setAssignments(p => ({ ...p, [zoneName]: volunteer }))
        setStatuses(p => ({ ...p, [zoneName]: 'dispatched' }))
    }

    const sorted = [...zones].sort((a, b) => b.risk - a.risk)

    return (
        <div style={{ padding: '32px', maxWidth: '1100px', margin: '0 auto' }}>
            <h1 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '4px' }}>
                🧭 NGO Coordinator Dashboard
            </h1>
            <p style={{ color: '#8b949e', marginBottom: '32px', fontSize: '14px' }}>
                Real-time flagged zones — generate briefs and dispatch volunteers
            </p>

            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                <thead>
                    <tr style={{ borderBottom: '1px solid #30363d', color: '#8b949e', textAlign: 'left' }}>
                        <th style={{ padding: '10px 12px' }}>Zone</th>
                        <th style={{ padding: '10px 12px' }}>Risk</th>
                        <th style={{ padding: '10px 12px' }}>AI Brief</th>
                        <th style={{ padding: '10px 12px' }}>Assign Volunteer</th>
                        <th style={{ padding: '10px 12px' }}>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {sorted.map(zone => {
                        const badge = getRiskBadge(zone.risk)
                        const status = statuses[zone.name] || 'pending'
                        return (
                            <tr key={zone.name} style={{ borderBottom: '1px solid #21262d' }}>
                                <td style={{ padding: '14px 12px', fontWeight: 600 }}>{zone.name}</td>
                                <td style={{ padding: '14px 12px' }}>
                                    <span style={{
                                        background: badge.bg, color: badge.color,
                                        padding: '3px 10px', borderRadius: '999px', fontSize: '12px', fontWeight: 700
                                    }}>
                                        {badge.label} {zone.risk}
                                    </span>
                                </td>
                                <td style={{ padding: '14px 12px', maxWidth: '300px' }}>
                                    {briefs[zone.name] ? (
                                        <span style={{ color: '#cdd9e5', fontSize: '13px' }}>{briefs[zone.name]}</span>
                                    ) : (
                                        <button
                                            onClick={() => generateBrief(zone)}
                                            disabled={loadingBrief[zone.name]}
                                            style={{
                                                background: '#1f6feb', color: '#fff', border: 'none',
                                                borderRadius: '6px', padding: '6px 12px', cursor: 'pointer', fontSize: '12px'
                                            }}
                                        >
                                            {loadingBrief[zone.name] ? 'Generating...' : '✨ Generate Brief'}
                                        </button>
                                    )}
                                </td>
                                <td style={{ padding: '14px 12px' }}>
                                    <select
                                        value={assignments[zone.name] || ''}
                                        onChange={e => assign(zone.name, e.target.value)}
                                        style={{
                                            background: '#0d1117', color: '#cdd9e5', border: '1px solid #30363d',
                                            borderRadius: '6px', padding: '6px 10px', fontSize: '13px', cursor: 'pointer'
                                        }}
                                    >
                                        <option value="">Select volunteer</option>
                                        {VOLUNTEERS.map(v => <option key={v} value={v}>{v}</option>)}
                                    </select>
                                </td>
                                <td style={{ padding: '14px 12px' }}>
                                    <span style={{
                                        color: status === 'dispatched' ? '#22c55e' : '#8b949e',
                                        fontWeight: 600, fontSize: '13px'
                                    }}>
                                        {status === 'dispatched' ? '✅ Dispatched' : '⏳ Pending'}
                                    </span>
                                </td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </div>
    )
}