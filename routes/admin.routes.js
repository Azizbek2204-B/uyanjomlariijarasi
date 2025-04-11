const { addAdmin, getAllAdmin, getAdminById, updateAdminById, deleteAdminById, loginAdmin, logoutAdmin, changeIsActive, refreshAdmintToken } = require('../controller/admin.controller');
const router = require('express').Router();

const authGuard = require("../middlewares/guards/user.guard");
const authSelfGuard = require("../middlewares/guards/user.self.guard");
const authAdminGuard = require('../middlewares/guards/user.admin.guard');
const userActiveGuard = require("../middlewares/guards/user.active.guard");

router.post("/", addAdmin)
router.post("/logout", authGuard, logoutAdmin);
router.get("/",authGuard, authAdminGuard, getAllAdmin)
router.post("/:login", loginAdmin);
router.get("/refreshtoken", refreshAdmintToken);
router.get("/:id",authGuard, userActiveGuard,authSelfGuard, getAdminById)
router.put("/:id", authGuard,authSelfGuard, updateAdminById)
router.delete("/:id",authGuard,authAdminGuard, deleteAdminById)

module.exports = router