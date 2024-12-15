const express = require('express');
const premiumcontroller = require('../controllers/premium');
const userAuthentication = require('../middleware/auth');

const router = express.Router();

router.get('/buy-premium',userAuthentication.authenticate,premiumcontroller.buyPremium);

router.post('/updatetransictionstatus',userAuthentication.authenticate,premiumcontroller.updateTransactionstatus);

router.get('/showleaderboard',userAuthentication.authenticate,premiumcontroller.showLeaderboard);



module.exports = router;