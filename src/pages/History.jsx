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
        <div style={{ padding: '32px', maxWidth: '1100px', margin: '0 auto' }}>
            <h1 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '4px' }}>
                🕒 Historical Proof
            </h1>
            <p style={{ color: '#8b949e', marginBottom: '32px', fontSize: '14px' }}>
                PulseAid retroactively validated against real Bengaluru crises
            </p>

            <div style={{ display: 'flex', gap: '24px', marginBottom: '32px' }}>
                {events.map(e => (
                    <div
                        key={e.event}
                        onClick={() => setSelected(e)}
                        style={{
                            flex: 1, padding: '16px', borderRadius: '12px', cursor: 'pointer',
                            background: selected?.event === e.event ? '#1f6feb22' : '#161b22',
                            border: `1px solid ${selected?.event === e.event ? '#1f6feb' : '#30363d'}`,
                        }}
                    >
                        <div style={{ fontSize: '12px', color: '#8b949e', marginBottom: '4px' }}>{e.date}</div>
                        <div style={{ fontWeight: 600, fontSize: '14px', marginBottom: '4px' }}>{e.event}</div>
                        <div style={{ color: '#22c55e', fontWeight: 700, fontSize: '13px' }}>
                            ⚡ Detected {e.days_early_detected} days early
                        </div>
                    </div>
                ))}
            </div>

            {selected && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                    <div>
                        <div style={{ background: '#161b22', border: '1px solid #30363d', borderRadius: '12px', padding: '20px', marginBottom: '16px' }}>
                            <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '12px' }}>What happened</h3>
                            <p style={{ color: '#cdd9e5', fontSize: '14px', lineHeight: 1.6 }}>{selected.what_happened}</p>
                        </div>

                        <div style={{ background: '#0d1117', border: '1px solid #238636', borderRadius: '12px', padding: '20px', marginBottom: '16px' }}>
                            <div style={{ color: '#22c55e', fontWeight: 700, fontSize: '20px', marginBottom: '4px' }}>
                                ✅ PulseAid would have flagged this {selected.days_early_detected} days earlier
                            </div>
                            <div style={{ color: '#8b949e', fontSize: '13px' }}>
                                Giving NGOs time to pre-position {selected.lives_impacted?.toLocaleString()} affected people
                            </div>
                        </div>

                        <div style={{ background: '#161b22', border: '1px solid #30363d', borderRadius: '12px', padding: '20px' }}>
                            <h3 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '12px' }}>Pre-crisis signals</h3>
                            {Object.entries(selected.signals_before).map(([key, val]) => (
                                <div key={key} style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
                                    <div style={{ width: '90px', fontSize: '13px', color: '#8b949e', textTransform: 'capitalize' }}>{key}</div>
                                    <div style={{ flex: 1, background: '#21262d', borderRadius: '4px', height: '8px' }}>
                                        <div style={{ width: `${val}%`, height: '100%', borderRadius: '4px', background: val >= 75 ? '#ef4444' : val >= 50 ? '#f97316' : '#22c55e' }} />
                                    </div>
                                    <div style={{ fontSize: '13px', fontWeight: 600, width: '30px' }}>{val}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div style={{ borderRadius: '12px', overflow: 'hidden', height: '450px' }}>
                        <MapContainer
                            center={zoneCoords[selected.zone] || [12.9716, 77.5946]}
                            zoom={12}
                            style={{ height: '100%', width: '100%' }}
                        >
                            <TileLayer
                                url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                                attribution='&copy; OpenStreetMap &copy; CARTO'
                            />
                            {zoneCoords[selected.zone] && (
                                <CircleMarker
                                    center={zoneCoords[selected.zone]}
                                    radius={30}
                                    pathOptions={{ color: '#ef4444', fillColor: '#ef4444', fillOpacity: 0.4 }}
                                >
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