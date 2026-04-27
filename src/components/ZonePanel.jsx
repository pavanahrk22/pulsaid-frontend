import { useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'

const BACKEND = import.meta.env.VITE_BACKEND_URL

export default function ZonePanel({ zone, onClose }) {
    const [analysis, setAnalysis] = useState(null)
    const [loading, setLoading] = useState(false)

    const signals = [
        { name: 'Weather', value: zone.weather },
        { name: 'Employment', value: zone.employment },
        { name: 'Hospital', value: zone.hospital },
        { name: 'Sentiment', value: zone.sentiment },
    ]

    const getBarColor = (v) => v >= 75 ? '#ef4444' : v >= 50 ? '#f97316' : '#22c55e'

    async function getAnalysis() {
        setLoading(true)
        try {
            const res = await fetch(`${BACKEND}/explain`, {
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
            setAnalysis(data.explanation || data.brief || JSON.stringify(data))
        } catch {
            setAnalysis('Failed to fetch analysis. Try again.')
        }
        setLoading(false)
    }

    return (
        <div style={{
            width: '360px', background: '#161b22', borderLeft: '1px solid #30363d',
            padding: '24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px'
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ fontSize: '18px', fontWeight: 700 }}>{zone.name}</h2>
                <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#fff', fontSize: '20px', cursor: 'pointer' }}>×</button>
            </div>

            <div style={{
                background: '#0d1117', borderRadius: '8px', padding: '12px', textAlign: 'center'
            }}>
                <div style={{ fontSize: '12px', color: '#8b949e' }}>Risk Score</div>
                <div style={{ fontSize: '48px', fontWeight: 800, color: zone.risk >= 75 ? '#ef4444' : zone.risk >= 50 ? '#f97316' : '#eab308' }}>
                    {zone.risk}
                </div>
            </div>

            <div>
                <div style={{ fontSize: '13px', color: '#8b949e', marginBottom: '8px' }}>Signal Breakdown</div>
                <ResponsiveContainer width="100%" height={140}>
                    <BarChart data={signals} layout="vertical">
                        <XAxis type="number" domain={[0, 100]} hide />
                        <YAxis type="category" dataKey="name" tick={{ fill: '#cdd9e5', fontSize: 12 }} width={80} />
                        <Tooltip />
                        <Bar dataKey="value" radius={4}>
                            {signals.map((s, i) => (
                                <Cell key={i} fill={getBarColor(s.value)} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>

            <button
                onClick={getAnalysis}
                disabled={loading}
                style={{
                    background: '#1f6feb', color: '#fff', border: 'none', borderRadius: '8px',
                    padding: '10px', fontWeight: 600, cursor: 'pointer', fontSize: '14px'
                }}
            >
                {loading ? 'Analysing...' : '🤖 Get AI Analysis'}
            </button>

            {analysis && (
                <div style={{
                    background: '#0d1117', borderRadius: '8px', padding: '12px',
                    fontSize: '13px', color: '#cdd9e5', lineHeight: 1.6
                }}>
                    {analysis}
                </div>
            )}
        </div>
    )
}