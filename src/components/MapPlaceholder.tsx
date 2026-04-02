import type { JSX } from "react"
import "../styles/map.css"

const MapPlaceholder = (): JSX.Element => {
    return (
        <div className = "map-placeholder">
            <p>Carte non disponible pour le moment</p>
        </div>
    )
}

export default MapPlaceholder