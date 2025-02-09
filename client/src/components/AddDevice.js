import React, { useState } from "react";
import axios from "axios";
import './AddDevice.css';

const AddDevice = ({ user_id, profile_id }) => {
    const [deviceDetails, setDeviceDetails] = useState({
        device_name: "",
        device_type: "",
        description: ""
    });
    console.log("prof", profile_id)
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const deviceTypes = [
        "Temperature Sensor",
        "Humidity Sensor",
        "Air Quality Sensor",
        "Motion Detector",
        "Light Sensor",
        "Gas Sensor",
        "Water Flow Sensor",
        "Vibration Sensor",
        "GPS Module",
        "Smart Plug",
        "Relay Module",
        "ESP32",
        "Arduino",
        "Raspberry Pi",
        "Other"
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setDeviceDetails((prev) => ({ ...prev, [name]: value }));
    };

    const generateMQTTTopic = () => {
        return `user/${user_id}/profile/${profile_id}/device/${deviceDetails.device_name.replace(/\s+/g, '_')}`;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const mqtt_topic = generateMQTTTopic();

        try {
            const response = await axios.post("http://localhost:3001/devices/reg-device", {
                ...deviceDetails,
                user_id,
                profile_id,
                mqtt_topic
            });

            if (response.data.result.reg) {
                setSuccessMessage("✅ Device added successfully!");
                setDeviceDetails({ device_name: "", device_type: "", description: "" });
            } else {
                setErrorMessage("❌ Failed to add device.");
            }
        } catch (error) {
            console.error("Error:", error);
            setErrorMessage("❌ An error occurred while adding the device.");
        }
    };

    return (
        <div className="add-device-container">
            <h2>Add New IoT Device</h2>

            {successMessage && <p className="success">{successMessage}</p>}
            {errorMessage && <p className="error">{errorMessage}</p>}

            <form onSubmit={handleSubmit}>
                <label>Device Name:</label>
                <input
                    type="text"
                    name="device_name"
                    value={deviceDetails.device_name}
                    onChange={handleChange}
                    required
                    placeholder="Enter device name"
                />

                <label>Device Type:</label>
                <select
                    name="device_type"
                    value={deviceDetails.device_type}
                    onChange={handleChange}
                    required
                >
                    <option value="">Select Device Type</option>
                    {deviceTypes.map((type, index) => (
                        <option key={index} value={type}>{type}</option>
                    ))}
                </select>

                <label>Description:</label>
                <textarea
                    name="description"
                    value={deviceDetails.description}
                    onChange={handleChange}
                    placeholder="Describe the device"
                ></textarea>

                <button type="submit">Add Device</button>
            </form>
        </div>
    );
};

export default AddDevice;
