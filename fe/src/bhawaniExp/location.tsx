import { useEffect, useRef } from "react"
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import { useGeolocation } from "./location"

// Fix default marker icon issue in Leaflet
// delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
    iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
})

// This component moves the map center smoothly to new location
function Recenter({ lat, lng }: { lat: number; lng: number }) {
    const map = useMap()
    useEffect(() => {
        map.setView([lat, lng], map.getZoom(), { animate: true })
    }, [lat, lng, map])
    return null
}

export default function LiveMap() {
    const { location, loading, error } = useGeolocation()
    const mapRef = useRef<L.Map>(null)

    if (loading) {
        return (
            <div
                style={{
                    height: "100vh",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexDirection: "column",
                    gap: "1rem",
                }}
            >
                <div
                    style={{
                        width: "40px",
                        height: "40px",
                        border: "3px solid var(--primary)",
                        borderTopColor: "transparent",
                        borderRadius: "50%",
                        animation: "spin 1s linear infinite",
                    }}
                />
                <p style={{ color: "var(--text-secondary)" }}>Fetching location...</p>
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
        )
    }

    if (error || !location) {
        return (
            <div
                style={{
                    height: "100vh",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "2rem",
                    textAlign: "center",
                }}
            >
                <div
                    className="glass-morphism"
                    style={{ padding: "2rem", borderRadius: "1rem", maxWidth: "400px" }}
                >
                    <h2 style={{ color: "#ef4444", marginBottom: "0.5rem" }}>Location Error</h2>
                    <p style={{ color: "var(--text-secondary)" }}>
                        {error || "Location not available"}
                    </p>
                </div>
            </div>
        )
    }

    return (
        <div style={{ position: "relative", height: "100vh", width: "100%" }}>
            {/* Floating Header */}
            <div
                className="glass-morphism"
                style={{
                    position: "absolute",
                    top: "1.5rem",
                    left: "1.5rem",
                    zIndex: 1000,
                    padding: "1rem 1.5rem",
                    borderRadius: "1rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "1rem",
                }}
            >
                <div
                    className="premium-gradient"
                    style={{ width: "12px", height: "12px", borderRadius: "50%" }}
                />
                <h1 style={{ margin: 0, fontSize: "1.25rem", fontWeight: 600 }}>Live Tracker</h1>
            </div>

            <MapContainer
                center={[location.lat, location.lng]}
                zoom={18}
                style={{ height: "100%", width: "100%" }}
                ref={mapRef}
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <Marker position={[location.lat, location.lng]} />
                <Recenter lat={location.lat} lng={location.lng} />
            </MapContainer>

            {/* Status Panel */}
            <div
                className="glass-morphism"
                style={{
                    position: "absolute",
                    bottom: "1.5rem",
                    right: "1.5rem",
                    zIndex: 1000,
                    padding: "1.5rem",
                    borderRadius: "1rem",
                    width: "300px",
                }}
            >
                <h3
                    style={{
                        margin: "0 0 1rem 0",
                        fontSize: "1rem",
                        color: "var(--text-secondary)",
                    }}
                >
                    Location Details
                </h3>
                <div style={{ display: "grid", gap: "0.75rem" }}>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <span style={{ color: "var(--text-secondary)", fontSize: "0.875rem" }}>
                            Latitude
                        </span>
                        <span style={{ fontWeight: 500 }}>{location.lat.toFixed(6)}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <span style={{ color: "var(--text-secondary)", fontSize: "0.875rem" }}>
                            Longitude
                        </span>
                        <span style={{ fontWeight: 500 }}>{location.lng.toFixed(6)}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <span style={{ color: "var(--text-secondary)", fontSize: "0.875rem" }}>
                            Accuracy
                        </span>
                        <span style={{ fontWeight: 500, color: "var(--accent)" }}>
                            ± {location.accuracy.toFixed(1)}m
                        </span>
                    </div>
                </div>
            </div>
        </div>
    )
}
