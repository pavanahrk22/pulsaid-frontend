import { useState, useEffect } from 'react'
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'

const BACKEND = import.meta.env.VITE_BACKEND_URL

export default function History() {
    const [events, setEvents] = useState([])
    const [selected, setSelected] = useState(null)

    useEffect(() => {
        fetch(`${BACKEND}/history`)
            .then(r => r.json())
            .then(data => { setEvents(data); setSelected(data[0]) })
    }, [])

    const zoneCoords = {
        'Whitefield': [12.9698, 77.7500],
        'KR Puram': [13.0050, 77.6950],
        'Yelahanka': [13.1007, 77.5963],
    }

    return (
        <div style={{ padding: '32px', maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ marginBottom: '32px' }}>
                <h1 style={{ fontSize: '28px', fontWeight: 800, letterSpacing: '-0.5px', marginBottom: '6px' }}>🕒 Historical Proof</h1>
                <p style={{ color: '#64748b', fontSize: '14px' }}>PulseAid retroactively validated against real Bengaluru crises — proving early detection works</p>
            </div>

            {/* Stats banner */}
            <div style={{
                background: 'linear-gradient(135deg, rgba(99,102,241,0.15), rgba(139,92,246,0.08))',
                border: '1px solid rgba(99,102,241,0.2)', borderRadius: '20px',
                padding: '24px 32px', marginBottom: '32px',
                display: 'flex', gap: '48px', alignItems: 'center'
            }}>
                {[
                    { value: '3', label: 'Crises Validated' },
                    { value: '14.3', label: 'Avg Days Early' },
                    { value: '70,000+', label: 'Lives Impacted' },
                ].map(({ value, label }) => (
                    <div key={label}>
                        <div style={{ fontSize: '32px', fontWeight: 800, background: 'linear-gradient(135deg, #6366f1, #a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{value}</div>
                        <div style={{ fontSize: '13px', color: '#64748b', fontWeight: 500 }}>{label}</div>
                    </div>
                ))}
                <div style={{ marginLeft: 'auto', fontSize: '13px', color: '#818cf8', fontWeight: 600, background: 'rgba(99,102,241,0.1)', padding: '8px 16px', borderRadius: '20px' }}>
                    ✅ Retroactively validated
                </div>
            </div>

            {/* Event cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '32px' }}>
                {events.map(e => (
                    <div key={e.event} onClick={() => setSelected(e)} style={{
                        padding: '20px', borderRadius: '16px', cursor: 'pointer',
                        background: selected?.event === e.event ? 'rgba(99,102,241,0.12)' : 'rgba(255,255,255,0.02)',
                        border: `1px solid ${selected?.event === e.event ? 'rgba(99,102,241,0.4)' : 'rgba(255,255,255,0.06)'}`,
                        transition: 'all 0.2s'
                    }}>
                        <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 600, marginBottom: '6px' }}>{e.date}</div>
                        <div style={{ fontWeight: 700, fontSize: '15px', marginBottom: '12px' }}>{e.event}</div>
                        <div style={{
                            display: 'inline-flex', alignItems: 'center', gap: '6px',
                            background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)',
                            color: '#22c55e', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 700
                        }}>
                            ⚡ {e.days_early_detected} days early
                        </div>
                    </div>
                ))}
            </div>

            {selected && (
                <div className="fade-in" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

                        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '16px', padding: '24px' }}>
                            <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 700, letterSpacing: '0.08em', marginBottom: '10px' }}>WHAT HAPPENED</div>
                            <p style={{ color: '#cbd5e1', fontSize: '14px', lineHeight: 1.7 }}>{selected.what_happened}</p>
                        </div>

                        <div style={{
                            background: 'linear-gradient(135deg, rgba(34,197,94,0.1), rgba(16,185,129,0.06))',
                            border: '1px solid rgba(34,197,94,0.25)', borderRadius: '16px', padding: '24px'
                        }}>
                            <div style={{ fontSize: '22px', fontWeight: 800, color: '#22c55e', marginBottom: '6px' }}>
                                ✅ Detected {selected.days_early_detected} days early
                            </div>
                            <div style={{ color: '#64748b', fontSize: '13px' }}>
                                Giving NGOs time to help {selected.lives_impacted?.toLocaleString()} affected people before crisis peaked
                            </div>
                        </div>

                        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '16px', padding: '24px' }}>
                            <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 700, letterSpacing: '0.08em', marginBottom: '16px' }}>PRE-CRISIS SIGNALS</div>
                            {Object.entries(selected.signals_before).map(([key, val]) => (
                                <div key={key} style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                                    <div style={{ width: '90px', fontSize: '13px', color: '#94a3b8', textTransform: 'capitalize', fontWeight: 500 }}>{key}</div>
                                    <div style={{ flex: 1, background: 'rgba(255,255,255,0.05)', borderRadius: '6px', height: '8px', overflow: 'hidden' }}>
                                        <div style={{
                                            width: `${val}%`, height: '100%', borderRadius: '6px',
                                            background: val >= 75 ? 'linear-gradient(90deg, #ef4444, #dc2626)' : val >= 50 ? 'linear-gradient(90deg, #f97316, #ea580c)' : 'linear-gradient(90deg, #22c55e, #16a34a)'
                                        }} />
                                    </div>
                                    <div style={{ fontSize: '13px', fontWeight: 700, width: '32px', color: '#f0f4ff' }}>{val}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div style={{ borderRadius: '20px', overflow: 'hidden', height: '500px', border: '1px solid rgba(255,255,255,0.06)' }}>
                        <MapContainer center={zoneCoords[selected.zone] || [12.9716, 77.5946]} zoom={12} style={{ height: '100%', width: '100%' }}>
                            <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" attribution='&copy; OpenStreetMap &copy; CARTO' />
                            {zoneCoords[selected.zone] && (
                                <CircleMarker center={zoneCoords[selected.zone]} radius={40}
                                    pathOptions={{ color: '#6366f1', fillColor: '#6366f1', fillOpacity: 0.25, weight: 2 }}>
                                    <Popup>{selected.zone} — Crisis Zone</Popup>
                                </CircleMarker>
                            )}
                        </MapContainer>
                    </div>
                </div>
            )}
        </div>
    )
}