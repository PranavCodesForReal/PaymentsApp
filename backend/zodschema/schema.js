const zod = require('zod');
const UserSchema = zod.object({
    username : zod.string().min(3).max(30),
    password : zod.string().min(6),
    firstName : zod.string().max(50),
    lastName : zod.string().max(50)
})

const SigninSchema = zod.object({
    username : zod.string(),
    password : zod.string()
})
module.exports = {UserSchema,SigninSchema}
