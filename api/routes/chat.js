import { Router } from 'express'
import { sendMessage, getHistory, clearChat } from '../controllers/chatController.js'
import { protect } from '../middleware/auth.js'

const router = Router()

// All chat routes require auth
router.use(protect)

router.post('/message', sendMessage)
router.get('/history',  getHistory)
router.delete('/clear', clearChat)

export default router
