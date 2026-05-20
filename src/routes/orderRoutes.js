import express from 'express'
import { createOrder } from '../controllers/orderControllers.js'

const router = express.Router()

//* CREAR NUEVA ORDEN DE COMPRA Y GENENAR PREFERENCIA DE PAGO DE MERCADO PAGO
router.post('/create', createOrder)

export default router
