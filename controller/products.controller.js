const { errorHandler } = require("../helpers/error_handler");
const Product = require("../models/product.model");
const { productValidation } = require("../validation/product.validation");

const addProduct = async (req, res) => {
    try {
        const {error, value} = productValidation(req.body)
        if (error) {
            return errorHandler(error, res)
        }
        const {
            name,
            description,
            price,
            categoryId,
            ownerId,
            created_at,
            updated_at,
            is_available,
            rent_price
        } = value;

        const newProduct = await Product.create({
            name,
            description,
            price,
            categoryId,
            ownerId,
            created_at,
            updated_at,
            is_available,
            rent_price
        });

        res.status(201).send({ message: "New product added", newProduct });
    } catch (error) {
        errorHandler(error, res);
    }
};

const getAllProducts = async (req, res) => {
    try {
        const products = await Product.findAll();
        res.status(200).send({ products });
    } catch (error) {
        errorHandler(error, res);
    }
};

const getProductById = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findByPk(id);

        if (!product) {
            return res.status(404).send({ message: "Product not found" });
        }

        res.status(200).send({ product });
    } catch (error) {
        errorHandler(error, res);
    }
};

const updateProductById = async (req, res) => {
    try {
        const { id } = req.params;
        const {error, value} = reviewValidation(req.body)
        if (error) {
            return errorHandler(error, res)
        }
        const {
            name,
            description,
            price,
            categoryId,
            ownerId,
            created_at,
            updated_at,
            is_available,
            rent_price
        } = value;

        const [rowsUpdated, updatedProduct] = await Product.update(
            {
                name,
                description,
                price,
                categoryId,
                ownerId,
                created_at,
                updated_at,
                is_available,
                rent_price
            },
            { where: { id }, returning: true }
        );

        if (rowsUpdated === 0) {
            return res.status(404).send({ message: "Product not found" });
        }

        res.status(200).send({ updatedProduct });
    } catch (error) {
        errorHandler(error, res);
    }
};

const deleteProductById = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await Product.destroy({ where: { id } });

        if (!deleted) {
            return res.status(404).send({ message: "Product not found" });
        }

        res.status(200).send({ message: "Product deleted" });
    } catch (error) {
        errorHandler(error, res);
    }
};

module.exports = {
    addProduct,
    getAllProducts,
    getProductById,
    updateProductById,
    deleteProductById
};
