const express = require('express');
const Profile = require('../modules/Profiles/Profile');
const { profile } = require('winston');
const router = express.Router();

router.post('/getProfiles', async (req, res) => {
    try {
        console.log("API");

        const {user_id} = req.body;
        console.log(user_id);
        const PF = new Profile();
        const result = await PF.getProfiles(user_id);

        if(result.fetch) {
            res.status(200).json({success:true, profiles:result.profile})
        } else {
            res.status(400).json({success:false, profile:""})
        }
    }  catch (error) {
        res.status(500).json({success:false, message:"Internal Server Error"})
    }
})

router.post('/addProfile', async (req, res) => {
    try {
        console.log("API");
        const profileData = req.body;
        console.log(profileData)
        const PF = new Profile();
        const result = await PF.addProfile(profileData);

        if(result.make) {
            res.status(200).json({success:true, profiles:result.profile})
        } else if (!result.make){
            res.status(400).json({success:false, profile:""})
        }
    }  catch (error) {
        res.status(500).json({success:false, message:"Internal Server Error"})
    }
})


module.exports = router;
