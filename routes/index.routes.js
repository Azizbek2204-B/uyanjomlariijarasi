const router = require('express').Router();

router.use("/admin", require("./admin.routes"))
router.use("/owner", require("./owner.routes"))
router.use("/client", require("./client.routes"))
router.use("/categories", require("./categories.routes"))
router.use("/contract", require("./contract.routes"))
router.use("/payment", require("./payment.routes"))
router.use("/productimage", require("./product_images.routes"))
router.use("/product", require("./product.routes"))
router.use("/review", require("./reviews.routes"))
router.use("/status", require("./status.routes"))

router.use("/qisqasorovlar", require("./qisqasorovlar.routes"))

module.exports = router