const { addCategory, getAllCategories, getCategoryById, updateCategoryById, deleteCategoryById } = require('../controller/categories.controller');

const router = require('express').Router();

const authGuard = require("../middlewares/guards/user.guard")
const userActiveGuard = require("../middlewares/guards/user.active.guard")

router.post("/", authGuard, userActiveGuard,addCategory)
router.get("/", authGuard, userActiveGuard,getAllCategories)
router.get("/:id",authGuard, userActiveGuard, getCategoryById)
router.put("/:id", authGuard, userActiveGuard,updateCategoryById)
router.delete("/:id", authGuard, userActiveGuard,deleteCategoryById)

module.exports = router