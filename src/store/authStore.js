import { create } from 'zustand'

const useAuthStore = create((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,

  setAuth: (user, token) => {
    localStorage.setItem('token', token)
    set({ user, token, isAuthenticated: true })
  },

  logout: () => {
    localStorage.removeItem('token')
    set({ user: null, token: null, isAuthenticated: false })
  },

  // Load from localStorage on app start
  loadFromStorage: () => {
    const token = localStorage.getItem('token')
    if (!token) return
    try {
      // Decode payload (no verify — server verifies on every request)
      const payload = JSON.parse(atob(token.split('.')[1]))
      if (payload.exp * 1000 < Date.now()) {
        localStorage.removeItem('token')
        return
      }
      set({ token, user: { id: payload.id, name: payload.name, email: payload.email, role: payload.role }, isAuthenticated: true })
    } catch {
      localStorage.removeItem('token')
    }
  }
}))

export default useAuthStore
