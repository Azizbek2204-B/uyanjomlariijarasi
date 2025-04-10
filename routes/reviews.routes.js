const { addReview, getAllReviews, getReviewById, updateReviewById, deleteReviewById } = require('../controller/reviews.controller');

const router = require('express').Router();

const authGuard = require("../middlewares/guards/user.guard")
const userActiveGuard = require("../middlewares/guards/user.active.guard")

router.post("/", authGuard, userActiveGuard, addReview)
router.get("/", authGuard, userActiveGuard, getAllReviews)
router.get("/:id", authGuard, userActiveGuard, getReviewById)
router.put("/:id", authGuard, userActiveGuard, updateReviewById)
router.delete("/:id", authGuard, userActiveGuard, deleteReviewById)

module.exports = router