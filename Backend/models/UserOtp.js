const mongoose = require("mongoose");
const validator = require("validator");


const UserOtpSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Not Valid Email")
            }
        }
    },
    otp:{
        type:String,
        required:true
    },
    expiresAt:{
        type: Date,
        default: () => new Date(Date.now() + 10 * 60 * 1000),
        index: { expires: 0 }
    }
});


// user otp model
const UserOtp = new mongoose.model("userotps",UserOtpSchema);

module.exports = UserOtp