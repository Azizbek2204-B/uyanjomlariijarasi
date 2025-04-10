const { addProduct, getAllProducts, getProductById, updateProductById, deleteProductById } = require('../controller/products.controller');

const router = require('express').Router();

const authGuard = require("../middlewares/guards/user.guard")
const userActiveGuard = require("../middlewares/guards/user.active.guard")

router.post("/", authGuard, userActiveGuard, addProduct)
router.get("/", authGuard, userActiveGuard, getAllProducts)
router.get("/:id", authGuard, userActiveGuard, getProductById)
router.put("/:id", authGuard, userActiveGuard, updateProductById)
router.delete("/:id", authGuard, userActiveGuard, deleteProductById)

module.exports = router