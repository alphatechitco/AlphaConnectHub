const express = require('express');
const router = express.Router();
const handleCred = require('../modules/mqtt/handleCred');
const tokenWork = require('../modules/Tokens/tokenWork');
const handleData = require('../modules/mqtt/handleData')
const {mqttInstance} = require('../modules/mqtt/MqttClient');


router.post('/getCred', async (req, res) => {
    console.log("API")

    try {
        const token = req.headers['authorization'] && req.headers['authorization'].split(' ')[1];

        if (!token) {
            return res.status(403).send({message:'No Token Provided'})
        }
        const verify = await tokenWork.verifyToken(token);
        if(!verify) {
            return res.status(401).send({message:'Unauthorized Access'})
        }
        const {user_id, group_id} = req.body;
        console.log(token, user_id, group_id)

        const HC = new handleCred();

        const result = await HC.assignGroup(user_id, group_id)
        console.log("REs", result)
        if(result.assign) {
            res.status(200).json(result)
        }
    } catch (error) {
        console.log("Error While Fetching")
        res.status(500).json("Internal Server Error")
    }
})


router.put('/reset-cred/:reg_id', async (req, res) => {
    try {
        console.log(req.params.reg_id, req.body);
        const reg_id = req.params.reg_id;
        const {password} = req.body

        const HC = new handleCred();
        const result = await HC.resetPassword(reg_id, password);

        if(result.reset) {
            res.status(200).json({reset:true,message:"Success"})
        } else if(!result.reset) {
            res.status(403).json({reset:false,message:"Reset Failed"})
        }
    } catch (error) {
        res.status(500).json({reset:false,message:"Reset Failed"})
    }
})


router.get('/get-mqtt-mongodb', async (req, res) => {
    const {topic} = req.query;

    const result = await handleData.getIoTData(topic);
    res.status(200).json(result);
})

router.get('/getGroups', async (req, res) => {
    console.log("API")
    try {
        const HC = new handleCred()
        const result = await HC.getGroups();
        console.log("REs", result)

        res.status(200).json(result)
    } catch (error) {
        res.status(500).json("Internal Server Error", error)
    }
})


router.post('/register-client', async (req, res) => {

    try {
        const submissionData = req.body;
        const HC =  new handleCred();
        const result = await HC.addUserToEMQX(submissionData);

        if(result.success) {
            res.status(200).json({success:true, reg_id:result.reg_id})
        } else {
            res.status(400).json({success:false, message:"Registration Failed"})
        }
    } catch {
        res.status(500).json("Internal Server Error")
    }
})

router.post('/get-details', async (req, res) => {
    try {

        const {user_id,profile_id, creds_mode} = req.body;
        console.log(user_id, profile_id);
        const password_flag = false;
        const HC = new handleCred();
        const result = await HC.getCred(user_id,profile_id,creds_mode, password_flag);

        if(result.cred) {
            res.status(200).json({success:true, creds:result.details})
        } else {
            res.status(400).json({success:false, message:"Access Not Registered Yet"})
        }
    }  catch (error) {
        res.status(500).json({success:false, message:"Internal Server Error"})
    }
})

router.post('/subscribeData', async (req, res) => {
    try {

        const {profile_id, device_id} = req.body;
        const result = await handleData.subscribeToData(res, device_id, profile_id);

    }  catch (error) {
        res.status(500).json({success:false, message:"Internal Server Error"})
    }
})

router.post('/connectClient', async (req, res) => {
    try {
        const {user_id,profile_id, password} = req.body;
        const password_flag = true;
        const result = await mqttInstance.authenticateClient(res,user_id,profile_id,password,password_flag);

    } catch (error) {
        console.error("Error While Connecting Client Route/Function, ", error);
        res.status(500).json({success:false, message:"Internal Server Error"});
    }
})

// Disconnect MQTT client when requested
router.post('/disconnect-mqtt', (req, res) => {
    console.log("API")
    handleData.disconnectClient();
    res.status(200).json({close:true, message: 'MQTT disconnected successfully.' });
});








module.exports = router;