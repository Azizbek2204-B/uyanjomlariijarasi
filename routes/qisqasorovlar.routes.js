const { getRentedProducts, getDamagedClients, getCancelledClients, getTopOwners, getClientPayments } = require('../controller/qisqasorovlar.controller');

const router = require('express').Router();

router.post('/rentedproducts', getRentedProducts);
router.post('/damagedclients', getDamagedClients);
router.post('/cancelledclients', getCancelledClients);
router.post('/topowners', getTopOwners);
router.post('/payments', getClientPayments);

module.exports = router;
