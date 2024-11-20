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

export interface ChampionTheme {
  primary: string;
  secondary: string;
  accent: string;
  overlay: string;
}

export interface Champion {
  id: string;
  name: string;
  title: string;
  roles: ChampionRole[];
  region: ChampionRegion;
  imageUrl: string;
  backgroundImage: string; // 배경 이미지 속성 추가
  theme: ChampionTheme;
}
