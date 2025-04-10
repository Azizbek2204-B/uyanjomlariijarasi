const { getAllProductImages, addProductImage, getProductImageById, updateProductImageById, deleteProductImageById } = require('../controller/product_images.controller');
const router = require('express').Router();

const authGuard = require("../middlewares/guards/user.guard")
const userActiveGuard = require("../middlewares/guards/user.active.guard")

router.post("/", authGuard, userActiveGuard, addProductImage)
router.get("/", authGuard, userActiveGuard, getAllProductImages)
router.get("/:id", authGuard, userActiveGuard, getProductImageById)
router.put("/:id",  authGuard, userActiveGuard, updateProductImageById)
router.delete("/:id",  authGuard, userActiveGuard, deleteProductImageById)

module.exports = router