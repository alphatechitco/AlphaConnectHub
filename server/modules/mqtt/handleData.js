const mqtt = require('mqtt');
const bcrypt = require('bcryptjs');
const handleCred = require('./handleCred');
const Devices = require('../Devices/Devices');
const { sendToFrontend } = require('../../socketService');

class HandleData {
    constructor() {
        this.mqtt_url = "ws://34.69.42.86:8083/mqtt";
        this.hc = new handleCred();
        this.dv = new Devices();
        this.client = null;
        this.clientOF = true;
        this.dataBuffer = [];  // Store incoming data temporarily
        this.cleanupInterval = null; // Timer for auto-cleanup
    }

    // Authenticate user and subscribe
    async authenticateClient(res, user_id, profile_id, username, password, password_flag, device_id) {
        try {
            const credentials = await this.hc.getCred(user_id, profile_id, "WS", password_flag);
            const deviceData = await this.dv.getDevices(device_id,profile_id);
            const authenticated = await bcrypt.compare(password, credentials.details[0].password_hash);

            if (!authenticated) {
                console.error("Authentication Failed");
                return res.status(401).json({ auth: false });
            }

            await this.subscribe(credentials, password, deviceData);
            return res.status(200).json({ auth: true });

        } catch (err) {
            console.error("Authentication Error:", err);
            return res.status(500).json({ auth: false, error: "Internal Server Error" });
        }
    }

    // Subscribe to MQTT topic
    async subscribe(credentials, password, deviceData) {
        try {
            this.client = mqtt.connect(this.mqtt_url, {
                username: credentials.details[0].username,
                password: password,
                clientId: credentials.details[0].client_id,
                keepalive: 60,
                reconnectPeriod: 1000,
                connectTimeout: 30 * 1000,
                clean: true,
                protocolVersion: 4
            });

            this.client.on('connect', () => {
                console.log('Connected to EMQX');
                this.clientOF = false;
                const topic = deviceData[0].mqtt_topic;
                this.client.subscribe(topic, (err) => {
                    if (!err) {
                        console.log(`Subscribed to topic: ${topic}`);
                    } else {
                        console.error('Subscription error:', err);
                    }
                });
            });

            this.client.on("message", (topic, message) => {
                const msg = message.toString();
                console.log(`Received message on ${topic}: ${msg}`);

                // Store message in buffer
                this.dataBuffer.push({ topic, message: msg });
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

   // Graceful disconnect
disconnectClient() {
    console.log("Attempting MQTT disconnect...");
    
    if (this.client && this.client.connected) { // ✅ Ensure the client exists and is connected
        this.client.unsubscribe("#", (err) => { // ✅ Unsubscribe from all topics
            if (err) {
                console.error("Error unsubscribing:", err);
            } else {
                console.log("Successfully unsubscribed from all topics.");
                
                // End the MQTT connection
                this.client.end(false, () => {
                    console.log("MQTT connection closed!");
                    
                    // Mark client as disconnected
                    this.clientOF = true;
                });
            }
        });
    } else {
        console.log("No active MQTT client to disconnect.");
    }

    // Clear data buffer
    this.clearDataBuffer();
}

    

    // Auto-clear data every 5 minutes
    startAutoCleanup() {
        this.cleanupInterval = setInterval(() => {
            console.log("Auto-cleaning data buffer...");
            this.clearDataBuffer();
        }, 5 * 60 * 1000); // 5 minutes
    }

    // Clear data buffer and stop the cleanup timer
    clearDataBuffer() {
        this.dataBuffer = [];
        console.log("Data buffer cleared.");

        if (this.cleanupInterval) {
            clearInterval(this.cleanupInterval);
            this.cleanupInterval = null;
        }
    }
}


module.exports = new HandleData();
