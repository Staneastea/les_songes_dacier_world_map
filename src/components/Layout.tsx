import type { ReactNode } from "react"
import '../styles/layout.css'

function Layout ({ children }: { children: ReactNode }) {
    return (
        // La div principale prend toute la hauteur de l'écran
        <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
            <header>
                <h1>Univers JDR</h1>
            </header>

            {/* Le main prend tout l'espace restant après le header */}
            <main style={{ flex: 1, overflow: "hidden", padding: 0 }}>
                {children}
            </main> 
        </div>
    )
}

export default Layout