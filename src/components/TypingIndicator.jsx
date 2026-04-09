import { Bot } from 'lucide-react'

export default function TypingIndicator() {
  return (
    <div className="flex gap-3 mb-4 msg-anim">
      <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-gray-300 flex-shrink-0 mt-1">
        <Bot size={15} />
      </div>
      <div className="bg-gray-800 border border-gray-700 px-4 py-3 rounded-2xl rounded-tl-sm flex items-center gap-1">
        <span className="dot w-1.5 h-1.5 bg-gray-400 rounded-full" />
        <span className="dot w-1.5 h-1.5 bg-gray-400 rounded-full" />
        <span className="dot w-1.5 h-1.5 bg-gray-400 rounded-full" />
      </div>
    </div>
  )
}
