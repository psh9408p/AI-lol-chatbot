export type ChampionRole =
  | "Assassin"
  | "Fighter"
  | "Mage"
  | "Marksman"
  | "Support"
  | "Tank";
export type ChampionRegion =
  | "Demacia"
  | "Noxus"
  | "Ionia"
  | "Freljord"
  | "Shadow Isles"
  | "Piltover & Zaun"
  | "Bandle City";

export interface Champion {
  id: string;
  name: string;
  title: string;
  roles: ChampionRole[];
  region: ChampionRegion;
  imageUrl: string;
  theme: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
  };
}
