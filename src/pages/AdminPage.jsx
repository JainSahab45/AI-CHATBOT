import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Users, MessageSquare, Trash2, RefreshCw } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../services/api'

export default function AdminPage() {
  const [users, setUsers]   = useState([])
  const [stats, setStats]   = useState({ totalUsers: 0, totalMessages: 0, totalConvs: 0 })
  const [loading, setLoading] = useState(true)
  const navigate            = useNavigate()

  const load = async () => {
    setLoading(true)
    try {
      const [u, s] = await Promise.all([api.get('/admin/users'), api.get('/admin/stats')])
      setUsers(u.data.users)
      setStats(s.data)
    } catch {
      toast.error('Failed to load admin data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const deleteUser = async (id, name) => {
    if (!window.confirm(`Delete ${name}?`)) return
    try {
      await api.delete(`/admin/users/${id}`)
      toast.success(`${name} deleted`)
      setUsers((prev) => prev.filter((u) => u._id !== id))
    } catch {
      toast.error('Failed to delete user')
    }
  }

  const statCards = [
    { label: 'Total Users',    value: stats.totalUsers,    icon: <Users size={20} />,         color: 'text-sky-400'   },
    { label: 'Conversations',  value: stats.totalConvs,    icon: <MessageSquare size={20} />, color: 'text-purple-400' },
    { label: 'Total Messages', value: stats.totalMessages, icon: <MessageSquare size={20} />, color: 'text-green-400'  }
  ]

  return (
    <div className="min-h-screen bg-gray-950 p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/chat')} className="btn-ghost p-2">
              <ArrowLeft size={18} />
            </button>
            <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
          </div>
          <button onClick={load} className="btn-ghost p-2" title="Refresh">
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {statCards.map((s) => (
            <div key={s.label} className="card p-5">
              <div className={`${s.color} mb-2`}>{s.icon}</div>
              <p className="text-3xl font-bold text-white">{loading ? '—' : s.value}</p>
              <p className="text-gray-500 text-sm mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Users table */}
        <div className="card overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-800">
            <h2 className="font-semibold text-white">Registered Users</h2>
          </div>
          {loading ? (
            <div className="p-8 text-center text-gray-600">Loading…</div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                  <th className="px-6 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/50">
                {users.map((u) => (
                  <tr key={u._id} className="hover:bg-gray-800/30 transition-colors">
                    <td className="px-6 py-4 text-sm text-white font-medium">{u.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-400">{u.email}</td>
                    <td className="px-6 py-4">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium
                        ${u.role === 'admin'
                          ? 'bg-purple-500/20 text-purple-400'
                          : 'bg-gray-700 text-gray-300'}`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {u.role !== 'admin' && (
                        <button
                          onClick={() => deleteUser(u._id, u.name)}
                          className="text-red-500 hover:text-red-400 p-1 rounded transition-colors">
                          <Trash2 size={15} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}
