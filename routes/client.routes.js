const { addClient, getAllClients, getClientById, updateClientById, deleteClientById, loginClient, logoutClient, activationLink, refreshClientToken } = require('../controller/client.controller');

const router = require('express').Router();

const userGuard = require("../middlewares/guards/user.guard")
const authGuard = require("../middlewares/guards/client.self.guard")
const userActiveGuard = require("../middlewares/guards/user.active.guard")
const authSelfGuard = require("../middlewares/guards/user.self.guard")

router.post("/", addClient)
router.post("/:login", loginClient)
router.get("/",userGuard, getAllClients)
router.get("/activate/:link", activationLink);
router.post("/logout", logoutClient)
router.get("/refreshtoken", refreshClientToken);    
router.get("/:id",authGuard, userActiveGuard, authSelfGuard, getClientById)
router.put("/:id", authGuard, userActiveGuard,authSelfGuard, updateClientById)
router.delete("/:id",userGuard, deleteClientById)

module.exports = router