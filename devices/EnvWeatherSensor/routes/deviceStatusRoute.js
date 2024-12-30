const express = require('express')
const router = express.Router();;;
const DeviceOperation = require('../DeviceOperation')


router.get('/status', async (req, res) => {
    try {
        console.log("API Called")
        const devicePower =  DeviceOperation.devicePower;
        const deviceOperation = DeviceOperation.deviceOperation;
        console.log("POwer", devicePower)
        console.log("Operation", deviceOperation)
        res.status(200).json({power:devicePower, operation:deviceOperation})

    } catch (error) {
        res.status(500).json("Internal Server Error")
    }

})

module.exports = router;