const express = require('express');
const router = express.Router();
const Devices = require('../modules/Devices/Devices');


router.get('/FetchCode', async (req, res) => {
    try {
        const {device_type} = req.query;
        const device = new Devices();
        const result = await device.getDeviceCode(device_type);

        if(result.length>0) {
            return res.status(200).json(result);
        } else {
            return res.status(404).json("")
        }
    } catch (error) {
        console.error("Error In FetchCode Route/Function, ", error);
        res.status(500).json({"Error In FetchCode Route/Function, ": error});
    }
})

module.exports = router;