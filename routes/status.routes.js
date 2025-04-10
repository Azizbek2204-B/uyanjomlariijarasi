const { addStatus, getAllStatuses, getStatusById, updateStatusById, deleteStatusById } = require('../controller/status.controller');

const router = require('express').Router();

router.post("/", addStatus)
router.get("/", getAllStatuses)
router.get("/:id", getStatusById)
router.put("/:id", updateStatusById)
router.delete("/:id", deleteStatusById)

module.exports = router