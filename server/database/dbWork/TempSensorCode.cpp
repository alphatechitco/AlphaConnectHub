#include <WiFi.h>
#include <PubSubClient.h>
#include <ArduinoJson.h>

const char* ssid = "${ssid}"; // Write Your Wifi Network Name
const char* password = "${password}"; // Write Your Wifi Password 
const char* mqtt_server = "${mqtt_server}";
const int mqtt_port = "${mqtt_port}" ;

const char* mqtt_username = "${username}";
const char* mqtt_password = "${mqtt_password}"; //Write Ur Password Here

WiFiClient espClient;
PubSubClient client(espClient);

const int sensorPin = "${sensorPin}";
const int relayPin = 2;  // Pin to control a device (ON/OFF)
float tempThreshold = 25.0; // Default temperature threshold

void connectToWiFi() {
    Serial.println("Connecting to WiFi...");
    WiFi.begin(ssid, password);
    while (WiFi.status() != WL_CONNECTED) {
        delay(1000);
        Serial.print(".");
    }
    Serial.println("\nWiFi connected");
    Serial.print("IP Address: ");
    Serial.println(WiFi.localIP());
}

void connectToMQTT() {
    while (!client.connected()) {
        Serial.println("Connecting to MQTT...");
        if (client.connect("${client_id}", mqtt_username, mqtt_password)) {
            Serial.println("Connected to MQTT");

            // Subscribe to the topic for device control
            client.subscribe("${mqtt_control_topic}");
        } else {
            Serial.print("Failed to connect to MQTT, rc=");
            Serial.println(client.state());
            delay(2000);
        }
    }
}

// Function to handle incoming MQTT messages
void mqttCallback(char* topic, byte* payload, unsigned int length) {
    Serial.print("Message received on topic: ");
    Serial.println(topic);
    
    char message[length + 1];
    memcpy(message, payload, length);
    message[length] = '\0';

    Serial.print("Message: ");
    Serial.println(message);

    // Parse JSON message
    StaticJsonDocument<200> doc;
    DeserializationError error = deserializeJson(doc, message);
    
    if (error) {
        Serial.println("Failed to parse JSON");
        return;
    }

    // Check for device ON/OFF command
    if (doc.containsKey("command")) {
        String command = doc["command"].as<String>();
        if (command == "on") {
            digitalWrite(relayPin, HIGH); // Turn device ON
            Serial.println("Device turned ON");
        } else if (command == "off") {
            digitalWrite(relayPin, LOW); // Turn device OFF
            Serial.println("Device turned OFF");
        }
    }

    // Check for temperature threshold update
    if (doc.containsKey("threshold")) {
        tempThreshold = doc["threshold"].as<float>();
        Serial.print("New Temperature Threshold: ");
        Serial.println(tempThreshold);
    }
}

void setup() {
    Serial.begin(115200);
    pinMode(relayPin, OUTPUT); // Set relay pin as output
    digitalWrite(relayPin, LOW); // Ensure it's OFF initially

    connectToWiFi();
    client.setServer(mqtt_server, mqtt_port);
    client.setCallback(mqttCallback);
    connectToMQTT();
}

void loop() {
    if (!client.connected()) {
        connectToMQTT();
    }
    client.loop();

    int rawValue = analogRead(sensorPin);
    float voltage = rawValue * (3.3 / 4095.0);
    float temperature = voltage * 100.0;

    Serial.print("Temperature: ");
    Serial.print(temperature);
    Serial.println("°C");

    String tempPayload = String(temperature);
    client.publish("${mqtt_data_topic}", tempPayload.c_str());

    // Compare with threshold and take action
    if (temperature > tempThreshold) {
        digitalWrite(relayPin, HIGH); // Turn device ON if temp exceeds threshold
        Serial.println("Temperature exceeded threshold! Turning device ON.");
    } else {
        digitalWrite(relayPin, LOW);
        Serial.println("Temperature is normal. Device OFF.");
    }

    delay(5000);
}
