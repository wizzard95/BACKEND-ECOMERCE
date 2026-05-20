import express from 'express'
import {
    createProduct,
    updateProduct,
    getProductById,
    getAllProducts,
    deleteProduct,
} from '../controllers/productsControllers.js'

const router = express.Router()

// * rutas publicas
router.get('/', getAllProducts) //* obtener todos los productos

router.get('/:id', getProductById) //* Obtener productos por id

//* rutas protegidas (solo administradores pueden modificar producto)
router.post('/', createProduct) // crear producto
router.put('/:id', updateProduct) // actualizar un producto
router.delete('/:id', deleteProduct) // eliminar un producto

export default router
