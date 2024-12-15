const express = require('express');
const expensecontroller = require('../controllers/expense');
const userAuthentication = require('../middleware/auth');

const router = express.Router();

router.post('/add-expense',userAuthentication.authenticate,expensecontroller.addExpense);
router.get('/get-expense',userAuthentication.authenticate,expensecontroller.getExpense);
router.delete('/delete-expense/:id',userAuthentication.authenticate,expensecontroller.deleteExpense);
router.get('/download',userAuthentication.authenticate,expensecontroller.downloadExpense);




module.exports =router;