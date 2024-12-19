const Expense = require('../models/expense');
const DownloadedFile = require('../models/downloadedfile');
const User = require('../models/user');
const AWS = require('aws-sdk');
const sequelize = require('../util/database');




function uploadtos3(data,filename){
    const BUCKET_NAME=process.env.BUCKET_NAME;
    const IAM_USER_KEY=process.env.IAM_USER_KEY;
    const IAM_USER_SECRET=process.env.IAM_USER_SECRET;
 
    let s3bucket =   new AWS.S3({
     accessKeyId:IAM_USER_KEY,
     secretAccessKey:IAM_USER_SECRET
 
    })
 
    
     var params = {
         Bucket:BUCKET_NAME,
         Key:filename,
         Body:data,
         ACL:'public-read'
     }
 
     return new Promise((resolve,reject)=>{
         s3bucket.upload(params,(err, s3response)=>{
             if(err){
                 console.log('somethin went wrong');
                 reject(err);
             }else{
                 
                 resolve(s3response.Location);
             }
         })
     })
 
     
    
 }

const addExpense = async (req, res, next) => {
    const t = await sequelize.transaction();
    try {


        const { amount, description, category } = req.body;



        const expenseData = await Expense.create({ amount, description, category, userId: req.user.id }, { transaction: t });

        const totalexpense = Number(req.user.totalexpense) + Number(amount);
        await User.update({
            totalexpense: totalexpense
        }, { where: { id: req.user.id }, transaction: t })
        await t.commit();


        res.status(201).json({ message: 'added expense successfully', expenseData });


    } catch (err) {
        await t.rollback();
        res.status(500).json({ message: 'failed to add expense', err });
    }
}

const deleteExpense = async (req, res, next) => {
    const t = await sequelize.transaction();
    try {
        const uid = req.params.id;

        const amount = await Expense.findAll({ where: { id: uid }, attributes: ['amount'], transaction: t });





        const dlt = await Expense.destroy({ where: { id: uid, userId: req.user.id } ,transaction:t});
        const totalexpense = Number(req.user.totalexpense) - Number(amount[0].amount);
        await User.update({
            totalexpense: totalexpense
        }, { where: { id: req.user.id }, transaction: t });
        await t.commit();


        if (dlt == 0) {
            res.status(400).json({ message: 'expense not belongs to user' })
        } else {
            res.status(200).json({ message: 'successfully deleted expense' });
            const totalexpense = req.user.totalexpense;

        }





    } catch (err) {
        await t.rollback();
        res.status(500).json({ message: 'failed to delete expense', err });
    }
}

const getExpense = async (req, res, next) => {
    try {


        const allExpense = await Expense.findAll({ where: { userId: req.user.id } });

        res.status(200).json({ message: 'geting all expenses successfully', allExpense });

    } catch (err) {
        res.status(500).json({ message: 'failed to get expense', err });
    }
}


const downloadExpense = async(req,res,next)=>{
    try{

        if(req.user.ispremiumuser==null){
            return console.log('user is not premium');
        }
        const expenses = await req.user.getExpenses();
       
        
        const stringifiedexpenses = JSON.stringify(expenses);
        
        const userId = req.user.id;

        const filename = `Expense${userId}/${new Date()}.txt`;
        
        const fileUrl = await uploadtos3(stringifiedexpenses,filename);

        const files = await DownloadedFile.create({fileurl:fileUrl,userId:req.user.id,filename});


       
        res.status(200).json({message:'successfully downloaded expense',fileUrl,files});

    }catch(err){
        res.status(500).json({message:'failed while downloading expense ',err});
    }
}



module.exports = {
    addExpense,
    deleteExpense,
    getExpense,
    downloadExpense
}