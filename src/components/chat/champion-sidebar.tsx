"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import { useChampion } from "@/context/champion-context";
import { Search, Filter } from "lucide-react";
import { champions } from "@/lib/champion/data";
import type { ChampionRole, ChampionRegion } from "@/lib/champion/types";

export default function ChampionSidebar() {
  const { selectedChampion, setSelectedChampion, setMessages } = useChampion();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState<ChampionRole | "All">("All");
  const [selectedRegion, setSelectedRegion] = useState<ChampionRegion | "All">(
    "All"
  );
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const filteredChampions = useMemo(() => {
    return champions.filter((champion) => {
      const matchesSearch =
        champion.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        champion.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesRole =
        selectedRole === "All" ||
        champion.roles.includes(selectedRole as ChampionRole);
      const matchesRegion =
        selectedRegion === "All" || champion.region === selectedRegion;

      return matchesSearch && matchesRole && matchesRegion;
    });
  }, [searchQuery, selectedRole, selectedRegion]);

  const handleChampionSelect = (champion: (typeof champions)[0]) => {
    setSelectedChampion(champion);
    setMessages([
      {
        id: "1",
        role: "assistant",
        content: `Greetings, summoner! I am ${champion.name}, ${champion.title}. How wonderful it is to meet you! What would you like to discuss?`,
      },
    ]);
  };

  return (
    <div className="w-64 bg-slate-900 border-r border-slate-700 h-screen fixed left-0 top-0 flex flex-col">
      {/* 검색 바 */}
      <div className="p-4 border-b border-slate-700">
        <div className="relative">
          <input
            type="text"
            placeholder="Search champions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-800 text-white rounded-lg pl-10 pr-4 py-2 
                     placeholder-slate-400 focus:outline-none focus:ring-2 
                     focus:ring-blue-500 border border-slate-700"
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
        </div>
      </div>

      {/* 필터 버튼 */}
      <div className="p-4 border-b border-slate-700">
        <button
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          className="flex items-center gap-2 text-slate-300 hover:text-white"
        >
          <Filter className="h-5 w-5" />
          <span>Filters</span>
        </button>
      </div>

      {/* 필터 패널 */}
      {isFilterOpen && (
        <div className="p-4 border-b border-slate-700 bg-slate-800">
          <div className="space-y-4">
            {/* 역할 필터 */}
            <div>
              <label className="text-sm text-slate-400 block mb-2">Role</label>
              <select
                value={selectedRole}
                onChange={(e) =>
                  setSelectedRole(e.target.value as ChampionRole | "All")
                }
                className="w-full bg-slate-700 text-white rounded px-2 py-1"
              >
                <option value="All">All Roles</option>
                <option value="Assassin">Assassin</option>
                <option value="Fighter">Fighter</option>
                <option value="Mage">Mage</option>
                <option value="Marksman">Marksman</option>
                <option value="Support">Support</option>
                <option value="Tank">Tank</option>
              </select>
            </div>

            {/* 지역 필터 */}
            <div>
              <label className="text-sm text-slate-400 block mb-2">
                Region
              </label>
              <select
                value={selectedRegion}
                onChange={(e) =>
                  setSelectedRegion(e.target.value as ChampionRegion | "All")
                }
                className="w-full bg-slate-700 text-white rounded px-2 py-1"
              >
                <option value="All">All Regions</option>
                <option value="Demacia">Demacia</option>
                <option value="Noxus">Noxus</option>
                <option value="Ionia">Ionia</option>
                <option value="Freljord">Freljord</option>
                <option value="Shadow Isles">Shadow Isles</option>
                <option value="Piltover & Zaun">Piltover & Zaun</option>
                <option value="Bandle City">Bandle City</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* 챔피언 목록 */}
      <div className="flex-1 overflow-y-auto">
        {filteredChampions.length === 0 ? (
          <div className="p-4 text-slate-400 text-center">
            No champions found
          </div>
        ) : (
          filteredChampions.map((champion) => (
            <button
              key={champion.id}
              onClick={() => handleChampionSelect(champion)}
              className={`w-full p-3 flex items-center gap-3 hover:bg-slate-800 
                transition-colors border-b border-slate-700
                ${selectedChampion?.id === champion.id ? "bg-slate-800" : ""}`}
            >
              <div className="relative flex-shrink-0">
                <div className="w-12 h-12 rounded-full overflow-hidden">
                  <Image
                    src={champion.imageUrl}
                    alt={champion.name}
                    width={48}
                    height={48}
                    className="object-cover"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                {" "}
                {/* flex-1과 min-w-0을 추가하여 텍스트 영역 조정 */}
                <h3 className="text-white font-medium truncate">
                  {champion.name}
                </h3>
                <p className="text-slate-400 text-sm truncate">
                  {champion.title}
                </p>
              </div>
              <div className="flex flex-col gap-1 flex-shrink-0">
                {" "}
                {/* flex-shrink-0 추가하여 역할 태그 영역 유지 */}
                {champion.roles.map((role) => (
                  <span
                    key={role}
                    className="text-xs px-2 py-0.5 rounded bg-slate-700 text-slate-300 whitespace-nowrap"
                  >
                    {role}
                  </span>
                ))}
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
}
