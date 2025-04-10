const { errorHandler } = require("../helpers/error_handler")
const Status = require("../models/status.model")
const { statusValidation } = require("../validation/status.validation")

const addStatus = async (req, res) => {
    try {
        const {error, value} = statusValidation(req.body)
        if (error) {
            return errorHandler(error, res)
        }
        const { name, description, category } = req.body
        const newStatus = await Status.create({ name, description, category })
        res.status(201).send({ message: "New status added:", newStatus })
    } catch (error) {
        errorHandler(error, res)
    }
}

const getAllStatuses = async (req, res) => {
    try {
        const statuses = await Status.findAll()
        res.status(200).send({ statuses })
    } catch (error) {
        errorHandler(error, res)
    }
}

const updateStatusById = async (req, res) => {
    try {
        const { id } = req.params
        const {error, value} = statusValidation(req.body)
        if (error) {
            return errorHandler(error, res)
        }
        const { name, description, category } = value
        
        const [rowsUpdated, updatedStatus] = await Status.update(
            { name, description, category },
            { where: { id }, returning: true }
        )

        if (rowsUpdated === 0) {
            return res.status(404).send({ message: "Status not found" })
        }

        res.status(200).send({ updatedStatus })
    } catch (error) {
        errorHandler(error, res)
    }
}

const deleteStatusById = async (req, res) => {
    try {
        const { id } = req.params
        const deleted = await Status.destroy({ where: { id } })

        if (!deleted) {
            return res.status(404).send({ message: "Status not found" })
        }

        res.status(200).send({ message: "Status deleted" })
    } catch (error) {
        errorHandler(error, res)
    }
}

const getStatusById = async (req, res) => {
    try {
        const { id } = req.params
        const status = await Status.findByPk(id)
        if (!status) {
            return res.status(404).send({ message: "Status not found" })
        }
        res.status(200).send({ status })
    } catch (error) {
        errorHandler(error, res)
    }
}

module.exports = {
    addStatus,
    getAllStatuses,
    updateStatusById,
    deleteStatusById,
    getStatusById
}
