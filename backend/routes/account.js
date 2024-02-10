const { default: mongoose } = require('mongoose');
const { Account } = require('../db');
const { authMiddleware } = require('../middlewares/middleware');

const router=require('express').Router();


router.get('/balance',authMiddleware,async(req,res)=>{
    const account=await Account.findOne({
        userId:req.userId
    })
    res.status(200).json({
        balance:account.balance
    })

})

router.post('/transfer',authMiddleware,async(req,res)=>{
    const session=await mongoose.startSession();

    session.startTransaction();
    const {amount,to}=req.body;

    const account=await Account.findOne({
        userId:req.userId
    })

    if(!account || account.balance<amount){
        await session.abortTransaction();
        return res.status(400).json({
            message:"Insufficent balance"
        })
    }

    const toAccount = await Account.findOne({userId:to}).session(session);


    if(!toAccount){
        await session.abortTransaction();
        return res.status(400).json({
            message:"Invalid account"
        })
    }

    await Account.updateOne({userId:req.userId},{$in:{balance: -amount}}).session(session)
    await Account.updateOne({userId:to},{$in:{balance: amount}}).session(session);

    await session.commitTransaction();
    res.json({
        message:"Transfer succesful"
    })
})

module.exports=router;
