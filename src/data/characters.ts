export interface Character {
    id: string;
    name: string;
    regionId: string;
    description: string;
    image?: string; // Optional image property
}

export const characters: Character[] = [
    {
        id: "char_1",
        regionId: "hegemonie", // Important
        name: "personnage 1",
        image: "/personnage1.jpg",
        description: "Description du personnage 1."
    },
    {
        id: "char_2",
        regionId: "hegemonie", // Important
        name: "personnage 2",
        image: "/personnage2.jpg",
        description: "Description du personnage 2."
    },
];
