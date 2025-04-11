const { addOwner, getAllOwners, getOwnerById, updateOwnerById, deleteOwnerById, loginOwner, logoutOwner, activationLink, refreshOwnerToken } = require('../controller/owner.controller');

const userGuard = require("../middlewares/guards/user.guard")
const authGuard = require("../middlewares/guards/owner.guard")
const userActiveGuard = require("../middlewares/guards/user.active.guard")
const authSelfGuard = require("../middlewares/guards/user.self.guard")
const router = require('express').Router();

router.post("/", addOwner)
router.post("/:login", loginOwner)
router.get("/",userGuard, getAllOwners)
router.get("/activate/:link", activationLink)
router.post("/logout", logoutOwner)
router.get("/refreshtoken", refreshOwnerToken);
router.get("/:id", authGuard,authSelfGuard,getOwnerById)
router.put("/:id",authGuard,authSelfGuard, updateOwnerById)
router.delete("/:id", deleteOwnerById)

module.exports = router