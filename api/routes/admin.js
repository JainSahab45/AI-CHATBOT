import { Router } from 'express'
import { getUsers, deleteUser, getStats, getAllConversations } from '../controllers/adminController.js'
import { protect, isAdmin } from '../middleware/auth.js'

const router = Router()

// All admin routes require auth + admin role
router.use(protect, isAdmin)

router.get('/users',             getUsers)
router.delete('/users/:id',      deleteUser)
router.get('/stats',             getStats)
router.get('/conversations',     getAllConversations)

export default router
