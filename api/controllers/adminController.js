import User from '../models/User.js'
import Conversation from '../models/Conversation.js'

// ── GET /api/admin/users ──────────────────────────────────
export const getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-passwordHash').sort({ createdAt: -1 })
    res.json({ users })
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
}

// ── DELETE /api/admin/users/:id ───────────────────────────
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
    if (!user)       return res.status(404).json({ message: 'User not found' })
    if (user.role === 'admin')
      return res.status(403).json({ message: 'Cannot delete admin' })

    await User.findByIdAndDelete(req.params.id)
    await Conversation.deleteOne({ userId: req.params.id })

    res.json({ message: 'User deleted' })
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
}

// ── GET /api/admin/stats ──────────────────────────────────
export const getStats = async (req, res) => {
  try {
    const [totalUsers, convs] = await Promise.all([
      User.countDocuments(),
      Conversation.find()
    ])

    const totalConvs    = convs.length
    const totalMessages = convs.reduce((sum, c) => sum + c.messages.length, 0)

    res.json({ totalUsers, totalConvs, totalMessages })
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
}

// ── GET /api/admin/conversations ─────────────────────────
export const getAllConversations = async (req, res) => {
  try {
    const convs = await Conversation.find()
      .populate('userId', 'name email')
      .sort({ updatedAt: -1 })
      .limit(50)
    res.json({ conversations: convs })
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
}
