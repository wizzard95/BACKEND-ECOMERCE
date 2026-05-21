import { connectDB, disconnectDB } from './config/configdb.js'
import express from 'express'
import dotenv from 'dotenv' // ? SIRVE PARA LEER LAS VARIABLES DE ENTORNO .ENV
import authRoutes from './routes/authRoutes.js'
import productRoutes from './routes/productsRoutes.js'
import cartRoutes from './routes/cartRoutes.js'
import orderRoutes from './routes/orderRoutes.js'
import webhookRoutes from './routes/webhookRoutes.js'
import cors from 'cors'
import cookieParser from 'cookie-parser'

dotenv.config()

const app = express()
// Confianza en proxies para obtener IP real del cliente cuando se usa un proxy inverso (como el dev proxy de Vite)
app.set('trust proxy', true)

// * configuracion para que el backend reciba correctamente las peticiones
// * desde el front
app.use(
    cors({
        origin: process.env.FRONTEND_URL.split(','),
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: [
            'Content-Type',
            'Authorization',
            'Cookie',
            'Set-Cookie',
        ],
        credentials: true, // ? permite que la cookie viaje al backend
    })
)
//* otra configuracion para poder recibir las cookies desde el frontend
app.use(cookieParser())

app.use(express.json())

const PORT = 3001

// * RUTAS API
app.use('/api/auth', authRoutes)
app.use('/api/products', productRoutes)
app.use('/api/cart', cartRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/webhook', webhookRoutes)

app.use((err, req, res, next) => {
    console.error('Error no manejado:', err)
    res.status(500).json({ message: 'Error interno del servidor' })
})

connectDB()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Servidor corriendo en el puerto ${PORT}`)
        })
    })
    .catch((error) => {
        console.error('Error al iniciar el servidor:', error)
        disconnectDB()
        process.exit(1)
    })
