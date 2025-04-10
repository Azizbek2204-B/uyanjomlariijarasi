const { errorHandler } = require("../helpers/error_handler")
const Review = require("../models/reviews.model")
const { reviewValidation } = require("../validation/reviews.validation")

const addReview = async (req, res) => {
    try {
        const {error, value} = reviewValidation(req.body)
        if (error) {
            return errorHandler(error, res)
        }
        const { productId, clientId, rating, comment } = req.body
        const newReview = await Review.create({ productId, clientId, rating, comment })
        res.status(201).send({ message: "New review added:", newReview })
    } catch (error) {
        errorHandler(error, res)
    }
}

const getAllReviews = async (req, res) => {
    try {
        const reviews = await Review.findAll()
        res.status(200).send({ reviews })
    } catch (error) {
        errorHandler(error, res)
    }
}

const updateReviewById = async (req, res) => {
    try {
        const { id } = req.params
        const {error, value} = reviewValidation(req.body)
        if (error) {
            return errorHandler(error, res)
        }
        const { productId, clientId, rating, comment } = value
        
        const [rowsUpdated, updatedReview] = await Review.update(
            { productId, clientId, rating, comment },
            { where: { id }, returning: true }
        )

        if (rowsUpdated === 0) {
            return res.status(404).send({ message: "Review not found" })
        }

        res.status(200).send({ updatedReview })
    } catch (error) {
        errorHandler(error, res)
    }
}

const deleteReviewById = async (req, res) => {
    try {
        const { id } = req.params
        const deleted = await Review.destroy({ where: { id } })

        if (!deleted) {
            return res.status(404).send({ message: "Review not found" })
        }

        res.status(200).send({ message: "Review deleted" })
    } catch (error) {
        errorHandler(error, res)
    }
}

const getReviewById = async (req, res) => {
    try {
        const { id } = req.params
        const review = await Review.findByPk(id)
        if (!review) {
            return res.status(404).send({ message: "Review not found" })
        }
        res.status(200).send({ review })
    } catch (error) {
        errorHandler(error, res)
    }
}

module.exports = {
    addReview,
    getAllReviews,
    updateReviewById,
    deleteReviewById,
    getReviewById
}
