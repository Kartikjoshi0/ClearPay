const mongoose =require('mongoose');


mongoose.connect('mongodb+srv://kartik:EWwXBDrbTAfqhA6M@cluster0.euktqhn.mongodb.net/')

const UserSchema=new mongoose.Schema({
    firstname:{
        type:String,
        required:true,
        maxlength:50
    },
    lastname:
        {
            type:String,
            required:true,
            maxlength:50
        },
    username:{
        type:String,
        required:true,
        unique:true,
        minlength:6,
        maxlength:50
    },
    password:{
        
            type:String,
            required:true,
            unique:true,
            minlength:8
        
    }
})

const accountSchema=new mongoose.Schema({
    uerId:{
        // type:mongoose.Schema.Types.ObjectId,
        // ref:"User",
        type:String,
        required:true
    },
    balance:{
        type:Number,
        required:true
    }
})

const User=mongoose.model('User',UserSchema);
const Account=mongoose.model('Account',accountSchema);

module.exports={
    User,
    Account
} 