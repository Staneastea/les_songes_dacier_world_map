// Liste des régions de la carte
// Chaque objet = une région du monde

export interface Region {
  name: string;
}

export const regions: Record<string, Region> = {
  hegemonie: { name: "Hégémonie" },
  aubazur: { name: "Aubazur" },
  kamreth: { name: "Kamreth" },
};


