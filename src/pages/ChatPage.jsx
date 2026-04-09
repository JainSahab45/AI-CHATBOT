import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Bot, Send, Trash2, LogOut, Settings, User } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../services/api'
import useAuthStore from '../store/authStore'
import MessageBubble from '../components/MessageBubble'
import TypingIndicator from '../components/TypingIndicator'

export default function ChatPage() {
  const [messages, setMessages]   = useState([])
  const [input, setInput]         = useState('')
  const [loading, setLoading]     = useState(false)
  const [histLoading, setHistLoading] = useState(true)
  const { user, logout }          = useAuthStore()
  const bottomRef                 = useRef(null)
  const inputRef                  = useRef(null)
  const navigate                  = useNavigate()

  // Load conversation history on mount
  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get('/chat/history')
        setMessages(data.messages || [])
      } catch {
        toast.error('Failed to load history')
      } finally {
        setHistLoading(false)
      }
    }
    load()
  }, [])

  // Auto-scroll to latest message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  const sendMessage = async () => {
    const text = input.trim()
    if (!text || loading) return

    const userMsg = { role: 'user', content: text, timestamp: new Date().toISOString() }
    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setLoading(true)

    try {
      const { data } = await api.post('/chat/message', { message: text })
      setMessages((prev) => [...prev, {
        role: 'assistant',
        content: data.reply,
        timestamp: new Date().toISOString()
      }])
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send')
      setMessages((prev) => prev.slice(0, -1)) // remove optimistic msg
    } finally {
      setLoading(false)
      inputRef.current?.focus()
    }
  }

  const clearChat = async () => {
    if (!window.confirm('Clear all conversations?')) return
    try {
      await api.delete('/chat/clear')
      setMessages([])
      toast.success('Chat cleared')
    } catch {
      toast.error('Failed to clear')
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div className="h-screen bg-gray-950 flex flex-col">
      {/* Header */}
      <header className="border-b border-gray-800 px-4 py-3 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-sky-500/20 rounded-lg flex items-center justify-center text-sky-400">
            <Bot size={18} />
          </div>
          <div>
            <p className="font-semibold text-white text-sm">SupportAI</p>
            <p className="text-xs text-green-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" /> Online
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <div className="flex items-center gap-2 text-gray-400 text-sm mr-2">
            <User size={14} /> <span className="hidden sm:inline">{user?.name}</span>
          </div>
          {user?.role === 'admin' && (
            <button onClick={() => navigate('/admin')} className="btn-ghost p-2" title="Admin panel">
              <Settings size={16} />
            </button>
          )}
          <button onClick={clearChat} className="btn-ghost p-2" title="Clear chat">
            <Trash2 size={16} />
          </button>
          <button onClick={handleLogout} className="btn-ghost p-2" title="Logout">
            <LogOut size={16} />
          </button>
        </div>
      </header>

      {/* Messages */}
      <main className="flex-1 overflow-y-auto px-4 py-6 space-y-1">
        {histLoading ? (
          <div className="flex items-center justify-center h-full text-gray-600 text-sm">
            Loading history…
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center gap-4">
            <div className="w-16 h-16 bg-sky-500/10 rounded-2xl flex items-center justify-center text-sky-400">
              <Bot size={32} />
            </div>
            <div>
              <p className="text-white font-semibold">How can I help you today?</p>
              <p className="text-gray-500 text-sm mt-1">Ask me anything about our products or services.</p>
            </div>
          </div>
        ) : (
          <>
            {messages.map((msg, i) => (
              <MessageBubble key={i} message={msg} />
            ))}
            {loading && <TypingIndicator />}
          </>
        )}
        <div ref={bottomRef} />
      </main>

      {/* Input */}
      <footer className="border-t border-gray-800 px-4 py-3 flex-shrink-0">
        <div className="flex gap-2 items-end max-w-4xl mx-auto">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message… (Enter to send, Shift+Enter for newline)"
            rows={1}
            className="input-field resize-none flex-1 min-h-[44px] max-h-32 py-3 leading-5"
            style={{ height: 'auto' }}
            onInput={(e) => {
              e.target.style.height = 'auto'
              e.target.style.height = Math.min(e.target.scrollHeight, 128) + 'px'
            }}
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim() || loading}
            className="btn-primary p-3 flex-shrink-0"
          >
            <Send size={18} />
          </button>
        </div>
        <p className="text-center text-gray-700 text-xs mt-2">
          AI can make mistakes. Verify important information.
        </p>
      </footer>
    </div>
  )
}
