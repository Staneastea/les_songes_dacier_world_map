import { useState, useRef } from "react";
import RegionsSvg from "../assets/regions.svg?react"

// Données
import { characters } from "../data/characters.js";
import { events } from "../data/events.js";
import type { Character } from "../data/characters.js";
import type { CardEvent } from "../data/events.js";

/* Composant principal */
const WorldMap = () => {

  /** States **/

  // Région sélectionnée (son id)
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);

  // Niveau de zoom (1 = normal)
  const [scale, setScale] = useState<number>(1);

  // Déplacement de la carte en pixels (x = horizontal, y = vertical)
  const [translate, setTranslate] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

    // true = le menu est ouvert, false = fermé
    const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  /** REFS **/

  // Référence vers le conteneur principal (la div qui englobe tout)
  const containerRef = useRef<HTMLDivElement | null>(null);

  /** FONCTIONS **/

  // Remet la carte à son état initial (zoom = 1, pas de déplacement)
  const resetZoom = () => {
    setScale(1);
    setTranslate({ x: 0, y: 0 });
    setSelectedRegion(null);
    // fermeture du menu quand on dézoome
    setIsMenuOpen(false);
  };

  /** Render **/
  return (
    <div
      style={{ 
        // Flexbox : carte et menu côte à côte
        display: "flex", 
        width: "100%",
        height: "100vh", 
        overflow: "hidden", // Empêche les scrollbars pendant le zoom
      }}
    >
      {/* Div qui contient uniquement la carte*/}
      <div
        ref={containerRef}
        style={{
          // Prend tout l'espace disponible
          flex: 1,
          position: "relative", // Permet de positionner les éléments absolus à l'intérieur
          overflow: "hidden", // Cache les parties de la carte qui dépassent pendant le zoom
          height: "100vh",
        }}
      >

        {/* Bouton dézoomer — visible uniquement quand on est zoomé */}
        {scale > 1 && (
          <button
            onClick={resetZoom}
            style={{
              position: "fixed",
              top: "20px",
              right: "20px",
              zIndex: 999,
              background: "#0f172a",
              color: "white",
              border: "none",
              padding: "8px 16px",
              borderRadius: "8px",
              cursor: "pointer",
            }}
          >
            ← Dézoomer
          </button>
        )}

        {/* Div zoomable — contient la carte et les régions */}
        <div
          style={{
            // scale() agrandit la carte
            // translate() la déplace pour centrer la région cliquée
            transform: `scale(${scale}) translate(${translate.x}px, ${translate.y}px)`,

            // Le zoom part du centre de la carte
            transformOrigin: "center center",

            // Animation fluide de 0.6 secondes
            transition: "transform 0.6s ease",
          }}
        >

          {/* Image de fond de la carte */}
          <img
            src="/monde.png"
            alt="Carte du monde"
            style={{ 
              width: "100%",
              display: "block", // Élimine les petits espaces en bas de l'image
            }}
          />

          {/* SVG des régions par dessus — gère les interactions */}
          <RegionsSvg
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
            }}

            onClick={(e) => {
              const target = (e.target as Element).closest("path[id], g[id]");

              if (target && target.id) {
                setSelectedRegion(target.id);
                setIsMenuOpen(true);

                const bbox = (target as SVGGraphicsElement).getBoundingClientRect();
                const container = containerRef.current!.getBoundingClientRect();

                // Centre de la région et du conteneur en coordonnées écran
                const regionCenterX = bbox.x + bbox.width / 2;
                const regionCenterY = bbox.y + bbox.height / 2;
                const containerCenterX = container.left + container.width / 2;
                const containerCenterY = container.top + container.height / 2;

                // Taille naturelle de la région (sans le zoom déjà appliqué)
                const naturalWidth = bbox.width / scale;
                const naturalHeight = bbox.height / scale;

                const zoomX = window.innerWidth / naturalWidth;
                const zoomY = window.innerHeight / naturalHeight;
                const zoomLevel = Math.max(Math.min(zoomX, zoomY, 4) * 0.8, 1.5);

                // Position naturelle du centre de la région, relative au centre du conteneur
                // (permet de recalculer correctement même si on est déjà zoomé)
                const naturalRelX = (regionCenterX - containerCenterX) / scale - translate.x;
                const naturalRelY = (regionCenterY - containerCenterY) / scale - translate.y;

                const viewportCenterX = window.innerWidth / 2;
                const viewportCenterY = window.innerHeight / 2;

                // Translate pour que le centre de la région arrive au centre du viewport
                const translateX = (viewportCenterX - containerCenterX) / zoomLevel - naturalRelX;
                const translateY = (viewportCenterY - containerCenterY) / zoomLevel - naturalRelY;

                setScale(zoomLevel);
                setTranslate({ x: translateX, y: translateY });
              }
            }}
          />
        </div>

      </div>

      {/* Menu latéral - glisse depuis la droite quand une région est sélectionnée */}
      <div
        style={{
          // Le menu glisse depuis la droite
          // Si isMenuOpen = true > largeur normale
          // Si isMenuOpen = false > largeur 0 et overflow caché
          width: isMenuOpen ? "300px" : "0",
          overflow: "hidden",

          // Animation fluide
          transition: "transform 0.4s ease",

          // Style du menu
          background: "#0f172a",
          color: "white",
          padding: isMenuOpen ? "24px" : "0", // Padding seulement quand le menu est ouvert
          overflowY: "hidden", // Permet de scroller si le contenu dépasse la hauteur

          // Toujours présent dans le DOM mais caché
          flexShrink: 0,
        }}
      >
        {/* Nom de la région sélectionnée */}
        <h2 style={{ marginTop: 0 }}>
          {selectedRegion ?? ""}
        </h2>

        {/* Bouton de fermeture du menu */}
        <button
          onClick={resetZoom}
          style={{
            background: "transparent",
            color: "white",
            border: "1px solid white",
            padding: "4px 12px",
            borderRadius: "6px",
            cursor: "pointer",
            marginBottom: "16px",
          }}
        >
          X Fermer
        </button>
      </div>
    </div>
  );
};

export default WorldMap;
