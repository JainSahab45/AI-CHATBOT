import mongoose from 'mongoose'

const messageSchema = new mongoose.Schema(
  {
    role:    { type: String, enum: ['user', 'assistant'], required: true },
    content: { type: String, required: true },
    tokens:  { type: Number, default: 0 }
  },
  { timestamps: true }
)

const conversationSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    messages: [messageSchema]
  },
  { timestamps: true }
)

// Keep max 100 messages per conversation to control token usage
conversationSchema.methods.addMessage = function (role, content, tokens = 0) {
  this.messages.push({ role, content, tokens })
  if (this.messages.length > 100) {
    this.messages = this.messages.slice(-100)
  }
}

// Return last N messages formatted for AI API
conversationSchema.methods.getHistory = function (n = 20) {
  return this.messages.slice(-n).map((m) => ({
    role: m.role,
    content: m.content
  }))
}

export default mongoose.model('Conversation', conversationSchema)
