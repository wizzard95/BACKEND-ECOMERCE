import MercadoPagoConfig, { Preference } from 'mercadopago'
import { client } from '../config/mercadoPagoConfig.js'
import OrderModel from '../models/OrderModel.js'

const preference = new Preference(client)

export const createOrder = async (req, res) => {
    try {
        const { items, payer, shippingInfo } = req.body

        if (!items || !items.length) {
            return res.status(400).json({
                success: false,
                message: 'Se requieren items para crear la orden',
            })
        }
        if (!payer || !payer.email) {
            return res.status(400).json({
                success: false,
                message: 'Se requiere email del comprador',
            })
        }
        //* CREAR LA ORDEN EN LA BASE DE DATOS PRIMERO
        const newOrder = new OrderModel({
            products: items.map((item) => ({
                productId: item.id,
                quantity: item.quantity,
                price: item.unit_price,
            })),
            totalAmount: items.reduce(
                (total, item) => total + item.unit_price * item.quantity,
                0
            ),
            status: 'pending',
            shippingInfo: shippingInfo,
            MercadoPagoData: {
                payerEmail: payer.email,
            },
        })

        const savedOrder = await newOrder.save()

        //* CREAR PREFERENCIA EN MERCADO PAFO CON EXTERNAL_REFERENCE
        const result = await preference.create({
            body: {
                items: items,
                payer: {
                    email: payer.email,
                },
                external_reference: savedOrder._id.toString(),
                back_urls: {
                    success: `${process.env.FRONTEND_URL}/payment/succes`,
                    failure: `${process.env.FRONTEND_URL}/payment/failure`,
                    pending: `${process.env.FRONTEND_URL}/payment/pending`,
                },
                notification_url: `${
                    process.env.BACKEND_URL || 'http://localhost:3001'
                }
                    /api/webhook`,
                metadata: {
                    order_id: savedOrder._id.toString(),
                },
            },
        })

        console.log('RESULTADO DE LA PREFERENCIA CREADA', result)
        savedOrder.mercadoPagoData.preferenceId = result.id
        await savedOrder.save()

        res.status(201).json({
            success: true,
            message: 'Orden creada exitosamente',
            paymentUrl: result.init_point,
            preferenceId: result.id,
        })
    } catch (error) {
        console.log('Error al crear la orden', error)
        res.status(500).json({
            success: false,
            message: 'Error al crear la orden',
        })
    }
}
