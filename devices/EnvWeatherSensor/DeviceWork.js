const DeviceCredentials = require('./DeviceCredentials')

class DeviceWork {
    constructor () {
        const Credentials = new DeviceCredentials();
        this.device_id = Credentials.device_id;
        this.serial_number = Credentials.serial_number;
    }

    async operationData() {
        const temperature = this.temperature()
        console.log(temperature)
        const humidity = this.humidity()
        const timestamp = this.timestamp()
        return {temperature,humidity,timestamp}
    }

     temperature() {
        return (Math.random() * 10 + 20).toFixed(2); 
    }

     humidity() {
        return (Math.random() * 20 + 40).toFixed(2);
    }

     timestamp() {
        return new Date().toISOString();
    }
}

new DeviceWork ().operationData()

module.exports = DeviceWork