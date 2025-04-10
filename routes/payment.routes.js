const { addPayment, getAllPayments, getPaymentById, deletePaymentById, updatePaymentById } = require('../controller/payment.controller');
const router = require('express').Router();

const authGuard = require("../middlewares/guards/user.guard")
const userActiveGuard = require("../middlewares/guards/user.active.guard")

router.post("/", authGuard, userActiveGuard, addPayment)
router.get("/", authGuard, userActiveGuard, getAllPayments)
router.get("/:id", authGuard, userActiveGuard, getPaymentById)
router.put("/:id",  authGuard, userActiveGuard,updatePaymentById)
router.delete("/:id",  authGuard, userActiveGuard, deletePaymentById)

module.exports = router