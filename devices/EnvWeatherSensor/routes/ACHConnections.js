const express = require('express')
const router =express.Router()


router.post('/sendData', async (req, res) => {
    try {
        const devicework = new DeviceWork();
        const OC = new OwnerCredentials();
        const sensorData = await devicework.operationData();
        console.log(sensorData)
        const api_key = OC.api_key
        

        axios.post(RTapiEndpoint, { sensorData }, { headers : {
            "Device-ID" : devicework.device_id,
            "Serial-Number" : devicework.serial_number,
            "API-Key" : api_key,
        }})
        .then(response => {
            console.log("Data Sent")
        })
        .catch (err => {
            console.error("Error Sending Data,", err.message)
        })
    } catch (error) {
        console.log("Error In OperationData")
    }
})


module.exports = router