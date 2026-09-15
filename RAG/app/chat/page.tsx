import ChatInterface from "@/components/chat/ChatInterface"

export default function ChatPage() {
  return (
    <div className="h-screen flex flex-col p-6">
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-white">AI Chat</h1>
        <p className="text-sm text-gray-400 mt-1">
          Fai domande sulla wiki — il modello risponde con il contesto rilevante
        </p>
      </div>
      <div className="flex-1 min-h-0">
        <ChatInterface />
      </div>
    </div>
  )
}
