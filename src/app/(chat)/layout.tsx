"use client";

import { ChampionProvider } from "@/context/champion-context";
import ChampionSidebar from "@/components/chat/champion-sidebar";

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ChampionProvider>
      <div className="flex min-h-screen bg-slate-900">
        <ChampionSidebar />
        <main className="ml-64 flex-1">{children}</main>
      </div>
    </ChampionProvider>
  );
}
