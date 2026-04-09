import { verifyToken } from '../services/jwtService.js'
import User from '../models/User.js'

// Verify JWT — attaches req.user on success
export const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader?.startsWith('Bearer '))
      return res.status(401).json({ message: 'No token provided' })

    const token   = authHeader.split(' ')[1]
    const payload = verifyToken(token)

    // Optionally fetch fresh user (catches deleted/banned users)
    const user = await User.findById(payload.id).select('-passwordHash')
    if (!user) return res.status(401).json({ message: 'User not found' })

    req.user = user
    next()
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' })
  }
}

// Admin-only guard — must run after protect
export const isAdmin = (req, res, next) => {
  if (req.user?.role !== 'admin')
    return res.status(403).json({ message: 'Admin access required' })
  next()
}
