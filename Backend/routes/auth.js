const express = require('express');
const User = require('../models/User');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
var fetchuser = require('../middleware/fetchuser');
const userotp =require('../models/UserOtp');
const nodemailer=require("nodemailer");

const JWT_SECRET = process.env.JWT_SECRET;

const tarnsporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
  port: 587,
  secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
})

const getEmailContentWithOTP = (otp,heading,purpose) => {
    return`
    <!DOCTYPE html>
            <head>
                <title>iNotebook - OTP Verification</title>
            </head>
            <body style="margin: 0;padding: 0;background-color: #f2f2f2;font-family: Arial, sans-serif;">
              <div style="max-width: 600px;margin: 20px auto;background-color: #ffffff;border: 1px solid #e0e0e0;border-radius: 5px;padding: 20px;box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);" >
                <h2 style="color: #04143a;">OTP for ${heading}</h2>
                <p style="color: #444444;" >Please use the verification code below  ${purpose}</p>
                <h3><strong>${otp}</strong></h3>
                <p style="color: #444444;">If you didn't request this, you can ignore this email.</p>
                <p style="color: #444444;">Thanks,<br>The iNotebook team.</p>
                </div>
            </body>
        </html>
    `
  };

router.post('/createuser', [ 
    body('name', 'Name Must be Atleast 3 Characters').isLength({ min: 3 }),
    body('email', 'Enter valid Email').isEmail(),
    body('password', 'Password Must be Atleast 5 Characters').isLength({ min: 5 })
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        //check weather Email exist already
        let success = false;
        let user = await User.findOne({ email: req.body.email });
        if (user) {
            return res.status(400).json({success, error: "Email already exists" });
        }
        //create new User

        const salt = await bcrypt.genSalt(10);
        const secPass = await bcrypt.hash(req.body.password, salt);

        user = await User.create({
            name: req.body.name,
            password: secPass,
            email: req.body.email,
            hobbies: req.body.hobbies,
            mobile: req.body.mobile
        });

        const data = {
            user:{
                id: user.id
            }
        }
        const authToken = jwt.sign(data, JWT_SECRET, { expiresIn: '7d' });
        success = true;
        res.json({success, authToken}); 

        //res.json(user);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Some error Occured");
    }

});

router.post('/login', [
    body('email', 'Enter valid Email').isEmail(),
    body('password', 'Password should not be NULL').exists(),
], async (req, res) => {
    let success = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        let user = await User.findOne({ email: req.body.email });
        if (!user) {
            success = false
            return res.status(400).json({ error: "Invalid Credentials" });
        }

        const passwordCompare = await bcrypt.compare(req.body.password, user.password);
        if(!passwordCompare){
            success = false
            return res.status(400).json({ success, error: "Please try to login with correct credentials" });
        }

        const data = {
            user:{
                id: user.id
            }
        }
        const authToken = jwt.sign(data, JWT_SECRET, { expiresIn: '7d' });

        success = true;
        res.json({ success, authToken })

        //res.json(user);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Some error Occured");
    }

})

router.post('/getuser', fetchuser,  async (req, res) => {

    try {
      const userId = req.user.id;
      const requserid  = req.body.userid;
      let user;
      if(requserid.length === 0){ 
        user = await User.findById(userId).select("-password")
      }
      else{
        user = await User.findById(requserid).select("-password")
      }
      res.send(user)
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
    }
  })

  router.post('/verifyEmail',  async (req, res) => {

    try {
      const user = await User.findOne({email: req.body.email})
      let success = "false";
      if(user){
        success = "true";
      }
      res.send({resp: success});
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
    }
  })

  router.get('/getAllUsers', fetchuser,  async (req, res) => {

    try {
      let allUsers = await User.find({ _id: { $ne: req.user.id } }, '_id email');
      allUsers = allUsers.map(user => ({
        value: user._id,
        label: user.email
      }));
      res.send(allUsers)
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
    }
  })

router.post('/updateUser', fetchuser,  async (req, res) => {

    try {
        const { name, mobile, hobbies, profileImage, password, bio } = req.body;

        const updatedUser = {};
        if(name.length !==0){
            updatedUser.name = name;
        }
        if(password.length !==0){
            const salt = await bcrypt.genSalt(10);
            const secPass = await bcrypt.hash(password, salt);
            updatedUser.password = secPass;
        }
        if(mobile.length !==0){
            updatedUser.mobile = mobile;
        }
        if(profileImage === "remove"){
            updatedUser.profileImage = "";
        } else if(profileImage.length !==0){
            updatedUser.profileImage = profileImage;
        }
        if(hobbies.length !==0){
            updatedUser.hobbies = hobbies;
        }
        if(bio !== undefined){
            updatedUser.bio = bio;
        }

        let user = await User.findByIdAndUpdate(
            req.user.id,
            { $set: updatedUser },
            { new: true }
        );

        res.json(user);

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})

router.post('/forgotPassword',  async (req, res) => {

    try {
        const { reqemail, password, otp } = req.body;

        const otpRecord = await userotp.findOne({ email: reqemail });
        if (!otpRecord || String(otpRecord.otp) !== String(otp)) {
            return res.status(400).json({ error: "Invalid or expired OTP" });
        }

        const updatedUser = {};
        const salt = await bcrypt.genSalt(10);
        const secPass = await bcrypt.hash(password, salt);
        updatedUser.password = secPass;

        let user = await User.findOneAndUpdate(
            {email: reqemail},
            { $set: updatedUser },
            { new: true }
        );

        res.json({success: true});

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})

router.post('/userotpsend',async(req,res)=>{
    const {email,heading,purpose}=req.body;
    if (!email) {
        return res.status(400).json({ error: "Please Enter Your Email" })
    }
    try{
        const OTP = Math.floor(100000 + Math.random() * 900000);
        const emailContentWithOTP = getEmailContentWithOTP(OTP,heading,purpose);

        const existEmail = await userotp.findOne({ email: email });

        if (existEmail) {
            await userotp.findByIdAndUpdate(existEmail._id, { otp: OTP, expiresAt: new Date(Date.now() + 10 * 60 * 1000) });
        } else {
            await new userotp({ email, otp: OTP }).save();
        }

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Sending Email For Otp Validation",
            html: emailContentWithOTP
        };

        await tarnsporter.sendMail(mailOptions);
        return res.status(200).json({ message: "Email sent Successfully" });
    } catch (error) {
        console.error("OTP send error:", error.message);
        return res.status(400).json({ error: "Failed to send OTP email" });
    }
})
router.post('/userotpverify',async(req,res)=>{
    const {email,otp} = req.body;

    if(!otp || !email){
        return res.status(400).json({ error: "Please Enter Your OTP and email" })
    }
    if(!/^[0-9]{6}$/.test(otp)){
        return res.status(400).json({ error: "OTP must be 6 digits" })
    }
    try {
        const otpverification = await userotp.findOne({email:email});

        if(otpverification && String(otpverification.otp) === String(otp)){
            return res.status(200).json({message:"Otp verified Successfully"})

        }else{
            return res.status(400).json({error:"Invalid Otp"})
        }
    } catch (error) {
        return res.status(400).json({ error: "Invalid Details" })
    }
})



module.exports = router