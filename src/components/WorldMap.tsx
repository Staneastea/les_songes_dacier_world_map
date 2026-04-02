import { useState, useRef, useEffect } from "react";
import RegionsSvg from "../assets/regions.svg?react"

// Données
import { regions } from "../data/regions.js";
import { characters } from "../data/characters.js";
import { events } from "../data/events.js";
import type { Character } from "../data/characters.js";
import type { CardEvent } from "../data/events.js";

/* Onglet possible du menu */
type ActiveTab = "Histoire" | "Personnages" | "Evènements clés" | null;

/* Côté d'ouverture du menu */
type OpenSide = "left" | "right";

type RegionPosition = {
  x: number;
  y: number;
};

/* Composant principal */

const WorldMap = () => {

  /** States **/

  // Région sélectionnée
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);

  // Position centrale de la région sélectionnée (pour positionner le menu)
  const [regionPosition, setRegionPosition] = useState<RegionPosition | null>(null);

  // Onglet ouvert dans le menu
  const [activeTab, setActiveTab] = useState<ActiveTab>(null);

  // Element sélectionné 
  const [selectedItem, setSelectedItem] = useState<Character | CardEvent | null>(null);

  // Côté d'ouverture (gauche/droite)
  const [openSide, setOpenSide] = useState<OpenSide>("right");

  // Dimensions réelles du menu (pour placer les cartes)
  const [menuRect, setMenuRect] = useState<DOMRect | null>(null);
  
  /** REFS **/

  // Référence vers le menu
  const menuRef = useRef<HTMLDivElement | null>(null);
  
  // Référence vers le conteneur principal
  const containerRef = useRef<HTMLDivElement | null>(null);

  /** EFFECTS **/

  // Fermer le menu + cartes quand on clique en dehors
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
      ) {
        setSelectedRegion(null);
        setSelectedItem(null);
        setActiveTab(null);
      }
    };

    // On écoute les clics sur toute la page
    document.addEventListener("mousedown", handleClickOutside);

    // Nettoyage quand le composant est demonté
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    }
  }, []);

  /* Récupère la position du menu quand il apparait / change */
  useEffect(() => {
    if (menuRef.current) {
      const rect = menuRef.current.getBoundingClientRect();
      setMenuRect(rect); 
    }
  }, [selectedRegion, activeTab]);

  /* Données Dérivées */

  // Personnage de la région sélectionnée
  const regionCharacters = characters.filter(
    (char) => char.regionId === selectedRegion
  );

  // Evènements de la région sélectionnée
  const regionEvents = events.filter(
    (event) => event.regionId === selectedRegion
  );
  
  // Est-ce que l'élément sélectionné a une image ?
  const hasImage = Boolean(selectedItem?.image);

  /** STYLES **/

  const tabStyle = (tab: Exclude<ActiveTab, null>) => ({
    background: activeTab === tab ? "#2563eb" : "#2d3e5a",
    color: "white",
    border: "none",
    padding: "8px 10px",
    borderRadius: "6px",
    cursor: "pointer",
    textAlign: "left" as const,
  });

  const slideStyle = (isOpen: boolean) => ({
    maxHeight: isOpen ? "300px" : "0px",
    opacity: isOpen ? 1 : 0,
    overflow: "hidden",
    transition: "all 1s ease",
  });

  /** Render **/

  return (
    <div
      ref={containerRef}
      style={{ position: "relative", width: "100%", overflow: "hidden" }}
    >

      {/* Carte du monde en background */}
      <img
          src = "/monde.png"
          alt = "Carte du monde"
          style = {{ width : "100%", display : "block"}}
        />

      {/* SVG des régions par dessus (pour les interactions) */}
      <RegionsSvg
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
        }}

        // CLIC

        onClick = {(e) => {

          // On remonte dans les parents juqu'à trouver un élément avec un id (les paths des régions ont un id correspondant à leur nom)
          const target = (e.target as Element).closest("[id]");

          // On vérifie que la cible existe, a un id, et que ce n'est pas le fond
          if (target && target.id && target.id !== "Monde 1") {

            // On récupère les dimensions et la position de la région cliquée
            const bbox = (target as SVGGraphicsElement).getBoundingClientRect();

            // Centre de la région
            const centerX = bbox.x + bbox.width / 2;
            const centerY = bbox.y + bbox.height / 2;

            // Largeur totale du SVG (viewBox)
            const MAP_WIDTH = 4096;

            setOpenSide(centerX < MAP_WIDTH / 2 ? "right" : "left");

            // On stocke son id comme région selectionnée
            setSelectedRegion(target.id);
            setRegionPosition({ x: centerX, y: centerY });
          }
        }}
      />

      {/* MENU 'visible si sélection */}
      {selectedRegion && regionPosition &&(
        <div
          ref={menuRef}
          style={{
            position: "absolute",

            // Placement de menu
            top: `${(regionPosition.y / 1640) * 100}%`,
            left:
              openSide === "right"
                ? `${(regionPosition.x / 4104) * 100}%`
                : "auto",
            right:
              openSide === "left"
                ? `${100 - (regionPosition.x / 4104) * 100}%`
                : "auto",
            transform: 
              openSide === "right"
                ? "translate(20px, -100%)"
                : "translate(-20px, -100%)",
            background: "#0f172a",
            color: "white",
            padding: "12px 16px",
            borderRadius: "8px",
            width: "220px",
          }}
        >
          <strong>{regions[selectedRegion as keyof typeof regions]?.name ?? selectedRegion}</strong>
          
          {/* ONGLETS */}
            <button
              style ={tabStyle("Histoire")}
              onClick={() => setActiveTab(activeTab === "Histoire" ? null : "Histoire")}>
                Histoire
            </button>

            <div style={slideStyle(activeTab === "Histoire")}>
              {activeTab === "Histoire" && (
                <div
                  style ={{
                    marginTop: "6px",
                    paddingLeft: "8px",
                    fontSize: "14px",
                    color: "#e5e7eb",
                  }}
                >
                  <p>
                    Contenu de l'histoire de la région...
                    <br /><br />
                    Ce texte est un exemple pour montrer où le contenu de l'histoire apparaîtrait.
                  </p>
                </div>
              )}
            </div>
            
            <button
              style ={tabStyle("Personnages")}
              onClick={() => setActiveTab(activeTab === "Personnages" ? null : "Personnages")}>
                Personnages
            </button>

            <div style={slideStyle(activeTab === "Personnages")}>
              {activeTab === "Personnages" && (
                <div
                  style ={{
                    marginTop: "6px",
                    paddingLeft: "8px",
                    fontSize: "14px",
                    color: "#e5e7eb",
                  }}
                >
                  <ul style = {{paddingLeft: "16px", marginTop: "4px"}}>
                   {regionCharacters.map((char) => (
                      <li
                        key={char.id}
                        onClick={() => setSelectedItem(char)}
                        style={{ cursor: "pointer"}}
                      >
                        {char.name}
                      </li>
                   ))}
                   </ul>
                </div>
              )}
            </div>

            <button
              style ={tabStyle("Evènements clés")}
              onClick={() => setActiveTab(activeTab === "Evènements clés" ? null : "Evènements clés")}>
                Evènements clés
            </button>

            <div style={slideStyle(activeTab === "Evènements clés")}>
              {activeTab === "Evènements clés" && (
                <div
                  style ={{
                    marginTop: "6px",
                    paddingLeft: "8px",
                    fontSize: "14px",
                    color: "#e5e7eb",
                  }}
                >
                  <ul style = {{paddingLeft: "16px", marginTop: "4px"}}>
                    {regionEvents.map((event) => (
                      <li
                        key={event.id}
                        style={{ cursor: "pointer"}}
                        onClick={() =>
                          setSelectedItem({
                            ...event,
                          })
                        }
                      >
                        {event.name}
                      </li>
                   ))}
                  </ul>
                </div>
              )}
            </div>
          </div>       
      )}

      {/* Carte détaillee */}
      {selectedItem && menuRect && containerRef.current &&(
        <div
          style={{
            position: "absolute",
            top:  `${
              menuRect.top - containerRef.current.getBoundingClientRect().top + menuRect.height / 2
            }px`,
            transform: "translateY(-50%)",

            left: openSide === "right"
              ? `${menuRect.right - containerRef.current.getBoundingClientRect().left + 12}px`
              : undefined,
            right: openSide === "left"
              ? `${
                  containerRef.current.getBoundingClientRect().right - menuRect.left + 12}px`
              : undefined,

            width : "180px",
            padding: "8px",
            background: "#020617",
            borderRadius: "8px",
            color: "white"
          }}
        >
          <strong>{selectedItem.name}</strong>

          {hasImage ? (
            <img
              src={selectedItem.image}
              alt={selectedItem.name}
              style={{
                width: "100%",
                height: "100px",
                objectFit: "cover",
                marginTop: "6px",
                borderRadius: "6px",
              }}
            />
          ) : (
            <div
              style={{
                height: "100px",
                background: "#020617",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#94a3b8",
                fontSize: "12px",
              }}
          >
            Pas d'image disponible
          </div>
          )}
        </div>
      )}


      {selectedRegion && regionPosition && menuRect && (
        <svg
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            pointerEvents: "none",
          }}
        >       
          <line
            /* Point de départ : centre de la région */
            x1={`${(regionPosition.x / 4104) * 100}%`}
            y1={`${(regionPosition.y / 1640) * 100}%`}
              /* Point d'arrivée : bord du menu */
            x2={
              openSide === "right"
                ? `${(menuRect.right / window.innerWidth) * 100 + 1.5}%`
                : `${(menuRect.right / window.innerWidth) * 100 + 1.5}%`
            }
            y2={`${((menuRect.top / window.innerHeight) * 100)}%`}
            stroke="#0f172a"              strokeWidth="0.5"
            />
        </svg>
      )}
  </div>
  );
};

export default WorldMap;