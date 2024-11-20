import ChatInterface from "@/components/chat/chat-interface";

export default function ChatPage() {
  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="space-y-4">
        <div className="p-4 bg-slate-800 rounded-lg text-white">
          <h2 className="text-lg font-semibold mb-2">Welcome, Summoner</h2>
          <p className="text-slate-300">
            Select a champion to begin your conversation. Each champion has
            their own personality and knowledge based on their lore and
            experiences in Runeterra.
          </p>
        </div>
        <ChatInterface />
      </div>
    </div>
  );
}
