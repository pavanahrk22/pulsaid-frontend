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

    const riskColor = zone.risk >= 75 ? '#ef4444' : zone.risk >= 50 ? '#f97316' : '#eab308'
    const riskGradient = zone.risk >= 75 ? 'linear-gradient(135deg, #ef4444, #dc2626)' : zone.risk >= 50 ? 'linear-gradient(135deg, #f97316, #ea580c)' : 'linear-gradient(135deg, #eab308, #ca8a04)'
    const getBarColor = (v) => v >= 75 ? '#ef4444' : v >= 50 ? '#f97316' : '#22c55e'

    async function getAnalysis() {
        setLoading(true)
        setAnalysis(null)
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
            setAnalysis(data)
        } catch {
            setAnalysis({ summary: 'Failed to fetch analysis. Try again.' })
        }
        setLoading(false)
    }

    return (
        <div className="fade-in" style={{
            width: '390px', background: '#0d1117',
            borderLeft: '1px solid rgba(255,255,255,0.06)',
            display: 'flex', flexDirection: 'column',
            overflowY: 'auto', height: 'calc(100vh - 64px)'
        }}>
            {/* Header */}
            <div style={{
                padding: '24px',
                background: 'linear-gradient(135deg, rgba(99,102,241,0.15), rgba(139,92,246,0.08))',
                borderBottom: '1px solid rgba(255,255,255,0.06)'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                        <div style={{ fontSize: '11px', color: '#6366f1', fontWeight: 700, letterSpacing: '0.1em', marginBottom: '6px' }}>📍 ZONE ANALYSIS</div>
                        <h2 style={{ fontSize: '24px', fontWeight: 800, letterSpacing: '-0.5px', marginBottom: '8px' }}>{zone.name}</h2>
                        <span style={{
                            fontSize: '11px', fontWeight: 700, padding: '4px 10px', borderRadius: '20px',
                            background: zone.risk >= 75 ? 'rgba(239,68,68,0.15)' : zone.risk >= 50 ? 'rgba(249,115,22,0.15)' : 'rgba(234,179,8,0.15)',
                            color: riskColor, border: `1px solid ${riskColor}40`
                        }}>
                            {zone.risk >= 75 ? '🔴 CRITICAL' : zone.risk >= 50 ? '🟠 HIGH RISK' : '🟡 MODERATE'}
                        </span>
                    </div>
                    <button onClick={onClose} style={{
                        background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
                        color: '#94a3b8', width: '36px', height: '36px', borderRadius: '10px',
                        cursor: 'pointer', fontSize: '18px'
                    }}>×</button>
                </div>
            </div>

            {/* Risk Score */}
            <div style={{ padding: '24px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <div style={{
                    borderRadius: '16px', padding: '24px', textAlign: 'center',
                    background: 'linear-gradient(135deg, rgba(99,102,241,0.08), rgba(139,92,246,0.04))',
                    border: '1px solid rgba(99,102,241,0.15)'
                }}>
                    <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 600, letterSpacing: '0.08em', marginBottom: '8px' }}>RISK SCORE</div>
                    <div style={{
                        fontSize: '80px', fontWeight: 800, lineHeight: 1, letterSpacing: '-4px',
                        background: riskGradient, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
                    }}>{zone.risk}</div>
                    <div style={{ marginTop: '12px', height: '6px', background: 'rgba(255,255,255,0.06)', borderRadius: '3px' }}>
                        <div style={{ width: `${zone.risk}%`, height: '100%', borderRadius: '3px', background: riskGradient }} />
                    </div>
                </div>
            </div>

            {/* Signals */}
            <div style={{ padding: '24px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 700, letterSpacing: '0.08em', marginBottom: '16px' }}>📊 SIGNAL BREAKDOWN</div>
                <ResponsiveContainer width="100%" height={150}>
                    <BarChart data={signals} layout="vertical" margin={{ left: 0, right: 20 }}>
                        <XAxis type="number" domain={[0, 100]} hide />
                        <YAxis type="category" dataKey="name" tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 500 }} width={85} />
                        <Tooltip contentStyle={{ background: '#161b22', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', fontSize: '13px' }} cursor={{ fill: 'rgba(255,255,255,0.02)' }} />
                        <Bar dataKey="value" radius={[0, 6, 6, 0]}>
                            {signals.map((s, i) => <Cell key={i} fill={getBarColor(s.value)} />)}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* AI */}
            <div style={{ padding: '24px', flex: 1 }}>
                <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 700, letterSpacing: '0.08em', marginBottom: '16px' }}>🤖 GEMINI AI ANALYSIS</div>

                <button onClick={getAnalysis} disabled={loading} style={{
                    width: '100%', padding: '13px',
                    background: loading ? 'rgba(255,255,255,0.04)' : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                    color: '#fff', border: loading ? '1px solid rgba(255,255,255,0.08)' : 'none',
                    borderRadius: '12px', fontWeight: 700, fontSize: '14px',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    boxShadow: loading ? 'none' : '0 4px 24px rgba(99,102,241,0.4)',
                    transition: 'all 0.2s', marginBottom: '16px'
                }}>
                    {loading ? '⏳ Gemini is thinking...' : '✨ Get AI Analysis'}
                </button>

                {loading && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {[100, 80, 60].map((w, i) => (
                            <div key={i} style={{
                                height: '14px', width: `${w}%`, borderRadius: '6px',
                                background: 'linear-gradient(90deg, #161b22 25%, #1f2937 50%, #161b22 75%)',
                                backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite'
                            }} />
                        ))}
                    </div>
                )}

                {analysis && (
                    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <div style={{
                            background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)',
                            borderRadius: '12px', padding: '16px', fontSize: '14px',
                            color: '#e2e8f0', lineHeight: 1.7
                        }}>{analysis.summary}</div>

                        {analysis.risk_type && (
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                                {[
                                    { label: 'Crisis Type', value: analysis.risk_type, icon: '⚠️' },
                                    { label: 'Timeframe', value: analysis.timeframe, icon: '⏱️' },
                                    { label: 'Volunteers', value: analysis.volunteers_needed, icon: '👥' },
                                    { label: 'Confidence', value: `${analysis.confidence}%`, icon: '🎯' },
                                ].map(({ label, value, icon }) => (
                                    <div key={label} style={{
                                        background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)',
                                        borderRadius: '10px', padding: '12px'
                                    }}>
                                        <div style={{ fontSize: '16px', marginBottom: '4px' }}>{icon}</div>
                                        <div style={{ fontSize: '10px', color: '#64748b', fontWeight: 600, letterSpacing: '0.06em', marginBottom: '2px' }}>{label.toUpperCase()}</div>
                                        <div style={{ fontSize: '13px', fontWeight: 700, color: '#f0f4ff', textTransform: 'capitalize' }}>{value}</div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}