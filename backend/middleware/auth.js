const { User } = require("../db");
const { UserSchema } = require("../zodschema/schema");
function authorization(req,res,next){
    const result = UserSchema.safeParse(req.body);
    if(result.success){
        next();
    }
    else{
        res.status(411).json({
            message: "Incorrect inputs"
        })
    }


}
async function secondMiddleWare(req,res,next){
    const user = await User.findOne(
        {username : req.body.username}
    );
    if(user){
        res.status(411).json({
            message: "Email already taken / Incorrect inputs"
        })
    }
    else{
        next();
    }
}
module.exports = {authorization , secondMiddleWare};