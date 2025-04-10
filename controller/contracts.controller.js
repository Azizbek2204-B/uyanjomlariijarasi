const { errorHandler } = require("../helpers/error_handler")
const Contract = require("../models/contract.model")
const { contractValidation } = require("../validation/contract.validation")

const addContract = async (req, res) => {
    try {
        const {error, value} = contractValidation(req.body)
        if (error) {
            return errorHandler(error, res)
        }
        const {
            clientId,
            ownerId,
            begin_date,
            end_date,
            statusId,
            created_at,
            updated_at,
            productId
        } = value;

        const newContract = await Contract.create({
            clientId,
            ownerId,
            begin_date,
            end_date,
            statusId,
            created_at,
            updated_at,
            productId
        })

        res.status(201).send({ message: "New contract added", newContract })
    } catch (error) {
        errorHandler(error, res)
    }
}

const getAllContracts = async (req, res) => {
    try {
        const contracts = await Contract.findAll()
        res.status(200).send({ contracts })
    } catch (error) {
        errorHandler(error, res)
    }
}

const getContractById = async (req, res) => {
    try {
        const { id } = req.params
        const contract = await Contract.findByPk(id)

        if (!contract) {
            return res.status(404).send({ message: "Contract not found" })
        }

        res.status(200).send({ contract })
    } catch (error) {
        errorHandler(error, res)
    }
}

const updateContractById = async (req, res) => {
    try {
        const { id } = req.params
        const {error, value} = contractValidation(req.body)
        if (error) {
            return errorHandler(error, res)
        }
        const {
            clientId,
            ownerId,
            begin_date,
            end_date,
            statusId,
            created_at,
            updated_at,
            product_id
        } = value

        const [rowsUpdated, updatedContract] = await Contract.update(
            {
                clientId,
                ownerId,
                begin_date,
                end_date,
                statusId,
                created_at,
                updated_at,
                product_id
            },
            { where: { id }, returning: true }
        )

        if (rowsUpdated === 0) {
            return res.status(404).send({ message: "Contract not found" })
        }

        res.status(200).send({ updatedContract })
    } catch (error) {
        errorHandler(error, res)
    }
}

const deleteContractById = async (req, res) => {
    try {
        const { id } = req.params
        const deleted = await Contract.destroy({ where: { id } })

        if (!deleted) {
            return res.status(404).send({ message: "Contract not found" })
        }

        res.status(200).send({ message: "Contract deleted" })
    } catch (error) {
        errorHandler(error, res)
    }
}

module.exports = {
    addContract,
    getAllContracts,
    getContractById,
    updateContractById,
    deleteContractById
}
