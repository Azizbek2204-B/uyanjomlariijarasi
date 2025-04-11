const { addCategory, getAllCategories, getCategoryById, updateCategoryById, deleteCategoryById } = require('../controller/categories.controller');

const router = require('express').Router();

const authGuard = require("../middlewares/guards/user.guard")
const userActiveGuard = require("../middlewares/guards/user.active.guard")
const ownerguard = require("../middlewares/guards/owner.guard")

router.post("/", authGuard, userActiveGuard,addCategory)
router.post("/owner", ownerguard, userActiveGuard,addCategory)
router.get("/", authGuard, userActiveGuard,getAllCategories)
router.get("/owner", ownerguard, userActiveGuard,getAllCategories)
router.get("/:id",authGuard, userActiveGuard, getCategoryById)
router.put("/:id", authGuard, userActiveGuard,updateCategoryById)
router.put("/owner/:id", ownerguard, userActiveGuard,updateCategoryById)
router.delete("/:id", authGuard, userActiveGuard,deleteCategoryById)

module.exports = router