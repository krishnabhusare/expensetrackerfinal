const Order = require('../models/order');
const jwt = require('jsonwebtoken');
const Razorpay = require('razorpay');
const User = require('../models/user');


function tokengenerator(id, ispremiumuser) {
    return jwt.sign({ userId: id, ispremiumuser },process.env.BCRYPT_SECRETE_KEY);
}

const buyPremium = async (req, res, next) => {
    try {

        const rzp = new Razorpay({
            key_id: process.env.key_id,
            key_secret: process.env.key_secret
        });

        const amount = 2000;

        rzp.orders.create({ amount, currency: "INR" }, (err, order) => {
            if (order) {
                req.user.createOrder({ orderid: order.id, status: 'PENDING' }).then(result => {
                    return res.status(201).json({ order, key_id: rzp.key_id });
                })
            }
        })




    } catch (err) {
        res.status(500).json({ message: 'failed to buy premium', err })
    }
}

const updateTransactionstatus = async (req, res, next) => {
    try {
        const userId = req.user.id;

        const { order_id, payment_id } = req.body;
        const order = await Order.findOne({ where: { orderid: order_id } })

        const promise1 = order.update({ paymentid: payment_id, status: 'SUCCESS' });
        const promise2 = req.user.update({ ispremiumuser: true });

        Promise.all([promise1, promise2]).then(() => {



            res.status(202).json({ message: 'you are a premium user now', token: tokengenerator(userId, true) });
        })




    }

    catch (err) {


        res.status(500).json({ message: 'failed updating purchase  status' }, err);
    }



}

const showLeaderboard = async (req, res, next) => {
    try {
        const leaderboard = await User.findAll({
            attributes: ['name', 'totalexpense'],
            order: [['totalexpense', 'DESC']]

        });

        res.status(200).json({ message: 'get leaderboard successfully', leaderboard })

    } catch (err) {
        res.status(500).json({ message: 'failed to get leaderboard', err });
    }
}





module.exports = {
    buyPremium,
    updateTransactionstatus,
    showLeaderboard
}