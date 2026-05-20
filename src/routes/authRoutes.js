import express from 'express'
import {
    registerUser,
    profile,
    loginUser,
    logout,
} from '../controllers/authControllers.js'

const router = express.Router()

router.post('/register', registerUser)

router.get('/profile', profile)

router.post('/login', loginUser)

router.post('/logout', logout)

export default router
