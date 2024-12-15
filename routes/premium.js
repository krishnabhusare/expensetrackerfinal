const express = require('express');
const premiumcontroller = require('../controllers/premium');

const router = express.Router();

router.get('/buy-premium',premiumcontroller.buyPremium);

router.post('/updatetransictionstatus',premiumcontroller.updateTransactionstatus);

router.get('/showleaderboard',premiumcontroller.showLeaderboard);



module.exports = router;