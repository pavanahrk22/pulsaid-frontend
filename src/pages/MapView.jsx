import { useState } from 'react'
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import zones from '../zones.json'
import ZonePanel from '../components/ZonePanel'

function getRiskColor(risk) {
    if (risk >= 75) return '#ef4444'
    if (risk >= 50) return '#f97316'
    return '#eab308'
}

export default function MapView() {
    const [selectedZone, setSelectedZone] = useState(null)

    return (
        <div style={{ display: 'flex', height: 'calc(100vh - 56px)' }}>
            <div style={{ flex: 1 }}>
                <MapContainer
                    center={[12.9716, 77.5946]}
                    zoom={11}
                    style={{ height: '100%', width: '100%' }}
                >
                    <TileLayer
                        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                        attribution='&copy; OpenStreetMap &copy; CARTO'
                    />
                    {zones.map(zone => (
                        <CircleMarker
                            key={zone.name}
                            center={[zone.lat, zone.lng]}
                            radius={zone.risk / 6}
                            pathOptions={{
                                color: getRiskColor(zone.risk),
                                fillColor: getRiskColor(zone.risk),
                                fillOpacity: 0.5
                            }}
                            eventHandlers={{ click: () => setSelectedZone(zone) }}
                        >
                            <Popup>{zone.name} — Risk: {zone.risk}</Popup>
                        </CircleMarker>
                    ))}
                </MapContainer>
            </div>
            {selectedZone && (
                <ZonePanel zone={selectedZone} onClose={() => setSelectedZone(null)} />
            )}
        </div>
    )
}