const { getRentedProducts, getDamagedClients, getCancelledClients, getTopOwners, getClientPayments } = require('../controller/qisqasorovlar.controller');
const userGuard = require('../middlewares/guards/user.guard');

const router = require('express').Router();

router.post('/rentedproducts',userGuard,  getRentedProducts);
router.post('/damagedclients',userGuard,  getDamagedClients);
router.post('/cancelledclients',userGuard, getCancelledClients);
router.post('/topowners',userGuard,  getTopOwners);
router.post('/payments',userGuard, getClientPayments);

module.exports = router;
