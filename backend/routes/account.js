const { Account } =require('../db');
const JWT_SECRET = ('../config');
const authMiddleWare = require('../middleware/middleware');
const mongoose = require('mongoose')
const zod = require('zod');
const jwt = require('jsonwebtoken');
const express = require('express');
const app = express();
app.use(express.json());
const router = express.Router();



router.get("/balance", authMiddleWare , async (req, res) => {
    const account = await Account.findOne({
        userId: req.userId
    });

    res.json({
        balance: account.balance,
        name : req.name
    })
});
router.post('/transfer' ,authMiddleWare , async function(req,res){
    try{

            const session = await mongoose.startSession();
            session.startTransaction();
            const id = req.body.to;
            const amount = req.body.amount;
            if (amount <= 0) {
                return res.status(400).json({
                    message: "Amount must be a positive number , Payment Failed"
                });
            }
            const account = await Account.findOne({
                userId: req.userId
            }).session(session);
    
            if (!account || account.balance < amount) {
                await session.abortTransaction();
                return res.status(400).json({
                    message: "Insufficient balance"
                })
            }
        
            const toAccount = await Account.findOne({
                userId: id
            }).session(session);
    
            if (!toAccount) {
                await session.abortTransaction();
                return res.status(400).json({
                    message: "Invalid account"
                })
            }
            
    
            await Account.updateOne({
                userId: req.userId
            }, {
                $inc: {
                    balance: -amount
                }
            }).session(session);
        
            await Account.updateOne({
                userId: id
            }, {
                $inc: {
                    balance: amount
                }
            }).session(session);
            await session.commitTransaction();
            res.json({
                message: "Transfer successful"
            })
    
    

    }catch(e){
        res.status(400).json({
            message:"Error has Occured"
        })
    }
    

} )
module.exports = router


