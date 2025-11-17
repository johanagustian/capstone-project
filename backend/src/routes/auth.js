import { Router } from 'express'
import { handleLogin, handleRegister } from '../controllers/authController.js'

const router = Router()

router.post('/register', handleRegister)
router.post('/login', handleLogin)
// router.post('/dashboard', handleDashboard)

export default router

