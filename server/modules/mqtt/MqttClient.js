const mqtt = require("mqtt");
const bcrypt = require("bcrypt");
const Devices = require("../Devices/Devices");
const handleCred = require("./handleCred");
class MqttClient {
    constructor() {
        this.mqtt_url = "ws://34.69.42.86:8083/mqtt"; // ✅ Set MQTT URL here
        this.hc = new handleCred();
        this.dv = new Devices();
        this.client = null;
        this.clientOF = true;
        this.dataBuffer = [];  // Store incoming data temporarily
        this.cleanupInterval = null; // Timer for auto-cleanup
    }

    // Authenticate user and subscribe
    async authenticateClient(res, user_id, profile_id, password, password_flag) {
        try {
            const credentials = await this.hc.getCred(user_id, profile_id, "WS", password_flag);
               
            const authenticated = await bcrypt.compare(password, credentials.details[0].password_hash);
    
            if (!authenticated) {
                console.error("Authentication Failed");
                return res.status(401).json({ auth: false });
            }
    
            await this.connectClient(credentials, password);
            return res.status(200).json({ auth: true });
    
        } catch (err) {
            console.error("Authentication Error:", err);
            return res.status(500).json({ auth: false, error: "Internal Server Error" });
        }
    }

    // Connect to MQTT Server
    async connectClient(credentials, password) {
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
                console.log('Connected to MQTT');
                this.clientOF = false;
            });

            this.client.on('error', (err) => {
                console.error('MQTT Connection Error:', err);
            });

        } catch (err) {
            console.error('Error during Connection:', err);
        }
    }

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
    }

    getClient() {
        return this.client;
    }
}

// ✅ Exporting the MQTT client instance so it can be used in other modules
const mqttInstance = new MqttClient();
module.exports = {mqttInstance , getClient: () => mqttInstance.getClient()};
