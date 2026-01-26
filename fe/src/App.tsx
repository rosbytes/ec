import { useState } from "react"
import reactLogo from "./assets/react.svg"
import viteLogo from "/vite.svg"
import "./App.css"
import { useGeolocation } from "./location"

function App() {
    const [count, setCount] = useState(0)
    const loc = useGeolocation()

    return (
        <>
            <div>
                <a href="https://vite.dev" target="_blank">
                    <img src={viteLogo} className="logo" alt="Vite logo" />
                </a>
                <a href="https://react.dev" target="_blank">
                    <img src={reactLogo} className="logo react" alt="React logo" />
                </a>
            </div>
            <h1>Vite + React</h1>
            <div className="card">
                <button onClick={() => setCount((count) => count + 1)}>count is {count}</button>
                <p>
                    Edit <code>src/App.tsx</code> and save to test HMR
                </p>
            </div>
            <p className="read-the-docs">Click on the Vite and React logos to learn more</p>
            <div className="location-info">
                {loc.loading ? (
                    <p>Fetching location...</p>
                ) : loc.error ? (
                    <p style={{ color: "red" }}>Error: {loc.error}</p>
                ) : loc.location ? (
                    <>
                        <h3>Your Location</h3>
                        <p>Latitude: {loc.location.lat}</p>
                        <p>Longitude: {loc.location.lng}</p>
                        <p>Accuracy: {loc.location.accuracy} meters</p>
                        <p>Last Updated: {new Date(loc.location.timestamp).toLocaleTimeString()}</p>
                    </>
                ) : (
                    <p>No location data available</p>
                )}
            </div>
        </>
    )
}

export default App
