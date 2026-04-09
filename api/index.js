import 'dotenv/config'
import express    from 'express'
import cors       from 'cors'
import mongoose   from 'mongoose'

import authRoutes  from './routes/auth.js'
import chatRoutes  from './routes/chat.js'
import adminRoutes from './routes/admin.js'

const app  = express()
const PORT = process.env.PORT || 5000

// ── Middleware ────────────────────────────────────────────
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}))
app.use(express.json({ limit: '10mb' }))

// ── Routes ────────────────────────────────────────────────
app.use('/api/auth',  authRoutes)
app.use('/api/chat',  chatRoutes)
app.use('/api/admin', adminRoutes)

// Health check
app.get('/api/health', (_, res) => res.json({ status: 'ok', timestamp: new Date() }))

// 404 handler
app.use((_, res) => res.status(404).json({ message: 'Route not found' }))

// Global error handler
app.use((err, _, res, __) => {
  console.error(err)
  res.status(500).json({ message: 'Internal server error' })
})

// ── Database + Server start ───────────────────────────────
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected')
    app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`))
  })
  .catch((err) => {
    console.error('❌ MongoDB connection failed:', err.message)
    process.exit(1)
  })
