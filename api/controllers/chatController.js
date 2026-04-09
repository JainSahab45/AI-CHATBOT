import Conversation from '../models/Conversation.js'
import { getAIReply } from '../services/aiService.js'

// ── POST /api/chat/message ────────────────────────────────
export const sendMessage = async (req, res) => {
  try {
    const { message } = req.body
    if (!message?.trim())
      return res.status(400).json({ message: 'Message cannot be empty' })

    // Get or create conversation for this user
    let conv = await Conversation.findOne({ userId: req.user._id })
    if (!conv) conv = new Conversation({ userId: req.user._id, messages: [] })

    // Save user message
    conv.addMessage('user', message.trim())

    // Build history for AI (last 20 turns)
    const history = conv.getHistory(20)

    // Call AI
    const { reply, tokens } = await getAIReply(history)

    // Save assistant reply
    conv.addMessage('assistant', reply, tokens)
    await conv.save()

    res.json({ reply, tokens })
  } catch (err) {
    console.error('sendMessage error:', err)
    res.status(500).json({ message: err.message || 'AI service error' })
  }
}

// ── GET /api/chat/history ─────────────────────────────────
export const getHistory = async (req, res) => {
  try {
    const conv = await Conversation.findOne({ userId: req.user._id })
    res.json({ messages: conv?.messages || [] })
  } catch (err) {
    console.error('getHistory error:', err)
    res.status(500).json({ message: 'Server error' })
  }
}

// ── DELETE /api/chat/clear ────────────────────────────────
export const clearChat = async (req, res) => {
  try {
    await Conversation.deleteOne({ userId: req.user._id })
    res.json({ message: 'Conversation cleared' })
  } catch (err) {
    console.error('clearChat error:', err)
    res.status(500).json({ message: 'Server error' })
  }
}
