const axios = require('axios');
const DeviceWork = require('./DeviceWork');
const OwnerCredentials = require('./OwnerCredentials');

class DeviceOperation {
    constructor() {
        this.RTapiEndpoint = "http://localhost:3001/devices/realtime/operation";
        this.STapiEndpoint = "http://localhost:3001/devices/data";
        this.deviceWork = new DeviceWork();
        this.ownerCredentials = new OwnerCredentials();
        this.latestSensorData = null; // Stores the latest generated sensor data
        this.ONintervalID = null; // Interval ID for DeviceON
        this.OperationIntervalID = null; // Interval ID for data transmission
        this.devicePower = null ;
        this.deviceOperation = null;
    }

    async DeviceON() {
        try {
            this.latestSensorData = await this.deviceWork.operationData();
            console.log("Device ON - Generating Data:", this.latestSensorData);
        } catch (error) {
            console.error("Error in DeviceON:", error.message);
        }
    }

    async sendOperationData() {
        try {
            if (!this.latestSensorData) {
                console.warn('No sensor data available to send.');
                return;
            }

            const apiKey = this.ownerCredentials.api_key;
            const headers = {
                "Device-ID": this.deviceWork.device_id,
                "Serial-Number": this.deviceWork.serial_number,
                "API-Key": apiKey,
            };

            await axios.post(this.RTapiEndpoint, { sensorData: this.latestSensorData }, { headers });
            console.log("Data Sent:", this.latestSensorData);
        } catch (error) {
            console.error("Error Sending Data:", error.message);
        }
    }

    startDeviceON(interval = 1000) {
        if (this.ONintervalID) {
            console.log('DeviceON is already running.');
            return;
        }
        this.ONintervalID = setInterval(() => this.DeviceON(), interval);
        this.devicePower = true;
        console.log(`DeviceON started with interval: ${interval}ms`);
    }

    startDataTransmission(interval = 5000) {
        console.log("HERE")
        if (this.OperationIntervalID) {
            this.deviceOperation = true;
            console.log('Data transmission is already running.');
            return;
        }
        this.OperationIntervalID = setInterval(() => this.sendOperationData(), interval);
        this.deviceOperation = true;
        console.log(`Data transmission started with interval: ${interval}ms`);
    }

    stopDeviceON() {
        if (this.ONintervalID) {
            clearInterval(this.ONintervalID);
            this.ONintervalID = null;
            this.devicePower = false;
            console.log('DeviceON stopped.');
        } else {
            console.log('DeviceON was not running.');
        }
    }

    stopDeviceDataTrans() {
        if (this.OperationIntervalID) {
            clearInterval(this.OperationIntervalID);
            this.OperationIntervalID = null;
            this.deviceOperation = false
            console.log('Data transmission stopped.');
        } else {
            console.log('Data transmission was not running.');
        }
        this.deviceOperation = false
    }
}

module.exports = new DeviceOperation(); // Ensures a single shared instance
