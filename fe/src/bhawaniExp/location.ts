import { useEffect, useState } from "react"

type Location = {
    lat: number
    lng: number
    accuracy: number
    timestamp: number
}

export function useGeolocation() {
    const [location, setLocation] = useState<Location | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!navigator.geolocation) {
            //   setError("Geolocation not supported")
            //   setLoading(false)
            return
        }

        const watchId = navigator.geolocation.watchPosition(
            (position) => {
                const coords = position.coords
                setLocation({
                    lat: coords.latitude,
                    lng: coords.longitude,
                    accuracy: coords.accuracy,
                    timestamp: position.timestamp,
                })
                setLoading(false)
            },
            (err) => {
                setError(err.message)
                setLoading(false)
            },
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 },
        )

        return () => navigator.geolocation.clearWatch(watchId)
    }, [])

    return { location, error, loading }
}
