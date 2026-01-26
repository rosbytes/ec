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
            console.log("does not support")
            // setError("Geolocation not supported")
            // setLoading(false)
            return
        }
        console.log("does support")

        const watchId = navigator.geolocation.watchPosition(
            (position: GeolocationPosition) => {
                const coords: GeolocationCoordinates = position.coords

                setLocation({
                    lat: coords.latitude,
                    lng: coords.longitude,
                    accuracy: coords.accuracy,
                    timestamp: position.timestamp,
                })
                setLoading(false)
            },
            (err: GeolocationPositionError) => {
                setError(err.message)
                setLoading(false)
            },
            {
                enableHighAccuracy: true,
                timeout: 5000,
                maximumAge: 0,
            } satisfies PositionOptions,
        )

        return () => navigator.geolocation.clearWatch(watchId)
    }, [])

    return { location, error, loading }
}
