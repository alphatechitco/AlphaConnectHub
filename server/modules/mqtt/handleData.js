const { getClient } = require('./MqttClient');
const { sendToFrontend } = require('../../socketService');
const {connectDB} = require('../../database/mongodbconfig');
const handleCred = require('./handleCred');
const Devices = require('../Devices/Devices');

class HandleData {
    constructor() {
        this.hc = new handleCred();
        this.dv = new Devices();
        this.client = getClient();
        this.dataBuffer = [];  // Store incoming data temporarily
        this.cleanupInterval = null; // Timer for auto-cleanup
    }

    async saveIoTData(topic, data){
        const db = await connectDB();
        const collection = db.collection("deviceData");

        const newData = {
            topic,
            data,
            timestamp: new Date(),
        };

        await collection.insertOne(newData);
        console.log("📊 Data saved to MongoDB:", newData);

    }

    async getIoTData(topic){
        console.log("topic Retr", topic);
        const db = await connectDB();
        console.log("Connected to DB:", db.databaseName);
        const collection = db.collection("deviceData");

        const query = {
            topic: topic,
        }

        const results = await collection.find(query).toArray()//.sort({timestamp:-1}).toArray();

        console.log("📊 Retrieved IoT Data:", results);
        return results;
    }
    

    // Subscribe to MQTT topic
    async subscribeToData(res, device_id, profile_id) {
        try {

            const deviceData = await this.dv.getDevices(device_id, profile_id);
            console.log("Device Data,", deviceData);
                const topic = deviceData.result[0].mqtt_topic;
                this.client.subscribe(topic, (err) => {
                    if (!err) {
                        console.log(`Subscribed to topic: ${topic}`);
                        res.status(200).json({live:true});

                    } else {
                        console.error('Subscription error:', err);
                        res.status(500).json({live:false});
                    }
                });
            

                this.client.on("message", (topic, message) => {
                const msg = message.toString();
                console.log(`Received message on ${topic}: ${msg}`);

                // Store message in buffer
                this.dataBuffer.push({ topic, message: msg });
                this.saveIoTData(topic, msg);
                sendToFrontend('mqtt_message', { topic, message: msg });

                // Start auto-cleanup timer if not already running
                if (!this.cleanupInterval) {
                    this.startAutoCleanup();
                }
            });

            this.client.on('error', (err) => {
                console.error('MQTT Connection Error:', err);
            });

        } catch (err) {
            console.error('Error during subscription:', err);
        }
    }


}


module.exports = new HandleData();
