import type { ReactNode } from "react"
import '../styles/layout.css'

function Layout ({ children }: { children: ReactNode }) {
    return (
        <div>
            <header>
                <h1>Univers JDR</h1>
            </header>

            <main>
                {children} {/*Ce que tu mets à l'intérieur du composant quand tu l'utiles*/}
            </main> 
        </div>
    )
}

export default Layout