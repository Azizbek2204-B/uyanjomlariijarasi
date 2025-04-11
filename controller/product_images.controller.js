const ProductImage = require("../models/product_images.model");
const { errorHandler } = require("../helpers/error_handler");
const { productImageValidation } = require("../validation/product_images.validation");

const addProductImage = async (req, res) => {
    try {
        const {error, value} = productImageValidation(req.body)
        if (error) {
            return errorHandler(error, res)
        }
        const { productId, image_url, is_primary, uploaded_at } = value;
        const newImage = await ProductImage.create({ productId, image_url, is_primary , uploaded_at});
        res.status(201).send({ message: "Image added", newImage });
    } catch (err) {
        errorHandler(err, res);
    }
};

const getAllProductImages = async (req, res) => {
    try {
        const images = await ProductImage.findAll();
        res.status(200).send({ images });
    } catch (err) {
        errorHandler(err, res);
    }
};

const getProductImageById = async (req, res) => {
    try {
        const { id } = req.params;
        const image = await ProductImage.findByPk(id);

        if (!image) return res.status(404).send({ message: "Image not found" });

        res.status(200).send({ image });
    } catch (err) {
        errorHandler(err, res);
    }
};

const updateProductImageById = async (req, res) => {
    try {
        const { id } = req.params;
        const { error } = productImageValidation(req.body);
        if (error) return res.status(400).send(error.details);

        const [rows, data] = await ProductImage.update(req.body, {
            where: { id },
            returning: true
        });

        if (rows === 0) return res.status(404).send({ message: "Image not found" });

        res.status(200).send({ message: "Image updated", updated: data[0] });
    } catch (err) {
        errorHandler(err, res);
    }
};

const deleteProductImageById = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await ProductImage.destroy({ where: { id } });

        if (!deleted) return res.status(404).send({ message: "Image not found" });

        res.status(200).send({ message: "Image deleted" });
    } catch (err) {
        errorHandler(err, res);
    }
};

module.exports = {
    addProductImage,
    getAllProductImages,
    getProductImageById,
    updateProductImageById,
    deleteProductImageById
};