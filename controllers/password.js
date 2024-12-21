const Forgotpassword = require('../models/forgotpassword');
const Sib = require('sib-api-v3-sdk');
const uuid = require('uuid');
const User = require('../models/user');
const bcrypt = require('bcrypt');


const forgotPassword = async (req, res, next) => {

    Sib.ApiClient.instance.authentications['api-key'].apiKey =process.env.forgot_password_key;
    const apiInstance = new Sib.TransactionalEmailsApi();

    try {

        const { email } = req.body;
        

        const user = await User.findOne({where:{email}});
       

        if(user){
        
        const id = uuid.v4();
        await user.createForgotpassword({id,active:true});

        

        const sendSmtpEmail = new Sib.SendSmtpEmail();

        sendSmtpEmail.sender = { email: 'krishnabhusare1996@gmail.com', name: 'krishna' };
        sendSmtpEmail.to = [{ email: email, name: 'kanha' }];
        sendSmtpEmail.subject = 'reset expense tracking app password';
        sendSmtpEmail.textContent = 'This is a test email sent from Node.js using Brevo.';
        sendSmtpEmail.htmlContent = `<a href="http://15.207.20.132:3000/password/resetpassword/${id}">Reset password</a>`;


        await apiInstance.sendTransacEmail(sendSmtpEmail).then(response=>{
         return res.status(200).json({message: 'Link to reset password sent to your mail ', sucess: true})})
        
        }else{
         throw new Error('user doesnt exist');
        }

    } catch (err) {
        
        res.status(500).json({ messge: 'faild while forgetting password', err });
    }

}


const resetPassword = async(req,res,next)=>{
    try{
        const id = req.params.id;
        Forgotpassword.findOne({where:{id}}).then(result=>{
            if(result){
                result.update({active:false});
                res.status(200).send(`<html>
                    <form action="/password/updatepassword/${id}">
                        <label for="newpassword">Enter new password:</label>
                        <input type="password" name="newpassword" id="newpassword" required>
                        <button>reset password</button>
                    </form>
                                      </html>`
                                     )
                res.end();
             }
        })

    }
    catch(err){
        res.status(500).json({message:'failed while reseting password',err});
    }
}
const updatePassword = async(req,res,next)=>{
try{
    const {newpassword} = req.query;
    const {resetpasswordid} = req.params;
    Forgotpassword.findOne({where:{id:resetpasswordid}}).then(resetpasswordrequest=>{
        User.findOne({where:{id:resetpasswordrequest.userId}}).then(user=>{
            if(user){
                const saltRound = 10;
                bcrypt.hash(newpassword,saltRound,(err,hash)=>{
                    if(hash){
                        user.update({password:hash}).then(()=>{
                            res.status(201).json({message:'successfully updated new password'});
                        })
                    }
                })
            }
        })
    })
    
    

}catch(err){
    res.status(500).json({message:'failed while updating password',err})
}
}


module.exports = {
    forgotPassword,
    resetPassword,
    updatePassword
}