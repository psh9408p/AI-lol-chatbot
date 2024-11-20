"use client";

import React, { useState, FormEvent, useRef, useEffect } from "react";
import Image from "next/image";
import { Send } from "lucide-react";
import { useChampion } from "@/context/champion-context";
import type { Champion } from "@/types/champion";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

// 챔피언별 배경 스타일 클래스 매핑
const championStyles = {
  lux: {
    container: "bg-gradient-to-br from-blue-900/95 to-yellow-900/95",
    header: "border-yellow-500/20",
    messageUser: "bg-blue-500/80 text-white",
    messageAssistant: "bg-yellow-500/20 text-white",
    input: "bg-blue-900/30 border-yellow-500/20",
  },
  ahri: {
    container: "bg-gradient-to-br from-pink-900/95 to-purple-900/95",
    header: "border-pink-500/20",
    messageUser: "bg-pink-500/80 text-white",
    messageAssistant: "bg-purple-500/20 text-white",
    input: "bg-pink-900/30 border-pink-500/20",
  },
} as const;

export default function ChatInterface() {
  const { selectedChampion, messages, setMessages } = useChampion();
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!selectedChampion) {
    return (
      <div className="w-full h-[600px] bg-slate-900 rounded-lg shadow-lg flex items-center justify-center">
        <p className="text-slate-400">Select a champion to start chatting</p>
      </div>
    );
  }

  const styles =
    championStyles[selectedChampion.id as keyof typeof championStyles];

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: messages.concat(userMessage).map((m) => ({
            role: m.role,
            content: m.content,
          })),
          championId: selectedChampion.id,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch response");
      }

      const data = await response.json();

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: "assistant",
          content: data.content,
        },
      ]);
    } catch (error) {
      console.error("Error:", error);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: "assistant",
          content:
            "I apologize, but I seem to have encountered an error. Could you please try again?",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full h-[600px] rounded-lg shadow-lg flex flex-col overflow-hidden relative">
      {/* Background Image */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `linear-gradient(${selectedChampion.theme.overlay}, ${selectedChampion.theme.overlay}),
                           url('${selectedChampion.backgroundImage}')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      />

      {/* Content Container */}
      <div className="relative z-10 flex flex-col h-full backdrop-blur-sm">
        {/* Header */}
        <div className="p-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-full overflow-hidden ring-2 ring-white/20">
              <Image
                src={selectedChampion.imageUrl}
                alt={selectedChampion.name}
                fill
                sizes="40px"
                className="object-cover"
                priority
              />
            </div>
            <div>
              <h3 className="font-medium text-white">
                {selectedChampion.name}
              </h3>
              <p className="text-sm text-white/70">{selectedChampion.title}</p>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`
                  max-w-[80%] rounded-lg px-4 py-2 backdrop-blur-sm
                  ${
                    message.role === "user"
                      ? "bg-white/20 text-white"
                      : "bg-black/20 text-white"
                  }
                `}
              >
                {message.content}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-black/20 rounded-lg px-4 py-2 backdrop-blur-sm text-white">
                <div className="flex gap-2">
                  <span className="animate-pulse">✧</span>
                  <span className="animate-pulse delay-75">✧</span>
                  <span className="animate-pulse delay-150">✧</span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-white/10">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              className="flex-1 px-4 py-2 rounded-lg bg-black/20 border border-white/10
                       text-white placeholder-white/50
                       focus:outline-none focus:ring-2 focus:ring-white/20"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={`Send a message to ${selectedChampion.name}...`}
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading}
              className="p-2 rounded-lg bg-white/20 text-white
                       disabled:opacity-50 disabled:cursor-not-allowed
                       hover:bg-white/30 transition-colors"
            >
              <Send className="h-5 w-5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
