const { addClient, getAllClients, getClientById, updateClientById, deleteClientById, loginClient, logoutClient, activationLink, refreshClientToken } = require('../controller/client.controller');

const router = require('express').Router();

const authGuard = require("../middlewares/guards/client.self.guard")
const authSelfGuard = require("../middlewares/guards/user.self.guard")
const userActiveGuard = require("../middlewares/guards/user.active.guard")
const userGuard = require("../middlewares/guards/user.guard")

router.post("/", addClient)
router.post("/:login", loginClient)
router.get("/",userGuard, userActiveGuard, getAllClients)
router.get("/activate/:link", activationLink);
router.post("/logout", logoutClient)
router.get("/refreshtoken", refreshClientToken);    
router.get("/:id",authGuard, authSelfGuard, getClientById)
router.put("/:id", authGuard,authSelfGuard, updateClientById)
router.delete("/:id",authGuard,authSelfGuard, deleteClientById)

module.exports = router