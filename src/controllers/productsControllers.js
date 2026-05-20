import { productSchema } from '../schemas/productSchema.js'
import ProductModel from '../models/ProductModel.js'
import { ZodError } from 'zod'

// crear producto
export const createProduct = async (req, res) => {
    try {
        // * traer los datos del producto
        const { name, description, price, stock, imageUrl } =
            productSchema.parse(req.body)

        //* creamos el producto
        const product = await ProductModel.create({
            name,
            description,
            price,
            stock,
            imageUrl,
        })

        //* devolvemos el producto al frontend
        return res
            .status(201)
            .json({ message: 'Producto creado exitosamente', product })
    } catch (error) {
        if (error instanceof ZodError) {
            return res
                .status(400)
                .json(error.issues.map((issue) => ({ message: issue.message })))
        }

        return res.status(500).json({ message: 'Error al crear el producto' })
    }
}

// actualizar producto
export const updateProduct = async (req, res) => {
    try {
        //* 1.- validar los datos de entrada con zod
        const validateData = productSchema.partial().parse(req.body)
        //res.json(validateData)

        //* 2.- Buscar y actualizar el producto desde la bd
        const updatedProduct = await ProductModel.findByIdAndUpdate(
            req.params.id,
            validateData,
            { new: true, runValidators: true }
        )
        //* manejar el caso de que el producto no exista
        if (!updatedProduct) {
            return res.status(404).json({ message: 'Producto no encontrado' })
        }
        //* Devolver el producto actualizado
        return res.status(200).json(updatedProduct)
    } catch (error) {
        res.json({ message: 'Error al actualizar producto' })
    }
}

//* Obtener producto por ID
export const getProductById = async (req, res) => {
    try {
        const product = await ProductModel.findById(req.params.id)
        return res.status(200).json(product)
    } catch (error) {
        return res.status(500).json({ message: 'Error al obtener el producto' })
    }
}

//* Obtener todos los productos
export const getAllProducts = async (req, res) => {
    try {
        const products = await ProductModel.find()
        return res.status(200).json(products)
    } catch (error) {
        return res
            .status(500)
            .json({ message: 'Error al obtener los productos' })
    }
}

//* Eliminar un producto por ID
export const deleteProduct = async (req, res) => {
    try {
        const product = await ProductModel.findByIdAndDelete(req.params.id)
        return res.status(200).json(product)
    } catch (error) {
        return res
            .status(500)
            .json({ message: 'Error al eliminar el producto' })
    }
}
