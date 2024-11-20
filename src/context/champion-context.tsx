"use client";

import React, { createContext, useContext, useState } from "react";

interface Champion {
  id: string;
  name: string;
  title: string;
  imageUrl: string;
  theme: any;
  backgroundImage: string;
}

interface ChampionContextType {
  selectedChampion: Champion | null;
  setSelectedChampion: (champion: Champion) => void;
  messages: { id: string; role: "user" | "assistant"; content: string }[];
  setMessages: React.Dispatch<
    React.SetStateAction<
      { id: string; role: "user" | "assistant"; content: string }[]
    >
  >;
}

const ChampionContext = createContext<ChampionContextType | undefined>(
  undefined
);

export function ChampionProvider({ children }: { children: React.ReactNode }) {
  const [selectedChampion, setSelectedChampion] = useState<Champion | null>(
    null
  );
  const [messages, setMessages] = useState<
    { id: string; role: "user" | "assistant"; content: string }[]
  >([]);

  return (
    <ChampionContext.Provider
      value={{
        selectedChampion,
        setSelectedChampion,
        messages,
        setMessages,
      }}
    >
      {children}
    </ChampionContext.Provider>
  );
}

export function useChampion() {
  const context = useContext(ChampionContext);
  if (context === undefined) {
    throw new Error("useChampion must be used within a ChampionProvider");
  }
  return context;
}
