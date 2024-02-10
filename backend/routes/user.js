const zod=require('zod')
const jwt=require('jsonwebtoken')
const {User,Account}=require('../db')
const {JWT_SECRET}=require('../config');
const { authMiddleware } = require('../middlewares/middleware');


const router=require('express').Router();

const signupBody=zod.object({
    firstname:zod.string(),
    lastname:zod.string(),
    username:zod.string().email(),
    password:zod.string()
})

router.post('/signup',async(req,res)=>{
    const {success}= signupBody.safeParse(req.body);
    if(!success){
        return res.status(411).json({
            message: "Email already taken / Incorrect inputs"
        })
    }
    const existingUser=User.findOne({
        username:req.body.username
    })


    if(existingUser){
        return res.status(411).json({
            message: "Email already taken/Incorrect inputs"
        })
    }

    
    const dbuser=await User.create({
        firstname:req.body.firstname,
        lastname:req.body.lastname,
        username: req.body.username,
        password: req.body.password,
    })

    const userId=dbuser._id;
    const token=jwt.sign({
        userId
    },JWT_SECRET)
// creating default balance
    await Account.create({
        userId,
        balance: 1 + Math.random() * 10000
    })

    res.json({
        message: "User created successfully",
        token: token
    })

})

const signinBody=zod.object({
    username:zod.string().email(),
    password:zod.string()
})
router.get('/signin' ,async (req,res)=>{
    const {success} = signinBody.safeParse(req.body);
    if(!success){
        return res.status(411).json({
            message: "Incorrect inputs"
        })
    }
    const dbuser=await User.findOne({
        username:req.body.username,
        password:req.body.password
    })

    if(dbuser){
        const token=jwt.sign({
            userid:dbuser._id
        },JWT_SECRET)

        res.json({
            token: token
        })
        return
    }

    res.status(411).json({
        message: "Error while logging in"
    })
})

const updateBody=zod.object({
    password: zod.string().optional(),
    firstName: zod.string().optional(),
    lastName: zod.string().optional(),
})
router.put('/',authMiddleware,async(req,res)=>{
    const {success} = updateBody.safeParse(req.body);
    if(!success){
        res.status(411).json({
            message: "Error while updating information"
        })
    }
    
    await User.updateOne(
        req.body,
    {
        id:req.userId
    })
    res.json({
        message:"Updated Successfully"
    })
})

router.get("/bulk", async (req, res) => {
    const filter = req.query.filter || "";

    const users = await User.find({
        $or: [{
            firstName: {
                "$regex": filter
            }
        }, {
            lastName: {
                "$regex": filter
            }
        }]
    })

    res.json({
        user: users.map(user => ({
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            _id: user._id
        }))
    })
})

module.exports=router;