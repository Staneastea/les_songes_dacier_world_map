export interface CardEvent {
    id: string;
    name: string;
    regionId: string; // Important : doit correspondre à une région de regions.ts
    image?: string; // Optionnel : une image pour l'évènement
    type?: "bataille" | "découverte" |"politique" | "autre"; // Optionnel : type d'évènement (ex: "bataille", "découverte", etc.) pour éventuellement différencier les icônes ou styles d'affichage
}

export const events: CardEvent[] = [
    {
        id: "event_1",
        regionId: "hegemonie", // Important
        name: "700 - Prise de l'Archipel de Lezrus",
    },
];