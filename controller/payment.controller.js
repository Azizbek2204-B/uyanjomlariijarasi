const { errorHandler } = require("../helpers/error_handler");
const Payment = require("../models/payment.model");
const { paymentValidation } = require("../validation/payment.validation");

const addPayment = async (req, res) => {
    try {
        const {error, value} = paymentValidation(req.body)
        if (error) {
            return errorHandler(error, res)
        }
        const {
            contractId,
            amount,
            payment_date,
            payment_method,
            transactionId,
            statusId
        } = value;

        const newPayment = await Payment.create({
            contractId,
            amount,
            payment_date,
            payment_method,
            transactionId,
            statusId
        });

        res.status(201).send({ message: "New payment added", newPayment });
    } catch (error) {
        errorHandler(error, res);
    }
};

const getAllPayments = async (req, res) => {
    try {
        const payments = await Payment.findAll();
        res.status(200).send({ payments });
    } catch (error) {
        errorHandler(error, res);
    }
};

const getPaymentById = async (req, res) => {
    try {
        const { id } = req.params;
        const payment = await Payment.findByPk(id);

        if (!payment) {
            return res.status(404).send({ message: "Payment not found" });
        }

        res.status(200).send({ payment });
    } catch (error) {
        errorHandler(error, res);
    }
};

const updatePaymentById = async (req, res) => {
    try {
        const { id } = req.params;
        const {error, value} = paymentValidation(req.body)
        if (error) {
            return errorHandler(error, res)
        }
        const {
            contractId,
            amount,
            payment_date,
            payment_method,
            transactionId,
            statusId
        } = value;

        const [rowsUpdated, updatedPayment] = await Payment.update(
            {
                contractId,
                amount,
                payment_date,
                payment_method,
                transactionId,
                statusId
            },
            { where: { id }, returning: true }
        );

        if (rowsUpdated === 0) {
            return res.status(404).send({ message: "Payment not found" });
        }

        res.status(200).send({ updatedPayment });
    } catch (error) {
        errorHandler(error, res);
    }
};

const deletePaymentById = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await Payment.destroy({ where: { id } });

        if (!deleted) {
            return res.status(404).send({ message: "Payment not found" });
        }

        res.status(200).send({ message: "Payment deleted" });
    } catch (error) {
        errorHandler(error, res);
    }
};

module.exports = {
    addPayment,
    getAllPayments,
    getPaymentById,
    updatePaymentById,
    deletePaymentById
};
