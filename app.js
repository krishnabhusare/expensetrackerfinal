require('dotenv').config();
const express = require('express');
const cors = require('cors');

const sequelize = require('./util/database');
const User = require('./models/user');
const Expense = require('./models/expense');

const Order = require('./models/order');
const Forgotpassword = require('./models/forgotpassword');
const path = require('path');
path.dirname('');
const userRoutes = require('./routes/user');
const expenseRoutes = require('./routes/expense');
const passwordroutes = require('./routes/password');
const premiumroutes = require('./routes/premium');


const app = express();
app.use(cors());
app.use(express.json());

app.use('/user', userRoutes);


app.use('/expense',expenseRoutes );

app.use('/premium',premiumroutes );

app.use('/password',passwordroutes );

app.use((req,res,next)=>{
    res.sendFile(path.join(__dirname,`public/${req.url}`));
})



User.hasMany(Expense);
Expense.belongsTo(User);


User.hasMany(Order);
Order.belongsTo(User);

User.hasMany(Forgotpassword);
Forgotpassword.belongsTo(User);



sequelize.sync({})

    .then(() => {

        app.listen(3000);
    })