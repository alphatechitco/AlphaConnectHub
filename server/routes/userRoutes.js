const express = require('express')
const router = express.Router();
const SignFunctionality = require('../modules/Users/SignFunctionality')
const tokenWork = require('../modules/Tokens/tokenWork');
const { auth } = require('../database/dbconfig');


router.post('/register', async (req, res)=>{
    try{
        const data = req.body;
        console.log("API Route, ", data)

        const sf = new SignFunctionality(data);
        const result = await sf.signUp(data);

        if (result.success) {
            const user_id = result.user_id
            const token = tokenWork.generateToken(user_id)
            res.status(200).json({message:"Registration Success",success:true, user_id, token})
        } else {
            res.status(400).json({message:"Error Registering User",success:false})
        }


    } catch (error) {
        console.error("Error While Register, ", error)
        res.status(500).json({message:"Internal Server Error"})
    } 
})

router.post('/login', async (req, res) => {
    console.log("API Called")
    try {
        const loginData = req.body
        const sf = new SignFunctionality ();
        const result = await sf.loginIn(loginData)

        if (!result.account) {
            return res.status(404).json({success: false, account: false, message:"Invalid Credentials"})
        }

        if (!result.success) {
            return res.status(400).json({success:false, account: true, message: "Invalid Password"})
        }

        const user_id = result.user_id
        const token = tokenWork.generateToken({user_id});
        res.cookie("token", token, {
            httpOnly: true,
            secure: false,   // false (localhost) true (https)
            sameSite:'strict',
            maxAge:'3600000'
        })
        console.log("Router 200")
        res.status(200).json({success:true, account: true, message:"Login Successful"})


    } catch (error) {
        res.status(500).json({message:"Internal Server Error"})
    }
})

router.post('/logout', async (req, res) => {
    try {
        res.clearCookie("token", {path:"/"});
        res.status(200).json({ success: true, message: "Logged out successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Logout failed" });
    }
})

router.post("/google-login", async (req, res) => {
    try {
        const { id_token } = req.body;
        if (!id_token) {
            return res.status(400).json({ success: false, message: "Token missing" });
        }
        const sf = new SignFunctionality();
        const result = await sf.googleLogin(id_token)
        const id = result.id;
        const email = result.email;
        const token = tokenWork.generateToken({id,email});
        console.log("Auth Gen Token", token);
        res.cookie("token", token, {
            httpOnly: true,
            secure: false,   // false (localhost) true (https)
            sameSite:'strict',
            maxAge:'3600000'
        })
        res.status(200).json({success:true, account: true, message:"Login Successful"})
    } catch (error) {
        console.error("Google login error:", error);
        res.status(400).json({ success: false, message: error.message });
    }
});
module.exports = router;