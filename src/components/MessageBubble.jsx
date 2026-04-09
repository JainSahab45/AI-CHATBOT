import { Bot, User } from 'lucide-react'

export default function MessageBubble({ message }) {
  const isUser = message.role === 'user'
  const time   = message.timestamp
    ? new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : ''

  return (
    <div className={`flex gap-3 msg-anim ${isUser ? 'flex-row-reverse' : 'flex-row'} mb-4`}>
      {/* Avatar */}
      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1
        ${isUser ? 'bg-sky-500/20 text-sky-400' : 'bg-gray-800 text-gray-300'}`}>
        {isUser ? <User size={15} /> : <Bot size={15} />}
      </div>

      {/* Bubble */}
      <div className={`max-w-[75%] ${isUser ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
        <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap
          ${isUser
            ? 'bg-sky-500 text-white rounded-tr-sm'
            : 'bg-gray-800 text-gray-100 rounded-tl-sm border border-gray-700'
          }`}>
          {message.content}
        </div>
        {time && (
          <span className="text-xs text-gray-600 px-1">{time}</span>
        )}
      </div>
    </div>
  )
}
