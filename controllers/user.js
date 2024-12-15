const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

function tokengenerator(id, ispremiumuser) {
    return jwt.sign({ userId: id, ispremiumuser },process.env.BCRYPT_SECRETE_KEY);
}


const userSignup = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;
        const saltRound = 3;
        bcrypt.hash(password, saltRound, async (err, hash) => {
           
            try{
                const signup = await User.create({ name, email, password: hash });
           
                res.status(201).json({ message: 'signup successfull', signup });
            }
            catch(err){
                res.status(500).json({message:'user already exist'});
            }
            

        })


    } catch (err) {
        res.status(500).json({ message: 'failed in signup', err });
    }
}

const userLogin = async (req, res, next) => {
    try {

        const { email, password } = req.body;

        const user = await User.findAll({ where: { email } });

        if (user.length === 1) {
            bcrypt.compare(password, user[0].password, (err, result) => {
                if (result) {


                    res.status(201).json({ message: 'login successfull', token: tokengenerator(user[0].id, user[0].ispremiumuser) });   
                }
                else {
                    res.status(401).json({ message: 'wrong password' });
                }
            })

        } else {
            res.status(404).json({ message: 'user not found pl sign up' });
        }



    } catch (err) {
        res.status(500).json({ message: 'login failed', err });
    }
}



module.exports = {
    userSignup,
    userLogin

}