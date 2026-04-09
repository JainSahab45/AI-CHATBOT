import { Link } from 'react-router-dom'
import { Bot, Zap, Shield, MessageSquare } from 'lucide-react'

export default function LandingPage() {
  const features = [
    { icon: <Zap size={20} />, title: 'Instant Responses', desc: 'Powered by GPT-4 / Claude for intelligent, context-aware answers' },
    { icon: <Shield size={20} />, title: 'Secure & Private', desc: 'JWT auth, hashed passwords, encrypted sessions' },
    { icon: <MessageSquare size={20} />, title: 'Conversation History', desc: 'Full chat history saved and retrieved across sessions' }
  ]

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col">
      {/* Nav */}
      <nav className="border-b border-gray-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2 text-sky-400 font-bold text-lg">
          <Bot size={24} /> <span>SupportAI</span>
        </div>
        <div className="flex gap-3">
          <Link to="/login"    className="btn-ghost text-sm">Sign in</Link>
          <Link to="/register" className="btn-primary text-sm">Get started</Link>
        </div>
      </nav>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 text-center py-20">
        <div className="inline-flex items-center gap-2 bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-medium px-3 py-1 rounded-full mb-6">
          <span className="w-1.5 h-1.5 bg-sky-400 rounded-full animate-pulse" />
          AI-Powered Customer Support
        </div>

        <h1 className="text-4xl md:text-6xl font-bold text-white max-w-3xl leading-tight mb-6">
          Customer support that <span className="text-sky-400">never sleeps</span>
        </h1>
        <p className="text-gray-400 text-lg max-w-xl mb-10">
          Instant, intelligent answers to every customer query. Powered by large language models and built on MERN stack.
        </p>

        <div className="flex gap-4 flex-wrap justify-center">
          <Link to="/register" className="btn-primary px-8 py-3 text-base">Start for free</Link>
          <Link to="/login"    className="btn-ghost px-8 py-3 text-base border border-gray-700">Sign in</Link>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20 max-w-4xl w-full">
          {features.map((f) => (
            <div key={f.title} className="card p-6 text-left">
              <div className="text-sky-400 mb-3">{f.icon}</div>
              <h3 className="font-semibold text-white mb-1">{f.title}</h3>
              <p className="text-gray-400 text-sm">{f.desc}</p>
            </div>
          ))}
        </div>
      </main>

      <footer className="border-t border-gray-800 px-6 py-4 text-center text-gray-600 text-sm">
        © 2025 SupportAI · Built with MERN + AI
      </footer>
    </div>
  )
}
