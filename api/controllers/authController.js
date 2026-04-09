import User from '../models/User.js'
import { signToken } from '../services/jwtService.js'

// ── POST /api/auth/register ───────────────────────────────
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body
    if (!name || !email || !password)
      return res.status(400).json({ message: 'All fields are required' })
    if (password.length < 6)
      return res.status(400).json({ message: 'Password must be at least 6 characters' })

    const exists = await User.findOne({ email })
    if (exists)
      return res.status(409).json({ message: 'Email already registered' })

    const user  = await User.create({ name, email, passwordHash: password })
    const token = signToken({ id: user._id, name: user.name, email: user.email, role: user.role })

    res.status(201).json({ user, token })
  } catch (err) {
    console.error('register error:', err)
    res.status(500).json({ message: 'Server error' })
  }
}

// ── POST /api/auth/login ──────────────────────────────────
export const login = async (req, res) => {
  try {
    const { email, password } = req.body
    if (!email || !password)
      return res.status(400).json({ message: 'Email and password required' })

    const user = await User.findOne({ email })
    if (!user)
      return res.status(401).json({ message: 'Invalid credentials' })

    const match = await user.comparePassword(password)
    if (!match)
      return res.status(401).json({ message: 'Invalid credentials' })

    const token = signToken({ id: user._id, name: user.name, email: user.email, role: user.role })

    res.json({ user, token })
  } catch (err) {
    console.error('login error:', err)
    res.status(500).json({ message: 'Server error' })
  }
}

// ── GET /api/auth/me ──────────────────────────────────────
export const getMe = async (req, res) => {
  res.json({ user: req.user })
}
