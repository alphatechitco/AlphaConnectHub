const mqtt = require('mqtt');
const client = mqtt.connect('mqtt://localhost:1883', {
    username: 'username',
    password: 'ACHU1'
});

client.on('connect', function () {
    console.log('Connected to MQTT broker');
    client.subscribe('your_topic', function (err) {
        if (err) {
            console.error('Subscription error:', err);
        } else {
            console.log('Subscribed to topic');
            client.publish('your_topic', 'Hello from MQTT!', function (err) {
                if (err) {
                    console.error('Publish error:', err);
                } else {
                    console.log('Message published');
                }
            });
        }
    });
});

client.on('error', function (error) {
    console.error('Connection failed:', error);
});
