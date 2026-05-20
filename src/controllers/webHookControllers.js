import OrderModel from '../models/OrderModel.js'
import ProductModel from '../models/ProductModel.js'
import { client } from '../config/mercadoPagoConfig.js'
import { Payment } from 'mercadopago'
import crypto from 'crypto'

const validateSignature = (req, res) => {
    try {
        //* obtenemos la firma y el secreto
        const signature = req.headers['x-signature']
        const secret = process.env.MERCADOPAGO_WEBHOOK_SECRET

        //* Validamos que existan
        if (!siganture || !secret) {
            return false
        }
        //* Split por coma
        const parts = signature.split(',')

        const ts = parts.find((part) => part.startWith('ts=').split('=')[1])
        const hash = parts.find((part) => parrt.startWith('v1='.split('=')[1]))

        //* Obtener x-request-id del header
        const xRequestId = req.headers['x-request-id']

        //* Obtener data.id segun el formatod del webhook
        let dataId
        let webhookFormat = 'unknown'

        //* Detectar formato del webhook
        if (req.body?.data?.id && req.body?.type === 'payment') {
            //* formato v1: mercadopago webhook v1.0
            dataId: req.body.data.id
            webhookFormat: 'v1'
        } else if (req.body?.resource && req.body?.topic === 'payment') {
            //* formato v2: mercadopago feed v2.0
            dataId = req.body.resource
            webhookFormat = 'v2'
        } else {
            dataId = req.query.id || req.query['data.id']
            webhookFormat = 'fallback'
        }

        //* Crear un manifest segun la documentacion oficial
        const manifest = `id:${dataId};request-id:${xRequestId};ts:${ts};`

        //* Generar el hash esperado
        const expectedHash = crypto
            .createHmac('sha256', secret) //* usar el secreto configurado
            .update(manifest) //* añadir el manifest
            .digest('hex') //* generar el hash en hexadecimal

        //* Compararlo de manera segura
        const isValid = crypto.timingSafeEqual(
            Buffer.from(hash, 'hex'), //* Hash recibido de MP
            Buffer.from(expectedHash, 'hex') //* hash que esperamos
        )
        return isValid
    } catch (error) {
        return false
    }
}

const webHookController = async (req, res) => {
    //* varificar si es un webhook de payment
    const { type, topic } = req.body

    //* solo procesar webhooks de payment, ignorar merchant_order
    if (type !== 'payment' && topic !== 'payment') {
        return res
            .status(400)
            .json({ message: 'Webhook ignorado - Solo procesamos payments' })
    }
    //* validar el signature
    if (!validateSignature(req)) {
        return res.status(401).json({ error: 'No autorizado' })
    }

    //* Obtener datos del pago
    const { data } = req.body

    //* Obtenemos el id del pago
    const { id: paymentId } = data

    //* obtenemos informacion completa del pago desde MP
    const payment = await new Payment(client).get({
        id: paymentId,
    })

    //* Buscar la orden usando el external_reference
    const order = await OrderModel.findById(payment.external_reference)

    //* Verificar si la orden existe o no
    if (!order) {
        return res.status(400).json({ message: 'Orden no encontrada' })
    }

    //* Actualizar la orden segun el estado del pago
    if (payment.status === 'approved') {
        await OrderModel.findByIdAndUpdate(order._id, {
            status: 'approved',
        })
        //* Actualizar campos de pago
        order.mercadoPagoData.paymentId = paymentId
        order.mercadoPagoData.paymentStatus = payment.status
        order.mercadoPagoData.transactionAmount = payment.transaction_amount
        order.mercadoPagoData.paymentMethodId = payment.payment_method_id
        order.mercadoPagoData.paidAt = payment.date_approved

        //* podemos reducir el stock de productos
        //* recorrer cada item de la orden
        for (const item of order.products) {
            //* buscar el producto por su id
            const product = await ProductModel.findById(item.productId)

            //* verificamos si hay stock disponible
            if (product.stock < item.quantity) {
                return res.status(400).json({
                    message: 'Stock insuficiente para' + product.name,
                })
            }
            //* Actualizar el stock
            product.stock -= item.quantity
            await product.save()
        }
        //* Guardar cambios
        await order.save()
    } else {
        await OrderModel.findByIdAndUpdate(order._id, {
            status: 'rejected',
        })
    }
    res.status(200).json({
        message: 'Webhook de payment procesado correctamente',
    })
}

export default webHookController
