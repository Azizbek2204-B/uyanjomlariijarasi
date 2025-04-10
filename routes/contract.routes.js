const { addContract, getAllContracts, getContractById, updateContractById, deleteContractById } = require('../controller/contracts.controller');

const router = require('express').Router();

const authGuard = require("../middlewares/guards/user.guard")
const userActiveGuard = require("../middlewares/guards/user.active.guard")

router.post("/", authGuard, userActiveGuard, addContract)
router.get("/", authGuard, userActiveGuard, getAllContracts)
router.get("/:id", authGuard, userActiveGuard ,getContractById)
router.put("/:id", authGuard, userActiveGuard, updateContractById)
router.delete("/:id", authGuard, userActiveGuard, deleteContractById)

module.exports = router