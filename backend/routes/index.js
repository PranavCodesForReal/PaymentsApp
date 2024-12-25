const express = require('express');
const router = express.Router();
const userRouter = require('./user');
const accountRouter = require('./account');
const authMiddleWare = require('../middleware/middleware');

router.use(express.json());
router.use('/user',userRouter);
router.use('/account',accountRouter);

router.get('/me' , authMiddleWare,function(req,res){
    res.send({
        message : "Verified"
    })
})

module.exports = router

