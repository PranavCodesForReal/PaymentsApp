const express = require('express');
const router = express.Router();
const { authorization, secondMiddleWare } = require('../middleware/auth');
const JWT_SECRET = require('../config');
const zod = require('zod');
const { Account, User } = require('../db');
const { SigninSchema } = require('../zodschema/schema');
const jwt = require('jsonwebtoken');
const authMiddleWare = require('../middleware/middleware');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());
const updateBody = zod.object({
	password: zod.string().min(6).optional(),
    firstName: zod.string().max(30).optional(),
    lastName: zod.string().max(30).optional(),
})

router.post('/signup' ,authorization, secondMiddleWare ,async function(req,res){
    const dbUser = await User.create(req.body);
    await Account.create({
        userId : dbUser._id,
        balance : 1 + (Math.random() * 10000)
    })
    var token = jwt.sign({
        userId : dbUser._id
    }, JWT_SECRET);
    res.json({
        message: "User created successfully",
        token: token
    })

})

router.post('/signin' , async function(req,res){
    const data = req.body;
    const output = SigninSchema.safeParse(data);
    if(output.success){
        const username = req.body.username;
        const password = req.body.password;
        const user = await User.findOne({username : username , password : password});

        if(user){
            var token = jwt.sign({
                userId : user._id
            } , JWT_SECRET);

            res.json({
                message : "User Signed in",
                token : token
            })
        }
        else{
            res.status(411).json({
                message: "Error while logging in"
            })
        } 
    }
    else{
        res.status(411).json({
            message: "Error while logging in"
        })
    }
   
})
router.put('/', authMiddleWare, async function(req, res) {
    const data = req.body;

    const ans = updateBody.safeParse(data);

    if (ans.success) {

        if (data.password && data.password.length === 0) {
            delete data.password;
        }
        if (data.firstName && data.firstName.length === 0) {
            delete data.firstName;
        }
        if (data.lastName && data.lastName.length === 0) {
            delete data.lastName;
        }

   
        const updateData = {};
        Object.keys(data).forEach((key) => {
            if (data[key] !== undefined) {
                updateData[key] = data[key];
            }
        });


        const userId = req.userId;
        try {
            const result = await User.updateOne({ _id: userId }, updateData);
            
            if (result.modifiedCount > 0) {
                res.json({
                    message: "Updated successfully"
                });
            } else {
                res.json({
                    message: "No changes made"
                });
            }
        } catch (e) {
            res.status(500).json({
                message: "Error while updating information",

            });
        }
    } else {
        res.status(400).json({
            message: "Validation failed",

        });
    }
});



router.get('/bulk' , authMiddleWare , async function(req,res){
    const filter = req.query.filter || "";
    const id = req.userId;
    const users = await User.find({
        $or : [{
            firstName: {
                "$regex" : filter,
                "$options": "i"
            } },            
            {lastName: {
                "$regex" : filter,
                "$options": "i"
            }
        }]

    })
    const newUsers = users
    .filter(user => user.id !== id)
    .map(user => ({
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        _id: user._id
    }));

    res.send(newUsers);

})

router.get('/me' , authMiddleWare,function(req,res){
    res.send({
        message : "Verified"
    })
})


module.exports = router

