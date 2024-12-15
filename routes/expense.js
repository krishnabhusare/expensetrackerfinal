const express = require('express');
const expensecontroller = require('../controllers/expense');

const router = express.Router();

router.post('/add-expense',expensecontroller.addExpense);
router.get('/get-expense',expensecontroller.getExpense);
router.delete('/delete-expense/:id',expensecontroller.deleteExpense);
router.get('/download',expensecontroller.downloadExpense);




module.exports =router;